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
  const weekdayBtn = document.getElementById('weekday-btn');
  const holidayBtn = document.getElementById('holiday-btn');

  // 状態
  let isPlaying = false;
  let playInterval = null;
  let currentMinutes = 1260; // 21:00 = 21 * 60
  let isWeekday = true; // 平日/土日祝の切り替え

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
  const ZOOM_SENSITIVITY = 0.15; // ズーム感度（小さいほど鈍感）

  // フォントサイズと線の太さのグラデーション設定（極端に）
  const FONT_SIZE_MIN = 6;   // 中心側の最小フォントサイズ
  const FONT_SIZE_MAX = 14;  // 外側の最大フォントサイズ
  const LINE_WIDTH_MIN = 1;  // 中心側の最小線幅
  const LINE_WIDTH_MAX = 4;  // 外側の最大線幅

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
   * 半径からフォントサイズを計算（中心ほど小さく、外側ほど大きく）
   */
  function radiusToFontSize(radius) {
    const normalized = (radius - CENTER_RADIUS) / (MAX_RADIUS - CENTER_RADIUS);
    return FONT_SIZE_MIN + (FONT_SIZE_MAX - FONT_SIZE_MIN) * normalized;
  }

  /**
   * 半径から線の太さを計算（中心ほど細く、外側ほど太く）
   */
  function radiusToLineWidth(radius) {
    const normalized = (radius - CENTER_RADIUS) / (MAX_RADIUS - CENTER_RADIUS);
    return LINE_WIDTH_MIN + (LINE_WIDTH_MAX - LINE_WIDTH_MIN) * normalized;
  }

  /**
   * 角度から縦書きか横書きかを判定
   * 真上(0度/360度)±45度と真下(180度)±45度が縦書き
   * @param {number} angleDeg - 0度が上（y負方向）、時計回りの角度（0-360）
   * @returns {boolean} 縦書きならtrue
   */
  function isVerticalText(angleDeg) {
    // 真上: 315-360, 0-45 / 真下: 135-225
    return (angleDeg >= 315 || angleDeg <= 45) || (angleDeg >= 135 && angleDeg <= 225);
  }

  /**
   * 角度からテキスト回転角度を計算
   * 縦書きの場合: 縦方向に沿う / 横書きの場合: 横方向に沿う
   * @param {number} angleDeg - 0度が上（y負方向）、時計回りの角度（0-360）
   * @returns {number} テキストの回転角度（度）
   */
  function getTextRotation(angleDeg) {
    if (isVerticalText(angleDeg)) {
      // 縦書き: 線の方向に沿って縦に配置
      // 上向き（315-45度）: -90度で右から左へ読む縦書き
      // 下向き（135-225度）: 90度で左から右へ読む縦書き
      if (angleDeg >= 135 && angleDeg <= 225) {
        return 90; // 下向きは90度
      } else {
        return -90; // 上向きは-90度
      }
    } else {
      // 横書き: 線の方向に沿って横に配置
      // 右側（45-135度）: 線の角度に合わせる
      // 左側（225-315度）: 180度反転して読みやすく
      if (angleDeg > 45 && angleDeg < 135) {
        return angleDeg - 90;
      } else {
        return angleDeg + 90;
      }
    }
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

      // ラベル（右下に配置、中心からの放射線に対して垂直=円周に沿う向き）
      const angle = Math.PI / 4; // 45度の位置
      const labelX = Math.cos(angle) * (radius + 8);
      const labelY = Math.sin(angle) * (radius + 8);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('class', 'time-circle-label');
      // 放射線に対して垂直 = 45度位置なら45-90 = -45度回転
      const rotationDeg = -45;
      label.setAttribute('transform', `rotate(${rotationDeg}, ${labelX}, ${labelY})`);
      label.setAttribute('text-anchor', 'middle');
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

    // 乗り場ごとに路線をグループ化
    const platformGroups = {};
    routes.forEach(route => {
      const p = route.platform || 1;
      if (!platformGroups[p]) platformGroups[p] = [];
      platformGroups[p].push(route);
    });

    // 乗り場数（1-16、ただし11は欠番なので実質15）
    const numPlatforms = 15; // 実際の乗り場数
    const platformAngleStep = (2 * Math.PI) / numPlatforms;

    // 乗り場番号→角度位置のマッピング（11が欠番）
    // 乗り場1が下から開始、時計回りに配置
    const platformToPosition = (p) => {
      if (p <= 10) return p - 1;  // 1-10 → 0-9
      if (p >= 12) return p - 2;  // 12-16 → 10-14
      return 0; // 11は使われない
    };

    routes.forEach((route) => {
      const platform = route.platform || 1;
      const platformRoutes = platformGroups[platform] || [];
      const indexInPlatform = platformRoutes.indexOf(route);
      const numRoutesInPlatform = platformRoutes.length;

      // 乗り場の基本角度（乗り場1が下=180度から開始、時計回り）
      const platformPosition = platformToPosition(platform);
      const platformBaseAngle = Math.PI + platformPosition * platformAngleStep;

      // 同一乗り場内での微調整（乗り場内で均等に分散）
      const offsetAngle = numRoutesInPlatform > 1
        ? (indexInPlatform - (numRoutesInPlatform - 1) / 2) * (platformAngleStep * 0.6 / numRoutesInPlatform)
        : 0;

      const angle = platformBaseAngle + offsetAngle;

      // 角度を0-360度に変換（0度が上、時計回り）
      let angleDeg = ((angle + Math.PI / 2) * 180 / Math.PI) % 360;
      if (angleDeg < 0) angleDeg += 360;

      const routeColor = route.color || '#00a651';
      const stops = route.stops || [];

      // 新形式（weekday/holiday）の場合は stops チェックをスキップ
      if (!route.weekday && stops.length === 0) return;

      // 始発駅の発車時刻（浜松駅発）と終着駅の到着時刻
      // 新形式（weekday/holiday）と旧形式（stops）の両方に対応
      let departMinutes, arriveMinutes;

      if (route.weekday && route.holiday) {
        // 新形式: weekday/holiday オブジェクトから取得
        const schedule = isWeekday ? route.weekday : route.holiday;
        departMinutes = timeToMinutes(schedule.lastDeparture);
        arriveMinutes = timeToMinutes(schedule.lastArrival);
      } else if (stops.length > 0) {
        // 旧形式: stopsから取得
        departMinutes = timeToMinutes(stops[0].lastBus);
        arriveMinutes = timeToMinutes(stops[stops.length - 1].lastBus);
      } else {
        return; // データがない場合はスキップ
      }

      // 終了判定（始発時刻が現在時刻を過ぎていたら終了）
      const isExpired = departMinutes < currentMinutes;

      // 路線の線を描画（始発時刻の位置から開始）
      const startRadius = timeToRadius(departMinutes);
      const endRadius = timeToRadius(arriveMinutes);

      // 線の太さ（始点と終点の平均、または終点側を使用）
      const lineWidth = radiusToLineWidth((startRadius + endRadius) / 2);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', Math.cos(angle) * startRadius);
      line.setAttribute('y1', Math.sin(angle) * startRadius);
      line.setAttribute('x2', Math.cos(angle) * endRadius);
      line.setAttribute('y2', Math.sin(angle) * endRadius);
      line.setAttribute('class', `route-line ${isExpired ? 'expired' : ''}`);
      line.setAttribute('data-route-id', route.id);
      line.style.stroke = routeColor;
      line.style.strokeWidth = lineWidth + 'px';

      // ホバーイベント
      line.addEventListener('mouseenter', (e) => showPopup(e, route, departMinutes, arriveMinutes));
      line.addEventListener('mousemove', (e) => movePopup(e));
      line.addEventListener('mouseleave', hidePopup);

      routesGroup.appendChild(line);

      // 始発駅名ラベル（線の始点側 = 浜松駅）
      // 新形式では始発は常に「浜松駅」、旧形式では stops[0].name
      const startStopName = (route.weekday && route.holiday) ? '浜松駅' : (stops[0] ? stops[0].name : '浜松駅');
      const startX = Math.cos(angle) * startRadius;
      const startY = Math.sin(angle) * startRadius;

      const startLabelOffset = -12;
      const startLabelX = startX + Math.cos(angle) * startLabelOffset;
      const startLabelY = startY + Math.sin(angle) * startLabelOffset;

      // 始発駅名のフォントサイズ（始点位置に基づく）
      const startFontSize = radiusToFontSize(startRadius);

      const startLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startLabel.setAttribute('x', startLabelX);
      startLabel.setAttribute('y', startLabelY);
      startLabel.setAttribute('class', `stop-label start-label ${isExpired ? 'expired' : ''}`);
      startLabel.style.fontSize = startFontSize + 'px';

      // テキストを線の方向に合わせて回転
      const startTextRotation = getTextRotation(angleDeg);
      startLabel.setAttribute('transform', `rotate(${startTextRotation}, ${startLabelX}, ${startLabelY})`);

      // text-anchorは始発側なので終点と逆
      if (angleDeg > 90 && angleDeg < 270) {
        startLabel.setAttribute('text-anchor', 'start');
      } else {
        startLabel.setAttribute('text-anchor', 'end');
      }
      startLabel.setAttribute('dominant-baseline', 'middle');
      startLabel.textContent = startStopName;
      stopsGroup.appendChild(startLabel);

      // 終着駅のバス停を描画
      // 新形式では route.destination、旧形式では stops[stops.length - 1].name
      const endStopName = (route.weekday && route.holiday) ? route.destination : (stops.length > 0 ? stops[stops.length - 1].name : route.destination);
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

      // 終着駅名のフォントサイズ（終点位置に基づく）
      const endFontSize = radiusToFontSize(endRadius);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('class', `stop-label ${isExpired ? 'expired' : ''}`);
      label.style.fontSize = endFontSize + 'px';

      // テキストを線の方向に合わせて回転
      const textRotation = getTextRotation(angleDeg);
      label.setAttribute('transform', `rotate(${textRotation}, ${labelX}, ${labelY})`);

      // text-anchorは回転後の配置を考慮（外側に向かって読む方向）
      if (angleDeg > 90 && angleDeg < 270) {
        label.setAttribute('text-anchor', 'end');
      } else {
        label.setAttribute('text-anchor', 'start');
      }
      label.setAttribute('dominant-baseline', 'middle');

      label.textContent = endStopName;
      stopsGroup.appendChild(label);
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

    // 平日/土日祝切り替え
    weekdayBtn.addEventListener('click', () => {
      if (!isWeekday) {
        isWeekday = true;
        weekdayBtn.classList.add('active');
        holidayBtn.classList.remove('active');
        drawRoutes();
      }
    });

    holidayBtn.addEventListener('click', () => {
      if (isWeekday) {
        isWeekday = false;
        holidayBtn.classList.add('active');
        weekdayBtn.classList.remove('active');
        drawRoutes();
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
