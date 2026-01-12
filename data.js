/**
 * 浜松終バスマップ - バスデータ
 *
 * ⚠️ 開発用サンプルデータ（架空）
 * 実際の遠鉄バス時刻表とは異なります
 */

const BUS_DATA = {
  // メタ情報
  meta: {
    version: '0.1.0-dev',
    isDev: true,
    lastUpdated: '2026-01-12',
    notice: '⚠️ 開発用サンプルデータです。実際の時刻表ではありません。'
  },

  // 中心駅
  center: {
    name: '浜松駅',
    id: 'hamamatsu'
  },

  // 路線データ（架空・12路線）
  routes: [
    // === 東方面 ===
    {
      id: 'dev-east-1',
      name: 'E1 東海道ライン',
      destination: '天竜川駅',
      color: '#e63946',
      stops: [
        { name: '浜松駅', lastBus: '23:15', major: true },
        { name: '助信', lastBus: '23:22', major: false },
        { name: '曳馬', lastBus: '23:28', major: true },
        { name: '上島', lastBus: '23:35', major: false },
        { name: '天竜川駅', lastBus: '23:45', major: true }
      ]
    },
    {
      id: 'dev-east-2',
      name: 'E2 積志エクスプレス',
      destination: '積志車庫',
      color: '#f4a261',
      stops: [
        { name: '浜松駅', lastBus: '22:40', major: true },
        { name: '中田島', lastBus: '22:52', major: true },
        { name: '積志', lastBus: '23:05', major: true },
        { name: '積志車庫', lastBus: '23:15', major: true }
      ]
    },

    // === 北方面 ===
    {
      id: 'dev-north-1',
      name: 'N1 北星ルート',
      destination: '浜北駅',
      color: '#2a9d8f',
      stops: [
        { name: '浜松駅', lastBus: '22:50', major: true },
        { name: '高台', lastBus: '23:00', major: false },
        { name: '初生', lastBus: '23:12', major: true },
        { name: '浜北駅', lastBus: '23:30', major: true }
      ]
    },
    {
      id: 'dev-north-2',
      name: 'N2 三方原線',
      destination: '三方原墓園',
      color: '#264653',
      stops: [
        { name: '浜松駅', lastBus: '21:45', major: true },
        { name: '広沢', lastBus: '21:55', major: true },
        { name: '三方原', lastBus: '22:10', major: true },
        { name: '三方原墓園', lastBus: '22:20', major: true }
      ]
    },

    // === 西方面 ===
    {
      id: 'dev-west-1',
      name: 'W1 湖岸パノラマ',
      destination: '舘山寺温泉',
      color: '#457b9d',
      stops: [
        { name: '浜松駅', lastBus: '21:30', major: true },
        { name: '入野', lastBus: '21:45', major: true },
        { name: '庄内', lastBus: '22:00', major: false },
        { name: '舘山寺温泉', lastBus: '22:20', major: true }
      ]
    },
    {
      id: 'dev-west-2',
      name: 'W2 志都呂モール',
      destination: 'ショッピングモール志都呂',
      color: '#1d3557',
      stops: [
        { name: '浜松駅', lastBus: '22:00', major: true },
        { name: '高塚駅', lastBus: '22:15', major: true },
        { name: 'ショッピングモール志都呂', lastBus: '22:35', major: true }
      ]
    },
    {
      id: 'dev-west-3',
      name: 'W3 雄踏ナイト',
      destination: '雄踏総合公園',
      color: '#a8dadc',
      stops: [
        { name: '浜松駅', lastBus: '23:00', major: true },
        { name: '大平台', lastBus: '23:15', major: true },
        { name: '雄踏', lastBus: '23:30', major: true },
        { name: '雄踏総合公園', lastBus: '23:45', major: true }
      ]
    },

    // === 南方面 ===
    {
      id: 'dev-south-1',
      name: 'S1 海岸通り',
      destination: '中田島砂丘',
      color: '#e9c46a',
      stops: [
        { name: '浜松駅', lastBus: '21:20', major: true },
        { name: '南区役所', lastBus: '21:32', major: true },
        { name: '可美', lastBus: '21:45', major: false },
        { name: '中田島砂丘', lastBus: '22:00', major: true }
      ]
    },
    {
      id: 'dev-south-2',
      name: 'S2 米津シャトル',
      destination: '米津浜',
      color: '#f4a261',
      stops: [
        { name: '浜松駅', lastBus: '22:10', major: true },
        { name: '新橋', lastBus: '22:22', major: false },
        { name: '米津', lastBus: '22:40', major: true },
        { name: '米津浜', lastBus: '22:55', major: true }
      ]
    },

    // === 北東方面 ===
    {
      id: 'dev-northeast-1',
      name: 'NE1 医大病院線',
      destination: '医科大学',
      color: '#9b2226',
      stops: [
        { name: '浜松駅', lastBus: '22:30', major: true },
        { name: '半田山', lastBus: '22:45', major: true },
        { name: '医科大学', lastBus: '23:00', major: true }
      ]
    },

    // === 北西方面 ===
    {
      id: 'dev-northwest-1',
      name: 'NW1 佐鳴台循環',
      destination: '佐鳴台団地',
      color: '#bb3e03',
      stops: [
        { name: '浜松駅', lastBus: '23:10', major: true },
        { name: '蜆塚', lastBus: '23:22', major: true },
        { name: '佐鳴台', lastBus: '23:35', major: true },
        { name: '佐鳴台団地', lastBus: '23:50', major: true }
      ]
    },

    // === 深夜バス ===
    {
      id: 'dev-midnight-1',
      name: 'M1 ミッドナイト便',
      destination: '遠鉄自動車学校',
      color: '#6a0dad',
      stops: [
        { name: '浜松駅', lastBus: '24:15', major: true },
        { name: '鍛冶町', lastBus: '24:20', major: false },
        { name: '東伊場', lastBus: '24:28', major: true },
        { name: '遠鉄自動車学校', lastBus: '24:40', major: true }
      ]
    }
  ]
};
