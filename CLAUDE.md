# 浜松終バスマップ (Last Hamamatsu Bus Map)

遠鉄バスの終バスを時間軸で可視化するインタラクティブマップ

## プロジェクト概要

- 参考: https://tokyo-last-train-map.pages.dev
- 遠鉄バス版の終バスマップを作成
- Cloudflare Pages でホスティング

## 技術スタック

- HTML/CSS/JavaScript (Vanilla JS)
- SVG (路線・バス停の描画)
- Cloudflare Pages (ホスティング)

## ブランチ戦略 (Git Flow)

- `main`: リリースブランチ (本番環境)
- `develop`: リリース前ブランチ (開発統合)
- `feature/*`: 機能開発ブランチ

### ブランチ運用ルール

1. 機能開発は `feature/*` ブランチで行う
2. 完成したら `develop` にマージ
3. リリース時に `develop` を `main` にマージ
4. `main` への直接コミットは禁止

## ディレクトリ構成

```
/
├── index.html          # メインHTML
├── style.css           # スタイル
├── app.js              # メインアプリケーション
├── data.js             # バス停・路線データ
├── icons/              # 路線アイコン
├── CLAUDE.md           # このファイル
└── README.md           # プロジェクト説明
```

## コマンド

```bash
# ローカル開発サーバー起動
npx serve .

# または Python の場合
python -m http.server 8000
```

## デプロイ

- Cloudflare Pages に `main` ブランチを接続
- プッシュで自動デプロイ

## データソース

- 遠鉄バス公式サイト: https://bus.entetsu.co.jp/
- 時刻表データは手動または API から取得

## 開発メモ

- 浜松駅を中心とした放射状レイアウト
- 終バス時刻をリアルタイムで可視化
- モバイル対応必須
