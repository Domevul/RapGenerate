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
- **テスト**: Vitest + React Testing Library

## プロジェクト構造

詳細なアーキテクチャ情報は [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

```
rapbattle/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # メインページ（画面切り替え）
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── screens/          # 各画面コンポーネント
│   │   ├── TitleScreen.tsx
│   │   ├── DeckSelectScreen.tsx
│   │   ├── EnemyTurnScreen.tsx
│   │   ├── BattlePrepareScreen.tsx
│   │   ├── BattleAttackScreen.tsx
│   │   ├── TurnResultScreen.tsx
│   │   ├── FinalResultScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── ErrorScreen.tsx
│   └── ui/               # 再利用可能なUIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── slider.tsx
│       ├── modal.tsx
│       ├── tutorial-modal.tsx
│       └── remaining-deck-display.tsx
├── lib/                   # ビジネスロジック
│   ├── store.ts          # Zustand状態管理
│   ├── types.ts          # TypeScript型定義
│   ├── game-logic.ts     # ゲームロジック
│   ├── game-logic.test.ts # テスト
│   ├── audio-config.ts   # 音声設定
│   ├── audio-manager.ts  # 音声マネージャー
│   ├── constants.ts      # ゲーム定数
│   └── ...data.ts        # 各種データファイル
└── public/audio/         # 音声ファイル（未配置）
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

## テスト

### テスト実行
```bash
# テスト実行（watch mode）
npm test

# テスト実行（1回のみ）
npm test -- --run

# UI付きテスト実行
npm run test:ui

# カバレッジ計測
npm run test:coverage
```

### TDD（テスト駆動開発）の原則
このプロジェクトではt-wadaの手法に沿ったTDDを採用しています：

1. **Red**: まずテストを書く（失敗することを確認）
2. **Green**: 最小限のコードでテストを成功させる
3. **Refactor**: コードを改善する

**重要**: コード変更前に必ず `npm test -- --run` でテストを実行し、全テストが成功することを確認してください。

### テストファイル
- `lib/game-logic.test.ts` - ゲームロジックのユニットテスト（11テスト）
  - リズムスコア計算
  - ライミングチェーン評価
  - タイプ相性評価
  - ターン結果統合
  - 残りカード管理

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
