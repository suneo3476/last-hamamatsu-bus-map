/**
 * 浜松終バスマップ - バスデータ
 *
 * 遠鉄バス公式時刻表(2025年8月28日改正)に基づく
 *
 * 乗り場配置: 画像のバスターミナル図に対応
 * 乗り場1が下、時計回りに1→16
 * 乗り場11は欠番
 */

const BUS_DATA = {
  // メタ情報
  meta: {
    version: '1.0.0',
    isDev: false,
    lastUpdated: '2026-01-12',
    dataRevision: '2025-08-28',
    notice: '遠鉄バス公式時刻表(2025年8月28日改正)に基づく'
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
    // === 乗り場1: 舘山寺線/大塚ひとみヶ丘線 ===
    // 大久保線(37)は18:07終バスのため掲載対象外
    {
      id: 'p1-30-31',
      platform: 1,
      routeNum: '30/31',
      name: '舘山寺線',
      destination: '村櫛',
      color: '#d4a373',
      weekday: {
        lastDeparture: '23:00',
        lastArrival: '23:26'
      },
      holiday: {
        lastDeparture: '23:00',
        lastArrival: '23:29'
      }
    },
    {
      id: 'p1-36',
      platform: 1,
      routeNum: '36',
      name: '大塚ひとみヶ丘線',
      destination: '山崎',
      color: '#d4a373',
      weekday: {
        lastDeparture: '21:26',
        lastArrival: '22:10'
      },
      holiday: {
        lastDeparture: '21:26',
        lastArrival: '22:09'
      }
    },

    // === 乗り場3: 掛塚さなる台線 ===
    {
      id: 'p3-9',
      platform: 3,
      routeNum: '9',
      name: '掛塚さなる台線',
      destination: '掛塚',
      color: '#cd853f',
      weekday: {
        lastDeparture: '22:40',
        lastArrival: '23:08'
      },
      holiday: {
        lastDeparture: '22:40',
        lastArrival: '23:08'
      }
    },

    // === 乗り場4: 浜名線/小沢渡線 ===
    {
      id: 'p4-12',
      platform: 4,
      routeNum: '12',
      name: '浜名線',
      destination: '馬郡遺跡',
      color: '#32cd32',
      weekday: {
        lastDeparture: '21:36',
        lastArrival: '22:03'
      },
      holiday: {
        lastDeparture: '21:36',
        lastArrival: '22:03'
      }
    },
    {
      id: 'p4-16-4',
      platform: 4,
      routeNum: '16-4',
      name: '小沢渡線',
      destination: '柏原西',
      color: '#32cd32',
      weekday: {
        lastDeparture: '20:37',
        lastArrival: '21:04'
      },
      holiday: {
        lastDeparture: '20:37',
        lastArrival: '21:04'
      }
    },

    // === 乗り場5: 志都呂宇布見線 ===
    {
      id: 'p5-20',
      platform: 5,
      routeNum: '20',
      name: '志都呂宇布見線',
      destination: '舞阪駅',
      color: '#6b8e23',
      weekday: {
        lastDeparture: '22:40',
        lastArrival: '23:16'
      },
      holiday: {
        lastDeparture: '22:40',
        lastArrival: '23:16'
      }
    },

    // === 乗り場6: 中田島線/三島江之島線 ===
    {
      id: 'p6-4',
      platform: 6,
      routeNum: '4',
      name: '中田島線',
      destination: '中田島車庫',
      color: '#ff69b4',
      weekday: {
        lastDeparture: '22:20',
        lastArrival: '22:37'
      },
      holiday: {
        lastDeparture: '22:20',
        lastArrival: '22:37'
      }
    },
    {
      id: 'p6-5',
      platform: 6,
      routeNum: '5',
      name: '三島江之島線',
      destination: '遠州浜四丁目',
      color: '#ff69b4',
      weekday: {
        lastDeparture: '20:15',
        lastArrival: '20:43'
      },
      holiday: {
        lastDeparture: '20:15',
        lastArrival: '20:43'
      }
    },

    // === 乗り場7: 遠州浜蜆塚線 ===
    {
      id: 'p7-1',
      platform: 7,
      routeNum: '1',
      name: '遠州浜蜆塚線',
      destination: '遠州浜遠鉄',
      color: '#808080',
      weekday: {
        lastDeparture: '22:40',
        lastArrival: '23:00'
      },
      holiday: {
        lastDeparture: '22:40',
        lastArrival: '23:00'
      }
    },

    // === 乗り場8: 鶴見富塚じゅんかん ===
    {
      id: 'p8-91',
      platform: 8,
      routeNum: '91',
      name: '鶴見富塚じゅんかん',
      destination: '新貝住宅',
      color: '#c71585',
      weekday: {
        lastDeparture: '20:55',
        lastArrival: '21:16'
      },
      holiday: {
        lastDeparture: '20:55',
        lastArrival: '21:16'
      }
    },

    // === 乗り場9: 中ノ町磐田線 ===
    {
      id: 'p9-80',
      platform: 9,
      routeNum: '80',
      name: '中ノ町磐田線',
      destination: '磐田営業所',
      color: '#ffa500',
      weekday: {
        lastDeparture: '22:08',
        lastArrival: '22:18'
      },
      holiday: {
        lastDeparture: '22:08',
        lastArrival: '22:18'
      }
    },

    // === 乗り場10: 早出線 ===
    {
      id: 'p10-2',
      platform: 10,
      routeNum: '2',
      name: '早出線',
      destination: 'イオンモール浜松市野',
      color: '#ff6347',
      weekday: {
        lastDeparture: '21:00',
        lastArrival: '21:16'
      },
      holiday: {
        lastDeparture: '21:00',
        lastArrival: '21:16'
      }
    },

    // === 乗り場12: 内野台線 ===
    {
      id: 'p12-61',
      platform: 12,
      routeNum: '61',
      name: '内野台線',
      destination: '内野台車庫',
      color: '#5f9ea0',
      weekday: {
        lastDeparture: '20:53',
        lastArrival: '20:59'
      },
      holiday: {
        lastDeparture: '20:53',
        lastArrival: '20:59'
      }
    },

    // === 乗り場13: 山の手医大線/萩丘都田線 ===
    {
      id: 'p13-50',
      platform: 13,
      routeNum: '50',
      name: '山の手医大線',
      destination: '医科大学',
      color: '#6495ed',
      weekday: {
        lastDeparture: '22:40',
        lastArrival: '23:10'
      },
      holiday: {
        lastDeparture: '22:40',
        lastArrival: '23:10'
      }
    },
    {
      id: 'p13-53-56',
      platform: 13,
      routeNum: '53/56',
      name: '萩丘都田線',
      destination: 'フルーツパーク',
      color: '#6495ed',
      weekday: {
        lastDeparture: '20:45',
        lastArrival: '21:21'
      },
      holiday: {
        lastDeparture: '20:45',
        lastArrival: '21:21'
      }
    },

    // === 乗り場14: 泉高丘線/和合西山線 ===
    {
      id: 'p14-51',
      platform: 14,
      routeNum: '51',
      name: '泉高丘線',
      destination: '姫街道車庫',
      color: '#ba55d3',
      weekday: {
        lastDeparture: '22:13',
        lastArrival: '22:49'
      },
      holiday: {
        lastDeparture: '22:13',
        lastArrival: '22:48'
      }
    },
    {
      id: 'p14-48-58',
      platform: 14,
      routeNum: '48/58',
      name: '和合西山線',
      destination: '西山',
      color: '#ba55d3',
      weekday: {
        lastDeparture: '21:02',
        lastArrival: '21:24'
      },
      holiday: {
        lastDeparture: '21:02',
        lastArrival: '21:24'
      }
    },

    // === 乗り場15: 気賀三ヶ日線/引佐奥山線 ===
    {
      id: 'p15-40',
      platform: 15,
      routeNum: '40',
      name: '気賀三ヶ日線',
      destination: '三ヶ日車庫',
      color: '#483d8b',
      weekday: {
        lastDeparture: '23:05',
        lastArrival: '23:54'
      },
      holiday: {
        lastDeparture: '23:05',
        lastArrival: '23:54'
      }
    },
    {
      id: 'p15-43-45',
      platform: 15,
      routeNum: '43/45',
      name: '引佐奥山線',
      destination: '奥山',
      color: '#483d8b',
      weekday: {
        lastDeparture: '22:25',
        lastArrival: '23:15'
      },
      holiday: {
        lastDeparture: '22:35',
        lastArrival: '23:25'
      }
    },

    // === 乗り場16: 高台線/都田線 ===
    {
      id: 'p16-41',
      platform: 16,
      routeNum: '41',
      name: '高台線',
      destination: '花川運動公園',
      color: '#191970',
      weekday: {
        lastDeparture: '21:50',
        lastArrival: '22:35'
      },
      holiday: {
        lastDeparture: '21:50',
        lastArrival: '22:34'
      }
    },
    {
      id: 'p16-46',
      platform: 16,
      routeNum: '46',
      name: '都田線',
      destination: '都田駅前',
      color: '#191970',
      weekday: {
        lastDeparture: '21:25',
        lastArrival: '22:17'
      },
      holiday: {
        lastDeparture: '21:25',
        lastArrival: '22:20'
      }
    }
  ],

  // 掲載対象外の路線（運行本数が極端に少ないなど）
  excludedRoutes: [
    {
      platform: 1,
      routeNum: '37',
      name: '大久保線',
      reason: '終バスが18:07と極端に早い（1日3本のみ運行）'
    }
  ]
};
