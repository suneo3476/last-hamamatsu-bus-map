/**
 * 浜松終バスマップ - バスデータ
 *
 * ⚠️ 開発用サンプルデータ（時刻は仮）
 * 実際の遠鉄バス時刻表を確認してください
 *
 * 乗り場配置: 画像のバスターミナル図に対応
 * 乗り場1が下、時計回りに1→16
 */

const BUS_DATA = {
  // メタ情報
  meta: {
    version: '0.3.0-dev',
    isDev: true,
    lastUpdated: '2026-01-12',
    notice: '⚠️ 開発用サンプルデータです。時刻は実際と異なります。'
  },

  // 中心駅
  center: {
    name: '浜松駅バスターミナル',
    id: 'hamamatsu'
  },

  // 乗り場の色（画像から抽出）
  platformColors: {
    1: '#d4a373',  // 茶系
    2: '#20b2aa',  // 青緑
    3: '#cd853f',  // 茶オレンジ
    4: '#32cd32',  // 緑
    5: '#6b8e23',  // オリーブ
    6: '#ff69b4',  // ピンク
    7: '#808080',  // グレー
    8: '#c71585',  // マゼンタ
    9: '#ffa500',  // オレンジ
    10: '#ff6347', // 赤オレンジ
    11: '#4682b4', // 青（欠番だが念のため）
    12: '#5f9ea0', // シアン
    13: '#6495ed', // 青紫
    14: '#ba55d3', // 紫
    15: '#483d8b', // 紺
    16: '#191970'  // ネイビー
  },

  // 路線データ（乗り場順）
  // 乗り場11は欠番
  routes: [
    // === 乗り場1: 舘山寺線/大塚ひとみヶ丘線/大久保線 ===
    {
      id: 'p1-30',
      platform: 1,
      routeNum: '30',
      name: '舘山寺線',
      destination: '伊佐見橋・舘山寺温泉・村櫛',
      color: '#d4a373',
      stops: [
        { name: '浜松駅', lastBus: '21:10' },
        { name: '舘山寺温泉', lastBus: '21:55' }
      ]
    },
    {
      id: 'p1-31',
      platform: 1,
      routeNum: '31',
      name: '舘山寺線',
      destination: '伊佐見橋・舘山寺温泉・村櫛',
      color: '#d4a373',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '舘山寺温泉', lastBus: '22:15' }
      ]
    },
    {
      id: 'p1-36',
      platform: 1,
      routeNum: '36',
      name: '大塚ひとみヶ丘線',
      destination: 'ゆう・おおひとみ・ひとみヶ丘',
      color: '#d4a373',
      stops: [
        { name: '浜松駅', lastBus: '21:45' },
        { name: 'ひとみヶ丘', lastBus: '22:25' }
      ]
    },
    {
      id: 'p1-37',
      platform: 1,
      routeNum: '37',
      name: '大久保線',
      destination: '神ヶ谷・大久保',
      color: '#d4a373',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '大久保', lastBus: '22:40' }
      ]
    },

    // === 乗り場2: 遠州浜蜆塚線/鶴見富塚じゅんかん/大平台線/伊佐見線 ===
    {
      id: 'p2-0',
      platform: 2,
      routeNum: '0',
      name: '遠州浜蜆塚線',
      destination: '蜆塚・佐鳴台',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '21:20' },
        { name: '佐鳴台', lastBus: '21:50' }
      ]
    },
    {
      id: 'p2-8',
      platform: 2,
      routeNum: '8',
      name: '鶴見富塚じゅんかん',
      destination: '医療センターまわり',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '22:30' },
        { name: '医療センター', lastBus: '23:00' }
      ]
    },
    {
      id: 'p2-8-22',
      platform: 2,
      routeNum: '8-22',
      name: '大平台線',
      destination: '広沢・医療センター経由・大平台',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '大平台', lastBus: '22:30' }
      ]
    },
    {
      id: 'p2-8-33',
      platform: 2,
      routeNum: '8-33',
      name: '伊佐見線',
      destination: '広沢・医療センター・伊佐見',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '21:35' },
        { name: '伊佐見', lastBus: '22:15' }
      ]
    },

    // === 乗り場3: 掛塚さなる台線/大平台線 ===
    {
      id: 'p3-9',
      platform: 3,
      routeNum: '9',
      name: '掛塚さなる台線',
      destination: '鴨江・医療センター',
      color: '#cd853f',
      stops: [
        { name: '浜松駅', lastBus: '22:20' },
        { name: '医療センター', lastBus: '22:55' }
      ]
    },
    {
      id: 'p3-9-22',
      platform: 3,
      routeNum: '9-22',
      name: '大平台線',
      destination: '鴨江・大平台',
      color: '#cd853f',
      stops: [
        { name: '浜松駅', lastBus: '21:40' },
        { name: '大平台', lastBus: '22:20' }
      ]
    },

    // === 乗り場4: 浜名線/小沢渡線 ===
    {
      id: 'p4-12',
      platform: 4,
      routeNum: '12',
      name: '浜名線',
      destination: '高塚・馬郡',
      color: '#32cd32',
      stops: [
        { name: '浜松駅', lastBus: '22:15' },
        { name: '馬郡', lastBus: '22:55' }
      ]
    },
    {
      id: 'p4-16-4',
      platform: 4,
      routeNum: '16-4',
      name: '小沢渡線',
      destination: '春日町・法枝・小沢渡・浜松市総合水泳場',
      color: '#32cd32',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '総合水泳場', lastBus: '22:10' }
      ]
    },

    // === 乗り場5: 志都呂宇布見線 ===
    {
      id: 'p5-20',
      platform: 5,
      routeNum: '20',
      name: '志都呂宇布見線',
      destination: '入野・山崎・舞阪駅',
      color: '#6b8e23',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '舞阪駅', lastBus: '22:50' }
      ]
    },

    // === 乗り場6: 中田島線/三島江之島線/大塚ひとみヶ丘線 ===
    {
      id: 'p6-4',
      platform: 6,
      routeNum: '4',
      name: '中田島線',
      destination: '中田島砂丘',
      color: '#ff69b4',
      stops: [
        { name: '浜松駅', lastBus: '21:15' },
        { name: '中田島砂丘', lastBus: '21:45' }
      ]
    },
    {
      id: 'p6-5',
      platform: 6,
      routeNum: '5',
      name: '三島江之島線',
      destination: '南行政センター・江之島・遠州浜',
      color: '#ff69b4',
      stops: [
        { name: '浜松駅', lastBus: '21:40' },
        { name: '遠州浜', lastBus: '22:20' }
      ]
    },
    {
      id: 'p6-6',
      platform: 6,
      routeNum: '6',
      name: '大塚ひとみヶ丘線',
      destination: '北寺島・大塚',
      color: '#ff69b4',
      stops: [
        { name: '浜松駅', lastBus: '22:05' },
        { name: '大塚', lastBus: '22:40' }
      ]
    },

    // === 乗り場7: 遠州浜蜆塚線 ===
    {
      id: 'p7-1',
      platform: 7,
      routeNum: '1',
      name: '遠州浜蜆塚線',
      destination: '遠州浜',
      color: '#808080',
      stops: [
        { name: '浜松駅', lastBus: '22:10' },
        { name: '遠州浜', lastBus: '22:50' }
      ]
    },

    // === 乗り場8: 鶴見線/掛塚さなる台線 ===
    {
      id: 'p8-91',
      platform: 8,
      routeNum: '91',
      name: '鶴見線',
      destination: '鶴見',
      color: '#c71585',
      stops: [
        { name: '浜松駅', lastBus: '21:55' },
        { name: '鶴見', lastBus: '22:30' }
      ]
    },
    {
      id: 'p8-90',
      platform: 8,
      routeNum: '90',
      name: '掛塚さなる台線',
      destination: '掛塚',
      color: '#c71585',
      stops: [
        { name: '浜松駅', lastBus: '22:25' },
        { name: '掛塚', lastBus: '23:05' }
      ]
    },
    {
      id: 'p8-96',
      platform: 8,
      routeNum: '96',
      name: '掛塚さなる台線',
      destination: '掛塚・豊浜',
      color: '#c71585',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '豊浜', lastBus: '22:15' }
      ]
    },

    // === 乗り場9: 中ノ町磐田線 ===
    {
      id: 'p9-80',
      platform: 9,
      routeNum: '80',
      name: '中ノ町磐田線',
      destination: '中ノ町・磐田駅・見付',
      color: '#ffa500',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '磐田駅', lastBus: '22:50' }
      ]
    },

    // === 乗り場10: 笠井線/蒲線/早出線 ===
    {
      id: 'p10-73',
      platform: 10,
      routeNum: '73',
      name: '笠井線',
      destination: '労災・丸塚・原島・笠井',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '笠井', lastBus: '22:30' }
      ]
    },
    {
      id: 'p10-75',
      platform: 10,
      routeNum: '75',
      name: '笠井線',
      destination: '労災・宮竹・原島・笠井',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '22:20' },
        { name: '笠井', lastBus: '23:00' }
      ]
    },
    {
      id: 'p10-76',
      platform: 10,
      routeNum: '76',
      name: '笠井線',
      destination: '労災正門・宮竹・原島・笠井',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:15' },
        { name: '笠井', lastBus: '21:55' }
      ]
    },
    {
      id: 'p10-74',
      platform: 10,
      routeNum: '74',
      name: '蒲線',
      destination: '労災・丸塚・中田町・イオン市野',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '22:35' },
        { name: 'イオン市野', lastBus: '23:15' }
      ]
    },
    {
      id: 'p10-77',
      platform: 10,
      routeNum: '77',
      name: '蒲線',
      destination: '労災・丸塚・東海染工・イオン市野',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:05' },
        { name: 'イオン市野', lastBus: '21:45' }
      ]
    },
    {
      id: 'p10-78',
      platform: 10,
      routeNum: '78',
      name: '蒲線',
      destination: '労災・丸塚・原島・産業展示館',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:35' },
        { name: '産業展示館', lastBus: '22:15' }
      ]
    },
    {
      id: 'p10-2',
      platform: 10,
      routeNum: '2',
      name: '早出線',
      destination: '遠州病院・柳通り・早出・イオンモール浜松市野',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:25' },
        { name: 'イオンモール浜松市野', lastBus: '22:00' }
      ]
    },

    // === 乗り場11: 欠番 ===

    // === 乗り場12: 内野台線 ===
    {
      id: 'p12-61',
      platform: 12,
      routeNum: '61',
      name: '内野台線',
      destination: '上島・内野台・サンストリート浜北',
      color: '#5f9ea0',
      stops: [
        { name: '浜松駅', lastBus: '22:25' },
        { name: 'サンストリート浜北', lastBus: '23:10' }
      ]
    },

    // === 乗り場13: 山の手医大線/萩丘都田線 ===
    {
      id: 'p13-50',
      platform: 13,
      routeNum: '50',
      name: '山の手医大線',
      destination: '市役所・山の手・医大',
      color: '#6495ed',
      stops: [
        { name: '浜松駅', lastBus: '22:40' },
        { name: '医大', lastBus: '23:20' }
      ]
    },
    {
      id: 'p13-53',
      platform: 13,
      routeNum: '53',
      name: '萩丘都田線',
      destination: '市役所・萩丘住宅・半田公園・きらりタウン',
      color: '#6495ed',
      stops: [
        { name: '浜松駅', lastBus: '21:55' },
        { name: 'きらりタウン', lastBus: '22:40' }
      ]
    },
    {
      id: 'p13-56',
      platform: 13,
      routeNum: '56',
      name: '萩丘都田線',
      destination: '市役所・萩丘住宅・テクノ・都田・フルーツパーク',
      color: '#6495ed',
      stops: [
        { name: '浜松駅', lastBus: '22:15' },
        { name: 'フルーツパーク', lastBus: '23:00' }
      ]
    },

    // === 乗り場14: 鶴見富塚じゅんかん/泉高丘線/和合西山線（せいれい経由） ===
    {
      id: 'p14-8',
      platform: 14,
      routeNum: '8',
      name: '鶴見富塚じゅんかん',
      destination: 'せいれいまわり',
      color: '#ba55d3',
      stops: [
        { name: '浜松駅', lastBus: '21:45' },
        { name: 'せいれい', lastBus: '22:20' }
      ]
    },
    {
      id: 'p14-51',
      platform: 14,
      routeNum: '51',
      name: '泉高丘線',
      destination: 'せいれい病院・泉高丘・姫街道車庫',
      color: '#ba55d3',
      stops: [
        { name: '浜松駅', lastBus: '22:05' },
        { name: '姫街道車庫', lastBus: '22:45' }
      ]
    },
    {
      id: 'p14-58',
      platform: 14,
      routeNum: '58',
      name: '和合西山線',
      destination: 'せいれい病院・和合・西山',
      color: '#ba55d3',
      stops: [
        { name: '浜松駅', lastBus: '22:30' },
        { name: '西山', lastBus: '23:10' }
      ]
    },

    // === 乗り場15: 気賀三ヶ日線/引佐線/奥山線/葵町医大線 ===
    {
      id: 'p15-40',
      platform: 15,
      routeNum: '40',
      name: '気賀三ヶ日線',
      destination: '姫街道車庫・聖隷三方原病院・気賀・三ヶ日',
      color: '#483d8b',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '三ヶ日', lastBus: '22:50' }
      ]
    },
    {
      id: 'p15-43',
      platform: 15,
      routeNum: '43',
      name: '引佐線',
      destination: '根洗・聖隷三方原病院・金指・気賀',
      color: '#483d8b',
      stops: [
        { name: '浜松駅', lastBus: '22:10' },
        { name: '気賀', lastBus: '23:00' }
      ]
    },
    {
      id: 'p15-45',
      platform: 15,
      routeNum: '45',
      name: '奥山線',
      destination: '金指・奥山',
      color: '#483d8b',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '奥山', lastBus: '22:25' }
      ]
    },
    {
      id: 'p15-47',
      platform: 15,
      routeNum: '47',
      name: '葵町医大線',
      destination: '葵町経由・医科大学',
      color: '#483d8b',
      stops: [
        { name: '浜松駅', lastBus: '22:35' },
        { name: '医科大学', lastBus: '23:15' }
      ]
    },

    // === 乗り場16: 高台線/和合西山線（下池川町経由）/都田線 ===
    {
      id: 'p16-41',
      platform: 16,
      routeNum: '41',
      name: '高台線',
      destination: '葵・高丘・ファイブガーデンズ・花川運動公園',
      color: '#191970',
      stops: [
        { name: '浜松駅', lastBus: '22:20' },
        { name: '花川運動公園', lastBus: '23:00' }
      ]
    },
    {
      id: 'p16-48',
      platform: 16,
      routeNum: '48',
      name: '和合西山線',
      destination: '下池川・和合・西山',
      color: '#191970',
      stops: [
        { name: '浜松駅', lastBus: '21:20' },
        { name: '西山', lastBus: '22:05' }
      ]
    },
    {
      id: 'p16-46',
      platform: 16,
      routeNum: '46',
      name: '都田線',
      destination: '曳馬野・都田',
      color: '#191970',
      stops: [
        { name: '浜松駅', lastBus: '21:00' },
        { name: '都田', lastBus: '21:50' }
      ]
    },
    {
      id: 'p16-46-te',
      platform: 16,
      routeNum: '46-テ',
      name: '都田線',
      destination: '曳馬野・テクノ都田',
      color: '#191970',
      stops: [
        { name: '浜松駅', lastBus: '22:50' },
        { name: 'テクノ都田', lastBus: '23:40' }
      ]
    }
  ]
};
