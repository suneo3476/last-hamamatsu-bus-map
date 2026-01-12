/**
 * 浜松終バスマップ - バスデータ
 *
 * ⚠️ 開発用サンプルデータ（時刻は仮）
 * 実際の遠鉄バス時刻表を確認してください
 */

const BUS_DATA = {
  // メタ情報
  meta: {
    version: '0.2.0-dev',
    isDev: true,
    lastUpdated: '2026-01-12',
    notice: '⚠️ 開発用サンプルデータです。時刻は実際と異なります。'
  },

  // 中心駅
  center: {
    name: '浜松駅バスターミナル',
    id: 'hamamatsu'
  },

  // 路線データ（乗り場順・時計回り）
  // platform: 乗り場番号, routeNum: 路線番号, color: 路線カラー
  routes: [
    // === 乗り場1 ===
    {
      id: 'p1-30',
      platform: 1,
      routeNum: '30',
      name: '舘山寺線',
      origin: '浜松駅',
      destination: '舘山寺温泉',
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
      origin: '浜松駅',
      destination: '舘山寺温泉',
      color: '#d4a373',
      stops: [
        { name: '浜松駅', lastBus: '21:25' },
        { name: '舘山寺温泉', lastBus: '22:10' }
      ]
    },
    {
      id: 'p1-36',
      platform: 1,
      routeNum: '36',
      name: '大塚ひとみヶ丘線',
      origin: '浜松駅',
      destination: '大塚ひとみヶ丘',
      color: '#8b4513',
      stops: [
        { name: '浜松駅', lastBus: '21:40' },
        { name: '大塚ひとみヶ丘', lastBus: '22:20' }
      ]
    },
    {
      id: 'p1-37',
      platform: 1,
      routeNum: '37',
      name: '大久保線',
      origin: '浜松駅',
      destination: '大久保',
      color: '#556b2f',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '大久保', lastBus: '22:35' }
      ]
    },

    // === 乗り場2 ===
    {
      id: 'p2-dummy',
      platform: 2,
      routeNum: '-',
      name: '（予備）',
      origin: '浜松駅',
      destination: '（予備）',
      color: '#666666',
      stops: [
        { name: '浜松駅', lastBus: '21:00' },
        { name: '（予備）', lastBus: '21:30' }
      ]
    },

    // === 乗り場3 ===
    {
      id: 'p3-0',
      platform: 3,
      routeNum: '0',
      name: '遠州浜蜆塚線',
      origin: '浜松駅',
      destination: '遠州浜',
      color: '#999999',
      stops: [
        { name: '浜松駅', lastBus: '21:15' },
        { name: '遠州浜', lastBus: '21:50' }
      ]
    },
    {
      id: 'p3-8',
      platform: 3,
      routeNum: '8',
      name: '鶴見富塚じゅんかん',
      origin: '浜松駅',
      destination: '鶴見富塚',
      color: '#4169e1',
      stops: [
        { name: '浜松駅', lastBus: '22:30' },
        { name: '鶴見富塚', lastBus: '23:05' }
      ]
    },
    {
      id: 'p3-8-22',
      platform: 3,
      routeNum: '8-22',
      name: '大平台線',
      origin: '浜松駅',
      destination: '大平台',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '大平台', lastBus: '22:25' }
      ]
    },
    {
      id: 'p3-8-33',
      platform: 3,
      routeNum: '8-33',
      name: '伊佐見線',
      origin: '浜松駅',
      destination: '伊佐見',
      color: '#708090',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '伊佐見', lastBus: '22:10' }
      ]
    },

    // === 乗り場4 ===
    {
      id: 'p4-9',
      platform: 4,
      routeNum: '9',
      name: '掛塚さなる台線',
      origin: '浜松駅',
      destination: '掛塚さなる台',
      color: '#cd853f',
      stops: [
        { name: '浜松駅', lastBus: '22:20' },
        { name: '掛塚さなる台', lastBus: '23:00' }
      ]
    },
    {
      id: 'p4-9-22',
      platform: 4,
      routeNum: '9-22',
      name: '大平台線',
      origin: '浜松駅',
      destination: '大平台',
      color: '#20b2aa',
      stops: [
        { name: '浜松駅', lastBus: '21:45' },
        { name: '大平台', lastBus: '22:20' }
      ]
    },

    // === 乗り場5 ===
    {
      id: 'p5-12',
      platform: 5,
      routeNum: '12',
      name: '浜名線',
      origin: '浜松駅',
      destination: '浜名',
      color: '#32cd32',
      stops: [
        { name: '浜松駅', lastBus: '22:10' },
        { name: '浜名', lastBus: '22:50' }
      ]
    },
    {
      id: 'p5-16-4',
      platform: 5,
      routeNum: '16-4',
      name: '小沢渡線',
      origin: '浜松駅',
      destination: '小沢渡',
      color: '#9acd32',
      stops: [
        { name: '浜松駅', lastBus: '21:35' },
        { name: '小沢渡', lastBus: '22:05' }
      ]
    },

    // === 乗り場6 ===
    {
      id: 'p6-20',
      platform: 6,
      routeNum: '20',
      name: '志都呂宇布見線',
      origin: '浜松駅',
      destination: '志都呂宇布見',
      color: '#6b8e23',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '志都呂宇布見', lastBus: '22:45' }
      ]
    },

    // === 乗り場7 ===
    {
      id: 'p7-4',
      platform: 7,
      routeNum: '4',
      name: '中田島線',
      origin: '浜松駅',
      destination: '中田島',
      color: '#ff69b4',
      stops: [
        { name: '浜松駅', lastBus: '21:20' },
        { name: '中田島', lastBus: '21:50' }
      ]
    },
    {
      id: 'p7-5',
      platform: 7,
      routeNum: '5',
      name: '三島江之島線',
      origin: '浜松駅',
      destination: '三島江之島',
      color: '#da70d6',
      stops: [
        { name: '浜松駅', lastBus: '21:40' },
        { name: '三島江之島', lastBus: '22:15' }
      ]
    },
    {
      id: 'p7-6',
      platform: 7,
      routeNum: '6',
      name: '大塚ひとみヶ丘線',
      origin: '浜松駅',
      destination: '大塚ひとみヶ丘',
      color: '#8b4513',
      stops: [
        { name: '浜松駅', lastBus: '22:05' },
        { name: '大塚ひとみヶ丘', lastBus: '22:40' }
      ]
    },

    // === 乗り場8 ===
    {
      id: 'p8-1',
      platform: 8,
      routeNum: '1',
      name: '遠州浜蜆塚線',
      origin: '浜松駅',
      destination: '遠州浜',
      color: '#808080',
      stops: [
        { name: '浜松駅', lastBus: '22:15' },
        { name: '遠州浜', lastBus: '22:55' }
      ]
    },

    // === 乗り場9 ===
    {
      id: 'p9-91',
      platform: 9,
      routeNum: '91',
      name: '鶴見富塚じゅんかん',
      origin: '浜松駅',
      destination: '鶴見富塚',
      color: '#c71585',
      stops: [
        { name: '浜松駅', lastBus: '21:55' },
        { name: '鶴見富塚', lastBus: '22:30' }
      ]
    },
    {
      id: 'p9-90',
      platform: 9,
      routeNum: '90',
      name: '掛塚さなる台線',
      origin: '浜松駅',
      destination: '掛塚さなる台',
      color: '#db7093',
      stops: [
        { name: '浜松駅', lastBus: '22:25' },
        { name: '掛塚さなる台', lastBus: '23:05' }
      ]
    },
    {
      id: 'p9-96',
      platform: 9,
      routeNum: '96',
      name: '掛塚さなる台線',
      origin: '浜松駅',
      destination: '掛塚さなる台',
      color: '#ff1493',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '掛塚さなる台', lastBus: '22:10' }
      ]
    },

    // === 乗り場10 ===
    {
      id: 'p10-9',
      platform: 10,
      routeNum: '9',
      name: '中ノ町磐田線',
      origin: '浜松駅',
      destination: '中ノ町磐田',
      color: '#ffa500',
      stops: [
        { name: '浜松駅', lastBus: '21:45' },
        { name: '中ノ町磐田', lastBus: '22:30' }
      ]
    },
    {
      id: 'p10-80',
      platform: 10,
      routeNum: '80',
      name: '中ノ町磐田線',
      origin: '浜松駅',
      destination: '中ノ町磐田',
      color: '#ff8c00',
      stops: [
        { name: '浜松駅', lastBus: '22:10' },
        { name: '中ノ町磐田', lastBus: '22:55' }
      ]
    },

    // === 乗り場11 ===
    {
      id: 'p11-73',
      platform: 11,
      routeNum: '73',
      name: '笠井線',
      origin: '浜松駅',
      destination: '笠井',
      color: '#ff6347',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '笠井', lastBus: '22:25' }
      ]
    },
    {
      id: 'p11-75',
      platform: 11,
      routeNum: '75',
      name: '笠井線',
      origin: '浜松駅',
      destination: '笠井',
      color: '#ff4500',
      stops: [
        { name: '浜松駅', lastBus: '22:20' },
        { name: '笠井', lastBus: '22:55' }
      ]
    },
    {
      id: 'p11-76',
      platform: 11,
      routeNum: '76',
      name: '笠井線',
      origin: '浜松駅',
      destination: '笠井',
      color: '#dc143c',
      stops: [
        { name: '浜松駅', lastBus: '21:15' },
        { name: '笠井', lastBus: '21:50' }
      ]
    },
    {
      id: 'p11-74',
      platform: 11,
      routeNum: '74',
      name: '蒲線',
      origin: '浜松駅',
      destination: '蒲',
      color: '#b22222',
      stops: [
        { name: '浜松駅', lastBus: '22:35' },
        { name: '蒲', lastBus: '23:10' }
      ]
    },
    {
      id: 'p11-77',
      platform: 11,
      routeNum: '77',
      name: '蒲線',
      origin: '浜松駅',
      destination: '蒲',
      color: '#cd5c5c',
      stops: [
        { name: '浜松駅', lastBus: '21:05' },
        { name: '蒲', lastBus: '21:40' }
      ]
    },
    {
      id: 'p11-78',
      platform: 11,
      routeNum: '78',
      name: '蒲線',
      origin: '浜松駅',
      destination: '蒲',
      color: '#f08080',
      stops: [
        { name: '浜松駅', lastBus: '21:35' },
        { name: '蒲', lastBus: '22:10' }
      ]
    },
    {
      id: 'p11-2',
      platform: 11,
      routeNum: '2',
      name: '早出線',
      origin: '浜松駅',
      destination: '早出',
      color: '#fa8072',
      stops: [
        { name: '浜松駅', lastBus: '21:25' },
        { name: '早出', lastBus: '21:55' }
      ]
    },

    // === 乗り場12 ===
    {
      id: 'p12-11',
      platform: 12,
      routeNum: '11',
      name: '空港バス/高速バス',
      origin: '浜松駅',
      destination: '空港/高速',
      color: '#4682b4',
      stops: [
        { name: '浜松駅', lastBus: '22:00' },
        { name: '空港/高速', lastBus: '23:00' }
      ]
    },

    // === 乗り場13 ===
    {
      id: 'p13-61',
      platform: 13,
      routeNum: '61',
      name: '内野台線',
      origin: '浜松駅',
      destination: '内野台',
      color: '#5f9ea0',
      stops: [
        { name: '浜松駅', lastBus: '22:25' },
        { name: '内野台', lastBus: '23:00' }
      ]
    },

    // === 乗り場14 ===
    {
      id: 'p14-50',
      platform: 14,
      routeNum: '50',
      name: '山の手医大線',
      origin: '浜松駅',
      destination: '山の手医大',
      color: '#6495ed',
      stops: [
        { name: '浜松駅', lastBus: '22:40' },
        { name: '山の手医大', lastBus: '23:15' }
      ]
    },
    {
      id: 'p14-53',
      platform: 14,
      routeNum: '53',
      name: '萩丘都田線',
      origin: '浜松駅',
      destination: '萩丘都田',
      color: '#7b68ee',
      stops: [
        { name: '浜松駅', lastBus: '21:55' },
        { name: '萩丘都田', lastBus: '22:35' }
      ]
    },
    {
      id: 'p14-56',
      platform: 14,
      routeNum: '56',
      name: '萩丘都田線',
      origin: '浜松駅',
      destination: '萩丘都田',
      color: '#9370db',
      stops: [
        { name: '浜松駅', lastBus: '22:15' },
        { name: '萩丘都田', lastBus: '22:55' }
      ]
    },

    // === 乗り場15 ===
    {
      id: 'p15-8',
      platform: 15,
      routeNum: '8',
      name: '鶴見富塚じゅんかん',
      origin: '浜松駅',
      destination: '鶴見富塚',
      color: '#ba55d3',
      stops: [
        { name: '浜松駅', lastBus: '21:40' },
        { name: '鶴見富塚', lastBus: '22:15' }
      ]
    },
    {
      id: 'p15-51',
      platform: 15,
      routeNum: '51',
      name: '泉高丘線',
      origin: '浜松駅',
      destination: '泉高丘',
      color: '#9932cc',
      stops: [
        { name: '浜松駅', lastBus: '22:05' },
        { name: '泉高丘', lastBus: '22:40' }
      ]
    },
    {
      id: 'p15-58',
      platform: 15,
      routeNum: '58',
      name: '和合西山線',
      origin: '浜松駅',
      destination: '和合西山',
      color: '#8b008b',
      stops: [
        { name: '浜松駅', lastBus: '22:30' },
        { name: '和合西山', lastBus: '23:10' }
      ]
    },

    // === 乗り場16 ===
    {
      id: 'p16-40',
      platform: 16,
      routeNum: '40',
      name: '気賀三ヶ日線',
      origin: '浜松駅',
      destination: '気賀三ヶ日',
      color: '#483d8b',
      stops: [
        { name: '浜松駅', lastBus: '21:50' },
        { name: '気賀三ヶ日', lastBus: '22:45' }
      ]
    },
    {
      id: 'p16-43',
      platform: 16,
      routeNum: '43',
      name: '引佐線',
      origin: '浜松駅',
      destination: '引佐',
      color: '#6a5acd',
      stops: [
        { name: '浜松駅', lastBus: '22:10' },
        { name: '引佐', lastBus: '22:55' }
      ]
    },
    {
      id: 'p16-45',
      platform: 16,
      routeNum: '45',
      name: '奥山線',
      origin: '浜松駅',
      destination: '奥山',
      color: '#7b68ee',
      stops: [
        { name: '浜松駅', lastBus: '21:30' },
        { name: '奥山', lastBus: '22:20' }
      ]
    },

    // === 乗り場16（追加分） ===
    {
      id: 'p16-41',
      platform: 16,
      routeNum: '41',
      name: '高台線',
      origin: '浜松駅',
      destination: '高台',
      color: '#191970',
      stops: [
        { name: '浜松駅', lastBus: '22:35' },
        { name: '高台', lastBus: '23:10' }
      ]
    },
    {
      id: 'p16-48',
      platform: 16,
      routeNum: '48',
      name: '和合西山線（下池川町経由）',
      origin: '浜松駅',
      destination: '和合西山',
      color: '#000080',
      stops: [
        { name: '浜松駅', lastBus: '21:20' },
        { name: '和合西山', lastBus: '22:05' }
      ]
    },
    {
      id: 'p16-46',
      platform: 16,
      routeNum: '46',
      name: '都田線',
      origin: '浜松駅',
      destination: '都田',
      color: '#00008b',
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
      origin: '浜松駅',
      destination: '都田テクノ',
      color: '#0000cd',
      stops: [
        { name: '浜松駅', lastBus: '22:50' },
        { name: '都田テクノ', lastBus: '23:35' }
      ]
    }
  ]
};
