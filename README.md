# MC BATTLE - Rap Battle Game

ラップバトルをテーマにしたワード選択型ゲームです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Shadcn UI
- **状態管理**: Zustand
- **アイコン**: Lucide React
- **音声**: Web Audio API (プログラム生成ビート)

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

## 音楽・音声システム

### 設定ファイル
- `lib/audio-config.ts`: BPM、音量、ファイルパスを一元管理
- `lib/audio-manager.ts`: 音声再生のシングルトンマネージャー

### 実装済み機能
- ✅ BPM120のビート音（Web Audio APIでプログラム生成）
- ✅ タップ判定音（Perfect/Good/Bad/Miss）
- ✅ 音量調整（BGM/効果音を個別に設定可能）
- ✅ ビート同期システム

### 音声ファイルの追加方法
現在はプログラム生成のビート音のみ実装されています。将来的にBGMや高品質な効果音を追加する場合：

1. 音声ファイルを配置:
```
public/audio/
  bgm/
    title.mp3
    battle.mp3
  sfx/
    tap-perfect.mp3
    tap-good.mp3
    ...
```

2. `lib/audio-config.ts`でファイルパスを設定:
```typescript
bgm: {
  title: "/audio/bgm/title.mp3",
  battle: "/audio/bgm/battle.mp3",
}
```

3. コンポーネントから再生:
```typescript
audioManager.playBGM("title");
```

## 未実装機能

- ⏳ BGM音源ファイル（現在はプログラム生成ビートのみ）
- ⏳ コロケーション音声合成（TTS）
- ⏳ 複数敵キャラクター（フェーズ2）

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
