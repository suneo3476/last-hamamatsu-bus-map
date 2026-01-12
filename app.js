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
  const TIME_CENTER = 1230; // 20:30（中心時刻）
  const TIME_START = 1260;  // 21:00（終バス表示開始）
  const TIME_END = 1470;    // 24:30
  const MIN_ZOOM = 400;
  const MAX_ZOOM = 2000;
  const ZOOM_SENSITIVITY = 0.15; // ズーム感度（小さいほど鈍感）

  // フォントサイズと線の太さのグラデーション設定（極端に）
  const FONT_SIZE_MIN = 6;   // 中心側の最小フォントサイズ
  const FONT_SIZE_MAX = 14;  // 外側の最大フォントサイズ
  const LINE_WIDTH_MIN = 1;  // 中心側の最小線幅
  const LINE_WIDTH_MAX = 4;  // 外側の最大線幅

  // 路線カラー（遠鉄バス公式カラーを参考、黒背景用に調整）
  // 10の位で方面別に色分け
  const ROUTE_COLORS = {
    '1': '#ff6b6b',    // 1番台: 赤系
    '2': '#4ecdc4',    // 2番台: シアン系（イオンモール方面）
    '4': '#ffd93d',    // 4番台: 黄色（中田島方面）
    '5': '#95e1d3',    // 5番台: ミント（三島江之島方面）
    '9': '#a8e6cf',    // 9番台: 緑系（掛塚方面）
    '12': '#dfe6e9',   // 12番台: 白系（浜名方面）
    '16': '#74b9ff',   // 16番台: 水色（小沢渡方面）
    '20': '#81ecec',   // 20番台: シアン（志都呂方面）
    '30': '#fd79a8',   // 30番台: ピンク（舘山寺方面）
    '36': '#e17055',   // 36番台: オレンジ（大塚方面）
    '40': '#00b894',   // 40番台: 緑（気賀三ヶ日方面）
    '41': '#55efc4',   // 41番台: 明るい緑（高台方面）
    '43': '#00cec9',   // 43番台: ティール（引佐方面）
    '46': '#20bf6b',   // 46番台: 緑（都田方面）
    '48': '#a29bfe',   // 48番台: 薄紫（和合方面）
    '50': '#6c5ce7',   // 50番台: 紫（山の手医大方面）
    '51': '#fd79a8',   // 51番台: ピンク（泉高丘方面）
    '53': '#e056fd',   // 53番台: マゼンタ（萩丘方面）
    '61': '#ffeaa7',   // 61番台: 黄色（内野台方面）
    '80': '#fab1a0',   // 80番台: サーモン（磐田方面）
    '91': '#ff7675',   // 91番台: 赤（鶴見富塚方面）
  };

  /**
   * 路線番号からカラーを取得
   */
  function getRouteColor(routeNum) {
    // 路線番号の先頭の数字を取得（例: '30/31' → '30', '16-4' → '16'）
    const num = routeNum.split(/[\/\-]/)[0];

    // 完全一致で探す
    if (ROUTE_COLORS[num]) return ROUTE_COLORS[num];

    // 10の位で探す（2桁以上の場合）
    if (num.length >= 2) {
      const tens = num.substring(0, num.length - 1) + '0';
      if (ROUTE_COLORS[tens]) return ROUTE_COLORS[tens];
    }

    // 1桁の場合はそのまま
    if (ROUTE_COLORS[num]) return ROUTE_COLORS[num];

    // デフォルト
    return '#aaaaaa';
  }

  /**
   * 色が明るいかどうかを判定（白文字か黒文字かの判断用）
   */
  function isLightColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // 輝度計算
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }

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
   * 時刻から半径を計算（20:30を中心に）
   */
  function timeToRadius(minutes) {
    const normalized = Math.max(0, Math.min(1, (minutes - TIME_CENTER) / (TIME_END - TIME_CENTER)));
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
   * テキストは常に線の方向に沿って配置（縦書きでも線に沿った角度）
   * @param {number} angleDeg - 0度が上（y負方向）、時計回りの角度（0-360）
   * @returns {number} テキストの回転角度（度）
   */
  function getTextRotation(angleDeg) {
    // テキストは常に線の方向に沿って配置
    // 上半分（右上から左上）: 読みやすいように調整
    // 下半分（左下から右下）: 読みやすいように調整

    if (isVerticalText(angleDeg)) {
      // 縦書きエリア: 線の角度に沿う（完全な垂直ではない）
      if (angleDeg >= 135 && angleDeg <= 225) {
        // 下向き（135-225度）: 線の角度に沿って配置
        return angleDeg - 180 + 90;
      } else {
        // 上向き（315-360, 0-45度）: 線の角度に沿って配置
        if (angleDeg >= 315) {
          return angleDeg - 360 - 90;
        } else {
          return angleDeg - 90;
        }
      }
    } else {
      // 横書きエリア: 線の角度に沿う
      if (angleDeg > 45 && angleDeg < 135) {
        // 右側（45-135度）
        return angleDeg - 90;
      } else {
        // 左側（225-315度）
        return angleDeg - 270;
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

      // 路線カラーを取得（data.jsの色ではなく、路線番号から動的に決定）
      const routeColor = getRouteColor(route.routeNum || '');
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

      // 当たり判定を広げるための透明な太い線（ホバー用）
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hitArea.setAttribute('x1', Math.cos(angle) * startRadius);
      hitArea.setAttribute('y1', Math.sin(angle) * startRadius);
      hitArea.setAttribute('x2', Math.cos(angle) * endRadius);
      hitArea.setAttribute('y2', Math.sin(angle) * endRadius);
      hitArea.setAttribute('class', `route-hit-area ${isExpired ? 'expired' : ''}`);
      hitArea.setAttribute('data-route-id', route.id);
      hitArea.style.stroke = 'transparent';
      hitArea.style.strokeWidth = (lineWidth + 16) + 'px'; // 当たり判定を広げる

      // ホバーイベント（当たり判定用）
      hitArea.addEventListener('mouseenter', (e) => showPopup(e, route, departMinutes, arriveMinutes));
      hitArea.addEventListener('mousemove', (e) => movePopup(e));
      hitArea.addEventListener('mouseleave', hidePopup);

      routesGroup.appendChild(hitArea);

      // 実際の線
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', Math.cos(angle) * startRadius);
      line.setAttribute('y1', Math.sin(angle) * startRadius);
      line.setAttribute('x2', Math.cos(angle) * endRadius);
      line.setAttribute('y2', Math.sin(angle) * endRadius);
      line.setAttribute('class', `route-line ${isExpired ? 'expired' : ''}`);
      line.setAttribute('data-route-id', route.id);
      line.style.stroke = routeColor;
      line.style.strokeWidth = lineWidth + 'px';
      line.style.pointerEvents = 'none'; // 実際の線はホバー無効

      routesGroup.appendChild(line);

      // 乗り場番号ラベル（始発駅の代わり）
      const startX = Math.cos(angle) * startRadius;
      const startY = Math.sin(angle) * startRadius;

      const startLabelOffset = -12;
      const startLabelX = startX + Math.cos(angle) * startLabelOffset;
      const startLabelY = startY + Math.sin(angle) * startLabelOffset;

      // 始発のフォントサイズ（始点位置に基づく）
      const startFontSize = radiusToFontSize(startRadius);

      const startLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startLabel.setAttribute('x', startLabelX);
      startLabel.setAttribute('y', startLabelY);
      startLabel.setAttribute('class', `stop-label platform-label ${isExpired ? 'expired' : ''}`);
      startLabel.style.fontSize = startFontSize + 'px';
      startLabel.style.fill = '#888888'; // グレー

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
      startLabel.textContent = platform + '番';
      stopsGroup.appendChild(startLabel);

      // 終着駅のラベル（円は描画しない）
      const endStopName = (route.weekday && route.holiday) ? route.destination : (stops.length > 0 ? stops[stops.length - 1].name : route.destination);
      const endX = Math.cos(angle) * endRadius;
      const endY = Math.sin(angle) * endRadius;

      // 終着駅名ラベル
      const labelOffset = 8;
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

      // 路線番号アイコン（終点駅名の後ろに配置）
      // テキストの長さを推定してアイコン位置を計算
      const routeNumText = route.routeNum || '';
      const iconOffset = endStopName.length * endFontSize * 0.6 + 10; // 駅名の長さ分オフセット

      // アイコンの位置（回転を考慮）
      const textRotationRad = textRotation * Math.PI / 180;
      let iconX, iconY;

      if (angleDeg > 90 && angleDeg < 270) {
        // 左側: text-anchorがendなのでアイコンは始点側
        iconX = labelX - Math.cos(textRotationRad) * iconOffset;
        iconY = labelY - Math.sin(textRotationRad) * iconOffset;
      } else {
        // 右側: text-anchorがstartなのでアイコンは終点側
        iconX = labelX + Math.cos(textRotationRad) * iconOffset;
        iconY = labelY + Math.sin(textRotationRad) * iconOffset;
      }

      // アイコン背景（角丸四角形）
      const iconBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const iconWidth = routeNumText.length * endFontSize * 0.5 + 6;
      const iconHeight = endFontSize + 2;
      iconBg.setAttribute('x', iconX - iconWidth / 2);
      iconBg.setAttribute('y', iconY - iconHeight / 2);
      iconBg.setAttribute('width', iconWidth);
      iconBg.setAttribute('height', iconHeight);
      iconBg.setAttribute('rx', 2);
      iconBg.setAttribute('ry', 2);
      iconBg.setAttribute('fill', routeColor);
      iconBg.setAttribute('class', `route-icon-bg ${isExpired ? 'expired' : ''}`);
      iconBg.setAttribute('transform', `rotate(${textRotation}, ${iconX}, ${iconY})`);
      stopsGroup.appendChild(iconBg);

      // アイコンテキスト（路線番号）
      const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      iconText.setAttribute('x', iconX);
      iconText.setAttribute('y', iconY);
      iconText.setAttribute('class', `route-icon-text ${isExpired ? 'expired' : ''}`);
      iconText.style.fontSize = (endFontSize * 0.7) + 'px';
      iconText.style.fill = isLightColor(routeColor) ? '#000000' : '#ffffff';
      iconText.setAttribute('text-anchor', 'middle');
      iconText.setAttribute('dominant-baseline', 'middle');
      iconText.setAttribute('transform', `rotate(${textRotation}, ${iconX}, ${iconY})`);
      iconText.textContent = routeNumText;
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
