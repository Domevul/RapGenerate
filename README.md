# MC BATTLE - Rap Battle Game

ラップバトルをテーマにしたリズムゲーム型ワード選択ゲームです。

## 🎮 ゲーム概要

2ターン制のラップバトルで、相手のラップを聞いて4枚のコロケーション（言葉）を選んでリズムに乗せて返します。韻のチェーン、タイプ相性、リズム精度を駆使して高得点を目指しましょう。

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Shadcn UI
- **状態管理**: Zustand（ドメイン別スライス構成）
- **アイコン**: Lucide React
- **音声**: Web Audio API
- **テスト**: Vitest + React Testing Library

## 📁 プロジェクト構造

```
rapbattle/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── screens/            # 画面コンポーネント（簡潔化済み）
│   │   ├── TitleScreen.tsx
│   │   ├── DeckSelectScreen.tsx
│   │   ├── EnemyTurnScreen.tsx
│   │   ├── BattlePrepareScreen.tsx (217行)
│   │   ├── BattleAttackScreen.tsx (201行)
│   │   ├── TurnResultScreen.tsx
│   │   ├── FinalResultScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── ui/                 # 再利用可能なUIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── modal.tsx
│       ├── tutorial-modal.tsx
│       └── remaining-deck-display.tsx
├── hooks/                  # カスタムフック（NEW）
│   ├── useBattleRhythm.ts  # リズムゲームロジック
│   ├── useCardSelection.ts # カード選択ロジック
│   └── useTutorialHints.ts # チュートリアルヒント
├── lib/
│   ├── stores/             # Zustand状態管理（ドメイン別）
│   │   ├── game.store.ts   # ゲーム状態
│   │   ├── tutorial.store.ts # チュートリアル
│   │   └── ui.store.ts     # UI設定
│   ├── store.ts            # ストア統合（12行）
│   ├── types.ts            # TypeScript型定義
│   ├── game-logic.ts       # ゲームロジック
│   ├── game-logic.test.ts  # テスト（11テスト）
│   ├── audio-config.ts     # 音声設定
│   ├── audio-manager.ts    # 音声マネージャー
│   ├── constants.ts        # ゲーム定数
│   └── ...data.ts          # 各種データファイル
├── public/audio/           # 音声ファイル
│   ├── bgm/                # BGM（ダミーWAV）
│   └── sfx/                # 効果音（ダミーWAV）
├── scripts/
│   └── generate-dummy-audio.js # ダミー音声生成
└── docs/                   # 詳細ドキュメント
    ├── TUTORIAL_SPECIFICATION.md
    ├── CODING_RULES.md
    ├── COMPLIANCE_REPORT.md
    └── CLAUDE.md
```

## 🚀 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. ダミー音声ファイルの生成
```bash
node scripts/generate-dummy-audio.js
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

### 4. ブラウザで開く
```
http://localhost:3000
```

## 🧪 テスト

### テスト実行
```bash
# watch mode
npm test

# 1回のみ
npm test -- --run

# UI付き
npm run test:ui

# カバレッジ計測
npm run test:coverage
```

### TDD（テスト駆動開発）の原則
このプロジェクトではt-wadaの手法に沿ったTDDを採用：

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

## ✨ 実装済み機能

### ゲームフロー
- ✅ タイトル画面
- ✅ チュートリアルシステム（2レベル）
- ✅ デッキ選択画面
- ✅ 2ターン制バトルシステム
- ✅ リズムゲーム（タイムライン、タップ判定、コンボ）
- ✅ スコアリング（リズム、ライミング、タイプ相性）
- ✅ 設定画面（音量調整）

### 状態管理
- Zustand によるドメイン別状態管理
  - game.store.ts: ゲーム状態、デッキ、ターン管理
  - tutorial.store.ts: チュートリアル状態
  - ui.store.ts: UI設定、エラー管理

### UI/UX
- レスポンシブデザイン
- ネオンエフェクト（シアン/マゼンタ）
- アニメーション
- タップエフェクト、コンボ表示

### 音楽・音声システム
- BPM120のビート音（Web Audio APIでプログラム生成）
- BGM切り替え（タイトル/バトル）
- タップ判定音（Perfect/Good/Bad/Miss）
- 音量調整（BGM/効果音を個別設定可能）

## 📊 アーキテクチャ改善実績

### コード品質向上
- ✅ **BattleAttackScreen.tsx**: 408行 → 201行（50%削減）
- ✅ **BattlePrepareScreen.tsx**: 354行 → 217行（39%削減）
- ✅ **store.ts**: 406行 → 12行（97%削減、3ドメインに分離）

### カスタムフック抽出
- `useBattleRhythm`: タイムライン、タップ判定、コンボ管理
- `useCardSelection`: カード選択、タイマー、リソースチェック
- `useTutorialHints`: チュートリアルヒント、推奨カード表示

## 📚 ドキュメント

- [ARCHITECTURE.md](./ARCHITECTURE.md) - システムアーキテクチャ詳細
- [SPECIFICATION.md](./SPECIFICATION.md) - ゲーム仕様
- [TASKS.md](./TASKS.md) - タスク管理
- [docs/](./docs/) - 詳細ドキュメント

## 🎯 今後の予定

詳細は [TASKS.md](./TASKS.md) を参照

- 定数の整理（constants/ディレクトリ作成）
- 型定義の分割（types/ディレクトリ作成）
- テストカバレッジ向上
- パフォーマンス最適化
- アクセシビリティ対応

## 📝 ライセンス

Private project
