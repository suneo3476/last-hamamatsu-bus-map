/**
 * 浜松終バスマップ - メインアプリケーション
 */

(function() {
  'use strict';

  // DOM要素
  const mapSvg = document.getElementById('map');
  const mapContainer = document.getElementById('map-container');
  const timeCirclesGroup = document.getElementById('time-circles');
  const routesGroup = document.getElementById('routes');
  const stopsGroup = document.getElementById('stops');
  const currentTimeCircle = document.getElementById('current-time-circle');
  const timeSlider = document.getElementById('time-slider');
  const currentTimeDisplay = document.getElementById('current-time');
  const playBtn = document.getElementById('play-btn');
  const playIcon = playBtn.querySelector('.play-icon');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const infoBtn = document.getElementById('info-btn');
  const infoModal = document.getElementById('info-modal');
  const closeModal = document.getElementById('close-modal');
  const hoverPopup = document.getElementById('hover-popup');
  const popupRouteName = document.getElementById('popup-route-name');
  const popupDestination = document.getElementById('popup-destination');
  const popupDepart = document.getElementById('popup-depart');
  const popupArrive = document.getElementById('popup-arrive');

  // 状態
  let isPlaying = false;
  let playInterval = null;
  let currentMinutes = 1260; // 21:00 = 21 * 60

  // ビューポート状態
  let viewBox = { x: -500, y: -500, w: 1000, h: 1000 };
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let viewBoxStart = { x: 0, y: 0 };

  // 定数
  const CENTER_RADIUS = 10;
  const MAX_RADIUS = 420;
  const TIME_START = 1260; // 21:00
  const TIME_END = 1470;   // 24:30
  const MIN_ZOOM = 400;
  const MAX_ZOOM = 2000;
  const ZOOM_SENSITIVITY = 0.3; // ズーム感度（小さいほど鈍感）

  /**
   * 分を時刻文字列に変換
   */
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * 時刻文字列を分に変換
   */
  function timeToMinutes(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
  }

  /**
   * 時刻から半径を計算
   */
  function timeToRadius(minutes) {
    const normalized = Math.max(0, Math.min(1, (minutes - TIME_START) / (TIME_END - TIME_START)));
    return CENTER_RADIUS + (MAX_RADIUS - CENTER_RADIUS) * normalized;
  }

  /**
   * 角度から縦書きか横書きかを判定
   * @param {number} angleDeg - 0度が上（y負方向）、時計回りの角度（0-360）
   * @returns {boolean} 縦書きならtrue
   */
  function isVerticalText(angleDeg) {
    // 315~360, 0~45, 135~225 は縦書き
    return (angleDeg >= 315 || angleDeg <= 45) || (angleDeg >= 135 && angleDeg <= 225);
  }

  /**
   * 同心円（時間軸）を描画
   */
  function drawTimeCircles() {
    timeCirclesGroup.innerHTML = '';

    const timeMarks = [1290, 1320, 1350, 1380, 1410, 1440, 1470]; // 21:30から24:30まで30分刻み

    timeMarks.forEach((time) => {
      const radius = timeToRadius(time);

      // 円
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', 0);
      circle.setAttribute('cy', 0);
      circle.setAttribute('r', radius);
      circle.setAttribute('class', 'time-circle');
      timeCirclesGroup.appendChild(circle);

      // ラベル（右下に配置）
      const angle = Math.PI / 4; // 45度
      const labelX = Math.cos(angle) * (radius + 5);
      const labelY = Math.sin(angle) * (radius + 5);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('class', 'time-circle-label');
      label.setAttribute('text-anchor', 'start');
      label.setAttribute('dominant-baseline', 'middle');
      label.textContent = minutesToTime(time);
      timeCirclesGroup.appendChild(label);
    });
  }

  /**
   * 現在時刻の円を更新
   */
  function updateCurrentTimeCircle() {
    const radius = timeToRadius(currentMinutes);
    currentTimeCircle.setAttribute('r', radius);
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
      // 角度を0-360度に変換（0度が上、時計回り）
      let angleDeg = ((angle + Math.PI / 2) * 180 / Math.PI) % 360;
      if (angleDeg < 0) angleDeg += 360;

      const routeColor = route.color || '#00a651';
      const stops = route.stops || [];

      if (stops.length === 0) return;

      // 始発駅の発車時刻（浜松駅発）
      const departMinutes = timeToMinutes(stops[0].lastBus);
      // 終着駅の到着時刻
      const arriveMinutes = timeToMinutes(stops[stops.length - 1].lastBus);

      // 終了判定（始発時刻が現在時刻を過ぎていたら終了）
      const isExpired = departMinutes < currentMinutes;

      // 路線の線を描画（始発時刻の位置から開始）
      const startRadius = timeToRadius(departMinutes);
      const endRadius = timeToRadius(arriveMinutes);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', Math.cos(angle) * startRadius);
      line.setAttribute('y1', Math.sin(angle) * startRadius);
      line.setAttribute('x2', Math.cos(angle) * endRadius);
      line.setAttribute('y2', Math.sin(angle) * endRadius);
      line.setAttribute('class', `route-line ${isExpired ? 'expired' : ''}`);
      line.setAttribute('data-route-id', route.id);
      line.style.stroke = routeColor;

      // ホバーイベント
      line.addEventListener('mouseenter', (e) => showPopup(e, route, departMinutes, arriveMinutes));
      line.addEventListener('mousemove', (e) => movePopup(e));
      line.addEventListener('mouseleave', hidePopup);

      routesGroup.appendChild(line);

      // 終着駅のバス停を描画
      const endStop = stops[stops.length - 1];
      const endX = Math.cos(angle) * endRadius;
      const endY = Math.sin(angle) * endRadius;

      // バス停の円
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', endX);
      circle.setAttribute('cy', endY);
      circle.setAttribute('r', 5);
      circle.setAttribute('class', `stop-circle ${isExpired ? 'expired' : ''}`);
      circle.style.stroke = routeColor;

      circle.addEventListener('mouseenter', (e) => showPopup(e, route, departMinutes, arriveMinutes));
      circle.addEventListener('mousemove', (e) => movePopup(e));
      circle.addEventListener('mouseleave', hidePopup);

      stopsGroup.appendChild(circle);

      // 終着駅名ラベル
      const labelOffset = 15;
      const labelX = endX + Math.cos(angle) * labelOffset;
      const labelY = endY + Math.sin(angle) * labelOffset;

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('class', `stop-label ${isExpired ? 'expired' : ''}`);

      // 縦書き/横書きの判定と設定
      if (isVerticalText(angleDeg)) {
        // 縦書き
        label.setAttribute('writing-mode', 'vertical-rl');
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('dominant-baseline', 'middle');
        // 上向き（315-45度）は下から上、下向き（135-225度）は上から下
        if (angleDeg >= 135 && angleDeg <= 225) {
          label.setAttribute('text-anchor', 'start');
        } else {
          label.setAttribute('text-anchor', 'end');
        }
      } else {
        // 横書き
        label.setAttribute('dominant-baseline', 'middle');
        // 右側（45-135度）は左寄せ、左側（225-315度）は右寄せ
        if (angleDeg > 45 && angleDeg < 135) {
          label.setAttribute('text-anchor', 'start');
        } else {
          label.setAttribute('text-anchor', 'end');
        }
      }

      label.textContent = endStop.name;
      stopsGroup.appendChild(label);

      // 路線アイコン（路線の中間あたりに表示）
      const iconRadius = (startRadius + endRadius) / 2;
      const iconX = Math.cos(angle) * iconRadius;
      const iconY = Math.sin(angle) * iconRadius;

      // アイコン背景
      const iconBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const iconSize = 18;
      iconBg.setAttribute('x', iconX - iconSize / 2);
      iconBg.setAttribute('y', iconY - iconSize / 2);
      iconBg.setAttribute('width', iconSize);
      iconBg.setAttribute('height', iconSize);
      iconBg.setAttribute('rx', 3);
      iconBg.setAttribute('fill', routeColor);
      iconBg.setAttribute('class', isExpired ? 'expired' : '');

      stopsGroup.appendChild(iconBg);

      // 路線番号テキスト
      const routeNum = route.name.split(' ')[0];
      const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      iconText.setAttribute('x', iconX);
      iconText.setAttribute('y', iconY);
      iconText.setAttribute('class', `route-icon ${isExpired ? 'expired' : ''}`);
      iconText.setAttribute('text-anchor', 'middle');
      iconText.setAttribute('dominant-baseline', 'middle');
      iconText.textContent = routeNum;

      stopsGroup.appendChild(iconText);
    });
  }

  /**
   * ポップアップを表示
   */
  function showPopup(e, route, departMinutes, arriveMinutes) {
    popupRouteName.textContent = route.name;
    popupDestination.textContent = route.destination + ' 行き';
    popupDepart.textContent = minutesToTime(departMinutes) + '発';
    popupArrive.textContent = minutesToTime(arriveMinutes) + '着';

    hoverPopup.classList.remove('hidden');
    movePopup(e);
  }

  /**
   * ポップアップを移動
   */
  function movePopup(e) {
    const x = e.clientX + 15;
    const y = e.clientY + 15;

    // 画面からはみ出さないように調整
    const rect = hoverPopup.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;

    hoverPopup.style.left = Math.min(x, maxX) + 'px';
    hoverPopup.style.top = Math.min(y, maxY) + 'px';
  }

  /**
   * ポップアップを非表示
   */
  function hidePopup() {
    hoverPopup.classList.add('hidden');
  }

  /**
   * 時刻を更新
   */
  function updateTime(minutes) {
    currentMinutes = minutes;
    currentTimeDisplay.textContent = minutesToTime(minutes);
    timeSlider.value = minutes;
    updateCurrentTimeCircle();
    drawRoutes();
  }

  /**
   * 再生/停止
   */
  function togglePlay() {
    if (isPlaying) {
      clearInterval(playInterval);
      playIcon.textContent = '▶';
      playBtn.classList.remove('playing');
      isPlaying = false;
    } else {
      playIcon.textContent = '❚❚';
      playBtn.classList.add('playing');
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
   * ビューボックスを更新
   */
  function updateViewBox() {
    mapSvg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  }

  /**
   * ズーム
   */
  function zoom(delta, centerX, centerY) {
    // 感度を下げる
    const normalizedDelta = delta * ZOOM_SENSITIVITY;
    const factor = normalizedDelta > 0 ? 0.95 : 1.05;
    const newW = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewBox.w * factor));
    const newH = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewBox.h * factor));

    // ズーム中心を維持
    const scale = newW / viewBox.w;
    viewBox.x = centerX - (centerX - viewBox.x) * scale;
    viewBox.y = centerY - (centerY - viewBox.y) * scale;
    viewBox.w = newW;
    viewBox.h = newH;

    updateViewBox();
  }

  /**
   * マウス座標をSVG座標に変換
   */
  function screenToSVG(screenX, screenY) {
    const rect = mapSvg.getBoundingClientRect();
    const x = viewBox.x + (screenX - rect.left) / rect.width * viewBox.w;
    const y = viewBox.y + (screenY - rect.top) / rect.height * viewBox.h;
    return { x, y };
  }

  /**
   * 現在時刻に設定
   */
  function setToCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const mins = now.getMinutes();

    if (hours < 5) {
      hours += 24;
    }

    const currentMins = hours * 60 + mins;

    if (currentMins >= TIME_START && currentMins <= TIME_END) {
      updateTime(currentMins);
    }
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
   * イベントリスナーの設定
   */
  function setupEventListeners() {
    // 時間スライダー
    timeSlider.addEventListener('input', (e) => {
      updateTime(parseInt(e.target.value, 10));
    });

    // 再生ボタン
    playBtn.addEventListener('click', togglePlay);

    // ズームボタン
    zoomInBtn.addEventListener('click', () => zoom(1, 0, 0));
    zoomOutBtn.addEventListener('click', () => zoom(-1, 0, 0));

    // マウスホイールでズーム
    mapContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const svgCoord = screenToSVG(e.clientX, e.clientY);
      zoom(e.deltaY, svgCoord.x, svgCoord.y);
    }, { passive: false });

    // ドラッグでパン
    mapContainer.addEventListener('mousedown', (e) => {
      if (e.target.closest('.route-line, .stop-circle')) return;
      isPanning = true;
      panStart = { x: e.clientX, y: e.clientY };
      viewBoxStart = { x: viewBox.x, y: viewBox.y };
      mapContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isPanning) return;

      const rect = mapSvg.getBoundingClientRect();
      const dx = (e.clientX - panStart.x) / rect.width * viewBox.w;
      const dy = (e.clientY - panStart.y) / rect.height * viewBox.h;

      viewBox.x = viewBoxStart.x - dx;
      viewBox.y = viewBoxStart.y - dy;

      updateViewBox();
    });

    document.addEventListener('mouseup', () => {
      isPanning = false;
      mapContainer.style.cursor = 'grab';
    });

    // タッチ操作
    let lastTouchDistance = 0;
    let lastTouchCenter = { x: 0, y: 0 };

    mapContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isPanning = true;
        panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        viewBoxStart = { x: viewBox.x, y: viewBox.y };
      } else if (e.touches.length === 2) {
        isPanning = false;
        lastTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastTouchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
        };
      }
    }, { passive: true });

    mapContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isPanning) {
        const rect = mapSvg.getBoundingClientRect();
        const dx = (e.touches[0].clientX - panStart.x) / rect.width * viewBox.w;
        const dy = (e.touches[0].clientY - panStart.y) / rect.height * viewBox.h;

        viewBox.x = viewBoxStart.x - dx;
        viewBox.y = viewBoxStart.y - dy;

        updateViewBox();
      } else if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = lastTouchDistance - distance;
        const svgCoord = screenToSVG(lastTouchCenter.x, lastTouchCenter.y);
        zoom(delta * 0.5, svgCoord.x, svgCoord.y); // タッチズームも感度下げる
        lastTouchDistance = distance;
      }
    }, { passive: true });

    mapContainer.addEventListener('touchend', () => {
      isPanning = false;
    });

    // 情報モーダル
    infoBtn.addEventListener('click', () => {
      infoModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
      infoModal.classList.add('hidden');
    });

    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        infoModal.classList.add('hidden');
      }
    });

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        updateTime(Math.min(TIME_END, currentMinutes + 5));
      } else if (e.code === 'ArrowLeft') {
        updateTime(Math.max(TIME_START, currentMinutes - 5));
      } else if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        zoom(1, 0, 0);
      } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        zoom(-1, 0, 0);
      }
    });
  }

  /**
   * 初期化
   */
  function init() {
    showDevBanner();
    drawTimeCircles();
    updateCurrentTimeCircle();
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
