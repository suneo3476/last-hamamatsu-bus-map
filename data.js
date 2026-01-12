/**
 * 遠鉄バス 終バスデータ
 *
 * 注意: これはサンプルデータです。
 * 実際の時刻表に基づいて更新する必要があります。
 */

const BUS_DATA = {
  // 中心駅
  center: {
    name: '浜松駅',
    id: 'hamamatsu'
  },

  // 路線データ
  routes: [
    {
      id: 'line-1',
      name: '1 中ノ町・小池 方面',
      destination: '小池',
      color: '#e60012',
      stops: [
        { name: '浜松駅', lastBus: '22:30', major: true },
        { name: '伝馬町', lastBus: '22:33', major: false },
        { name: '中ノ町', lastBus: '22:45', major: true },
        { name: '小池', lastBus: '23:00', major: true }
      ]
    },
    {
      id: 'line-8',
      name: '8 鶴見・湖東高校 方面',
      destination: '湖東高校',
      color: '#00a651',
      stops: [
        { name: '浜松駅', lastBus: '22:15', major: true },
        { name: '鶴見', lastBus: '22:30', major: true },
        { name: '湖東高校', lastBus: '22:45', major: true }
      ]
    },
    {
      id: 'line-15',
      name: '15 医療センター 方面',
      destination: '医療センター',
      color: '#0068b7',
      stops: [
        { name: '浜松駅', lastBus: '21:45', major: true },
        { name: '高丘', lastBus: '22:00', major: true },
        { name: '医療センター', lastBus: '22:15', major: true }
      ]
    },
    {
      id: 'line-30',
      name: '30 浜松北高 方面',
      destination: '浜松北高',
      color: '#f39800',
      stops: [
        { name: '浜松駅', lastBus: '22:00', major: true },
        { name: '広沢', lastBus: '22:10', major: true },
        { name: '浜松北高', lastBus: '22:20', major: true }
      ]
    },
    {
      id: 'line-40',
      name: '40 蜆塚・佐鳴台 方面',
      destination: '佐鳴台団地',
      color: '#920783',
      stops: [
        { name: '浜松駅', lastBus: '22:30', major: true },
        { name: '蜆塚', lastBus: '22:45', major: true },
        { name: '佐鳴台団地', lastBus: '23:00', major: true }
      ]
    },
    {
      id: 'line-50',
      name: '50 舘山寺 方面',
      destination: '舘山寺温泉',
      color: '#00a0e9',
      stops: [
        { name: '浜松駅', lastBus: '21:30', major: true },
        { name: '入野', lastBus: '21:50', major: true },
        { name: '舘山寺温泉', lastBus: '22:15', major: true }
      ]
    },
    {
      id: 'line-56',
      name: '56 大平台・雄踏 方面',
      destination: '雄踏車庫',
      color: '#009944',
      stops: [
        { name: '浜松駅', lastBus: '22:20', major: true },
        { name: '大平台', lastBus: '22:35', major: true },
        { name: '雄踏車庫', lastBus: '22:50', major: true }
      ]
    },
    {
      id: 'line-80',
      name: '80 志都呂 方面',
      destination: 'イオンモール浜松志都呂',
      color: '#eb6100',
      stops: [
        { name: '浜松駅', lastBus: '21:50', major: true },
        { name: '高塚駅', lastBus: '22:05', major: true },
        { name: 'イオンモール浜松志都呂', lastBus: '22:20', major: true }
      ]
    }
  ]
};

// 参考: 実際のデータ収集時に必要になる情報
// - 遠鉄バス公式サイト: https://bus.entetsu.co.jp/
// - NAVITIME: https://www.navitime.co.jp/bus/
// - Yahoo!乗換案内
