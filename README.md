# MC BATTLE - Rap Battle Game

ラップバトルをテーマにしたワード選択型ゲームです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Shadcn UI
- **状態管理**: Zustand
- **アイコン**: Lucide React

## プロジェクト構造

```
rapbattle/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # メインページ（画面切り替え）
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── screens/          # 各画面コンポーネント
│   │   ├── TitleScreen.tsx
│   │   ├── TutorialScreen.tsx
│   │   ├── WordSelectScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── LoadScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── GameOverScreen.tsx
│   └── ui/               # Shadcn UI コンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       └── slider.tsx
├── lib/
│   ├── store.ts          # Zustand ストア（ゲーム状態管理）
│   ├── types.ts          # TypeScript 型定義
│   ├── words-data.ts     # ワードデータ
│   └── utils.ts          # ユーティリティ関数
└── Screen/               # 元のHTML画面（参考用）
```

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで開く:
```
http://localhost:3000
```

## 実装済み機能

### ゲームフロー
- ✅ タイトル画面
- ✅ チュートリアル画面（4ステップ）
- ✅ ワード選択画面（9ワード選択、カテゴリフィルター）
- ✅ 設定画面（音量調整、言語切替）
- ✅ セーブ/ロード機能（LocalStorage使用）
- ✅ リザルト画面
- ✅ ゲームオーバー画面

### 状態管理
- Zustand を使用したグローバル状態管理
- LocalStorage へのセーブデータ永続化
- 設定の保存

### UI/UX
- レスポンシブデザイン
- ネオンエフェクト（シアン/マゼンタ）
- アニメーション
- ダークテーマ

## 未実装機能

- ⏳ バトル画面の実装
- ⏳ バトルロジック（ターン制、タイマー、スコアリング）
- ⏳ AIの実装（相手の行動）

## 開発メモ

### バトルシステムについて
バトル画面とそのロジックは、詳細を詰める必要があるため一旦保留としています。
実装時には以下の要素を考慮する必要があります：

- ターン制の実装
- タイマー機能（15秒など）
- ワード選択の制約
- スコアリングアルゴリズム
- AI の応答生成

## ライセンス

Private project
