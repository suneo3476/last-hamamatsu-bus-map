/**
 * 浜松終バスマップ - メインアプリケーション
 */

(function() {
  'use strict';

  // DOM要素
  const mapSvg = document.getElementById('map');
  const timeCirclesGroup = document.getElementById('time-circles');
  const routesGroup = document.getElementById('routes');
  const stopsGroup = document.getElementById('stops');
  const timeSlider = document.getElementById('time-slider');
  const currentTimeDisplay = document.getElementById('current-time');
  const playBtn = document.getElementById('play-btn');
  const resetBtn = document.getElementById('reset-btn');
  const infoPanel = document.getElementById('info-panel');
  const panelTitle = document.getElementById('panel-title');
  const panelContent = document.getElementById('panel-content');
  const closePanel = document.getElementById('close-panel');

  // 状態
  let isPlaying = false;
  let playInterval = null;
  let currentMinutes = 1260; // 21:00 = 21 * 60

  // 定数
  const CENTER_RADIUS = 20;
  const MAX_RADIUS = 350;
  const TIME_START = 1260; // 21:00
  const TIME_END = 1470;   // 24:30

  /**
   * 分を時刻文字列に変換
   */
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHours = hours >= 24 ? hours : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * 時刻文字列を分に変換
   */
  function timeToMinutes(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
  }

  /**
   * 同心円（時間軸）を描画
   */
  function drawTimeCircles() {
    timeCirclesGroup.innerHTML = '';

    const timeMarks = [1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470]; // 21:00から24:30まで30分刻み

    timeMarks.forEach((time, index) => {
      const radius = CENTER_RADIUS + ((MAX_RADIUS - CENTER_RADIUS) * (time - TIME_START) / (TIME_END - TIME_START));

      // 円
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', 0);
      circle.setAttribute('cy', 0);
      circle.setAttribute('r', radius);
      circle.setAttribute('class', 'time-circle');
      timeCirclesGroup.appendChild(circle);

      // ラベル
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', 5);
      label.setAttribute('y', -radius + 12);
      label.setAttribute('class', 'time-circle-label');
      label.textContent = minutesToTime(time);
      timeCirclesGroup.appendChild(label);
    });
  }

  /**
   * 路線とバス停を描画
   */
  function drawRoutes() {
    if (typeof BUS_DATA === 'undefined') {
      console.warn('BUS_DATA が読み込まれていません');
      return;
    }

    routesGroup.innerHTML = '';
    stopsGroup.innerHTML = '';

    const routes = BUS_DATA.routes || [];
    const angleStep = (2 * Math.PI) / routes.length;

    routes.forEach((route, routeIndex) => {
      const angle = angleStep * routeIndex - Math.PI / 2; // 上から開始

      // 路線の色
      const routeColor = route.color || '#00a651';

      // 路線上のバス停を描画
      const stops = route.stops || [];

      stops.forEach((stop, stopIndex) => {
        const lastBusMinutes = timeToMinutes(stop.lastBus);
        const isExpired = lastBusMinutes < currentMinutes;

        // 終バス時刻から位置を計算
        const normalizedTime = Math.max(0, Math.min(1, (lastBusMinutes - TIME_START) / (TIME_END - TIME_START)));
        const radius = CENTER_RADIUS + (MAX_RADIUS - CENTER_RADIUS) * normalizedTime;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // バス停の円
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 6);
        circle.setAttribute('class', `stop-circle ${isExpired ? 'expired' : ''}`);
        circle.setAttribute('data-stop', JSON.stringify(stop));
        circle.setAttribute('data-route', route.name);
        circle.style.stroke = routeColor;

        circle.addEventListener('click', () => showStopInfo(stop, route));

        stopsGroup.appendChild(circle);

        // バス停名ラベル（主要バス停のみ）
        if (stop.major) {
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          const labelOffset = 12;
          label.setAttribute('x', x + Math.cos(angle) * labelOffset);
          label.setAttribute('y', y + Math.sin(angle) * labelOffset);
          label.setAttribute('class', 'stop-label');
          label.setAttribute('text-anchor', angle > Math.PI / 2 || angle < -Math.PI / 2 ? 'end' : 'start');
          label.textContent = stop.name;
          stopsGroup.appendChild(label);
        }
      });

      // 路線を線で結ぶ
      if (stops.length > 0) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const startRadius = CENTER_RADIUS;
        const endStop = stops[stops.length - 1];
        const endTime = timeToMinutes(endStop.lastBus);
        const endRadius = CENTER_RADIUS + (MAX_RADIUS - CENTER_RADIUS) * Math.max(0, Math.min(1, (endTime - TIME_START) / (TIME_END - TIME_START)));

        line.setAttribute('x1', Math.cos(angle) * startRadius);
        line.setAttribute('y1', Math.sin(angle) * startRadius);
        line.setAttribute('x2', Math.cos(angle) * endRadius);
        line.setAttribute('y2', Math.sin(angle) * endRadius);
        line.setAttribute('class', 'route-line');
        line.style.stroke = routeColor;

        routesGroup.appendChild(line);
      }
    });
  }

  /**
   * バス停情報を表示
   */
  function showStopInfo(stop, route) {
    panelTitle.textContent = stop.name;

    const lastBusMinutes = timeToMinutes(stop.lastBus);
    const isExpired = lastBusMinutes < currentMinutes;

    panelContent.innerHTML = `
      <div class="bus-info ${isExpired ? 'expired' : ''}">
        <div class="bus-destination">${route.name}</div>
        <div>終バス: <span class="bus-time">${stop.lastBus}</span></div>
        <div>行き先: ${route.destination}</div>
        ${isExpired ? '<div style="color: var(--accent-danger);">※ 終バスは終了しました</div>' : ''}
      </div>
    `;

    infoPanel.classList.remove('hidden');
  }

  /**
   * 時刻を更新
   */
  function updateTime(minutes) {
    currentMinutes = minutes;
    currentTimeDisplay.textContent = minutesToTime(minutes);
    timeSlider.value = minutes;
    drawRoutes(); // 再描画
  }

  /**
   * 再生/停止
   */
  function togglePlay() {
    if (isPlaying) {
      clearInterval(playInterval);
      playBtn.textContent = '▶ 再生';
      isPlaying = false;
    } else {
      playBtn.textContent = '⏸ 停止';
      isPlaying = true;
      playInterval = setInterval(() => {
        if (currentMinutes >= TIME_END) {
          togglePlay();
          return;
        }
        updateTime(currentMinutes + 1);
      }, 100);
    }
  }

  /**
   * リセット
   */
  function reset() {
    if (isPlaying) {
      togglePlay();
    }
    updateTime(TIME_START);
  }

  /**
   * 現在時刻に設定
   */
  function setToCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const mins = now.getMinutes();

    // 0時〜4時は24時〜28時として扱う
    if (hours < 5) {
      hours += 24;
    }

    const currentMins = hours * 60 + mins;

    if (currentMins >= TIME_START && currentMins <= TIME_END) {
      updateTime(currentMins);
    }
  }

  /**
   * イベントリスナーの設定
   */
  function setupEventListeners() {
    timeSlider.addEventListener('input', (e) => {
      updateTime(parseInt(e.target.value, 10));
    });

    playBtn.addEventListener('click', togglePlay);
    resetBtn.addEventListener('click', reset);

    closePanel.addEventListener('click', () => {
      infoPanel.classList.add('hidden');
    });

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyR') {
        reset();
      } else if (e.code === 'ArrowRight') {
        updateTime(Math.min(TIME_END, currentMinutes + 5));
      } else if (e.code === 'ArrowLeft') {
        updateTime(Math.max(TIME_START, currentMinutes - 5));
      }
    });
  }

  /**
   * 開発版バナーを表示
   */
  function showDevBanner() {
    if (typeof BUS_DATA !== 'undefined' && BUS_DATA.meta && BUS_DATA.meta.isDev) {
      const banner = document.getElementById('dev-banner');
      if (banner) {
        banner.classList.remove('hidden');
      }
    }
  }

  /**
   * 初期化
   */
  function init() {
    showDevBanner();
    drawTimeCircles();
    drawRoutes();
    setupEventListeners();
    setToCurrentTime();

    console.log('浜松終バスマップ 初期化完了');
  }

  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
