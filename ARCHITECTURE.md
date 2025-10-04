# MC BATTLE - システムアーキテクチャ

## 📋 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [状態管理](#状態管理)
4. [データフロー](#データフロー)
5. [画面遷移フロー](#画面遷移フロー)
6. [コンポーネント設計](#コンポーネント設計)
7. [カスタムフック](#カスタムフック)
8. [改善履歴](#改善履歴)

## アーキテクチャ概要

### 設計原則

- **関心の分離**: ドメインロジック、UI、状態管理を明確に分離
- **単一責任の原則**: 各モジュールは1つの責任のみを持つ
- **DRY (Don't Repeat Yourself)**: カスタムフックによるロジック再利用
- **テスト駆動開発**: TDDによる品質保証

### 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **状態管理**: Zustand（ドメイン別スライス構成）
- **スタイリング**: Tailwind CSS
- **テスト**: Vitest + React Testing Library
- **音声**: Web Audio API

## ディレクトリ構造

```
rapbattle/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ（画面切り替え）
│   └── globals.css         # グローバルスタイル
│
├── components/
│   ├── screens/            # 画面コンポーネント
│   │   ├── TitleScreen.tsx           # タイトル画面
│   │   ├── DeckSelectScreen.tsx      # デッキ選択画面
│   │   ├── EnemyTurnScreen.tsx       # 敵ターン画面
│   │   ├── BattlePrepareScreen.tsx   # 準備フェーズ（217行）
│   │   ├── BattleAttackScreen.tsx    # 攻撃フェーズ（201行）
│   │   ├── TurnResultScreen.tsx      # ターン結果画面
│   │   ├── FinalResultScreen.tsx     # 最終結果画面
│   │   ├── SettingsScreen.tsx        # 設定画面
│   │   └── ErrorScreen.tsx           # エラー画面
│   │
│   └── ui/                 # 再利用可能なUIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── slider.tsx
│       ├── modal.tsx
│       ├── tutorial-modal.tsx
│       └── remaining-deck-display.tsx
│
├── hooks/                  # カスタムフック
│   ├── useBattleRhythm.ts  # リズムゲームロジック（260行）
│   ├── useCardSelection.ts # カード選択ロジック（114行）
│   └── useTutorialHints.ts # チュートリアルヒント（107行）
│
├── lib/
│   ├── stores/             # Zustand状態管理（ドメイン別）
│   │   ├── game.store.ts       # ゲーム状態（271行）
│   │   ├── tutorial.store.ts   # チュートリアル（94行）
│   │   └── ui.store.ts         # UI設定（48行）
│   │
│   ├── store.ts            # ストア統合（12行）
│   ├── types.ts            # TypeScript型定義
│   ├── game-logic.ts       # ゲームロジック
│   ├── game-logic.test.ts  # テスト（11テスト）
│   ├── audio-config.ts     # 音声設定
│   ├── audio-manager.ts    # 音声マネージャー
│   ├── constants.ts        # ゲーム定数
│   ├── collocations-data.ts # コロケーションデータ
│   ├── enemy-data.ts       # 敵キャラクターデータ
│   ├── enemy-raps.ts       # 敵ラップデータ
│   ├── fillers-data.ts     # フィラーデータ
│   └── tutorial-data.ts    # チュートリアルデータ
│
├── public/audio/           # 音声ファイル
│   ├── bgm/                # BGM（ダミーWAV）
│   │   ├── title.wav
│   │   └── battle.wav
│   └── sfx/                # 効果音（ダミーWAV）
│       ├── tap-perfect.wav
│       ├── tap-good.wav
│       ├── tap-bad.wav
│       └── ...
│
├── scripts/
│   └── generate-dummy-audio.js # ダミー音声生成
│
└── docs/                   # 詳細ドキュメント
    ├── TUTORIAL_SPECIFICATION.md
    ├── CODING_RULES.md
    ├── COMPLIANCE_REPORT.md
    └── CLAUDE.md
```

## 状態管理

### Zustand ドメイン別スライス構成

#### 1. Game Slice (`lib/stores/game.store.ts`)

**責務**: ゲーム状態、デッキ、ターン管理

```typescript
interface GameSlice {
  // State
  currentScreen: GameScreen;
  playerDeck: { collocations: Collocation[] };
  enemyCharacter: EnemyCharacter;
  currentTurn: number;
  remainingCollocations: RemainingCollocations;
  selectedTurnCollocations: SelectedTurnCollocations;
  turnResults: TurnResult[];
  totalScore: number;

  // Actions
  setScreen: (screen: GameScreen) => void;
  toggleCollocationInDeck: (collocation: Collocation) => void;
  startGame: () => void;
  generateEnemyTurn: () => void;
  proceedToPlayerPrepare: () => void;
  selectCollocationForSlot: (slot, collocation) => void;
  proceedToAttack: () => void;
  finishAttackPhase: (result: TurnResult) => void;
  proceedToNextTurn: () => void;
  resetGame: () => void;
}
```

#### 2. Tutorial Slice (`lib/stores/tutorial.store.ts`)

**責務**: チュートリアル状態管理

```typescript
interface TutorialSlice {
  tutorialState: TutorialState;
  setTutorialLevel: (level: TutorialLevel) => void;
  setTutorialStep: (step: TutorialStep | null) => void;
  completeTutorialLevel: (level: TutorialLevel) => void;
  skipTutorial: () => void;
  setTutorialActive: (active: boolean) => void;
}
```

#### 3. UI Slice (`lib/stores/ui.store.ts`)

**責務**: UI設定、エラー管理

```typescript
interface UISlice {
  uiSupport: UISupportSettings;
  errorType: "resource-depleted" | "unknown" | null;
  updateUISupportSettings: (settings: Partial<UISupportSettings>) => void;
  setError: (errorType) => void;
}
```

#### ストア統合 (`lib/store.ts`)

```typescript
export const useGameStore = create<GameStore>()((...a) => ({
  ...createGameSlice(...a),
  ...createTutorialSlice(...a),
  ...createUISlice(...a),
}));
```

## データフロー

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ useGameStore()
       ↓
┌─────────────┐
│   Zustand   │ ← 3つのスライスを統合
│    Store    │
└──────┬──────┘
       │
       ├─→ game.store.ts    (ゲーム状態)
       ├─→ tutorial.store.ts (チュートリアル)
       └─→ ui.store.ts       (UI設定)
```

### カスタムフックによるロジック分離

```
┌─────────────────────┐
│  BattleAttackScreen │
└──────────┬──────────┘
           │
           ├─→ useBattleRhythm()  (リズムゲームロジック)
           │   ├─ タイムライン生成
           │   ├─ タップ判定
           │   ├─ コンボ計算
           │   └─ エフェクト管理
           │
           └─→ useGameStore()      (状態管理)

┌─────────────────────┐
│ BattlePrepareScreen │
└──────────┬──────────┘
           │
           ├─→ useCardSelection()  (カード選択ロジック)
           │   ├─ タイマー
           │   ├─ スロット管理
           │   └─ リソースチェック
           │
           ├─→ useTutorialHints()  (チュートリアル)
           │   ├─ ヒントメッセージ
           │   └─ 推奨カード表示
           │
           └─→ useGameStore()      (状態管理)
```

## 画面遷移フロー

```
[タイトル] → [デッキ選択] → [敵ターン] → [準備フェーズ] → [攻撃フェーズ]
                                                                    ↓
                                              ┌─────────────────────┘
                                              ↓
                                        [ターン結果] → (ターン2へ or 最終結果)
                                                            ↓
                                                      [最終結果]
                                                            ↓
                                              (タイトルへ or もう一度)
```

### チュートリアルフロー

```
[タイトル] → チュートリアル開始
              ↓
         [レベル1: 基本操作]
              ↓ (クリア)
         [レベル2: 戦略選択]
              ↓ (クリア)
         [通常モード解放]
```

## コンポーネント設計

### 画面コンポーネント

#### BattleAttackScreen.tsx (201行)

**責務**: リズムゲーム画面のUI表示

**使用するフック**:
- `useBattleRhythm()` - ロジック処理
- `useGameStore()` - 状態管理

**分離されたロジック**:
- タイムライン生成 → useBattleRhythm
- タップ判定 → useBattleRhythm
- コンボ管理 → useBattleRhythm

#### BattlePrepareScreen.tsx (217行)

**責務**: カード選択画面のUI表示

**使用するフック**:
- `useCardSelection()` - カード選択ロジック
- `useTutorialHints()` - チュートリアルロジック
- `useGameStore()` - 状態管理

**分離されたロジック**:
- タイマー管理 → useCardSelection
- スロット管理 → useCardSelection
- チュートリアルヒント → useTutorialHints

## カスタムフック

### useBattleRhythm.ts (260行)

**責務**: リズムゲームのロジック処理

**機能**:
- タイムライン生成（コロケーション + フィラー）
- カウントダウン管理
- タイマー進行（requestAnimationFrame）
- タップ判定（Perfect/Good/Bad/Miss）
- コンボ計算
- タップエフェクト管理

**返り値**:
```typescript
{
  timeline, currentTime, isPlaying, tapResults,
  countDown, tapEffects, isFinished, activeItem,
  progress, totalDuration, combo, maxCombo,
  handleMainTap, handleFillerTap
}
```

### useCardSelection.ts (114行)

**責務**: カード選択のロジック処理

**機能**:
- タイマー管理（タイムリミット）
- リソース不足チェック
- スロット選択管理
- カード選択処理

**返り値**:
```typescript
{
  timeLeft, selectedSlot, setSelectedSlot, slots,
  handleSlotClick, handleCardClick,
  remainingCollocations, selectedTurnCollocations,
  canProceedToAttack, proceedToAttack
}
```

### useTutorialHints.ts (107行)

**責務**: チュートリアルヒントの管理

**機能**:
- チュートリアルメッセージ生成
- 推奨カード判定
- ヒント表示制御

**返り値**:
```typescript
{
  showTutorialHint, setShowTutorialHint,
  tutorialSlotStep, handleTutorialNext,
  recommendedCardIds, tutorialMessages, tutorialState
}
```

## 改善履歴

### アーキテクチャ改善（2025年10月4日）

#### コンポーネント分割

| ファイル | Before | After | 削減率 |
|---------|--------|-------|--------|
| BattleAttackScreen.tsx | 408行 | 201行 | 50% |
| BattlePrepareScreen.tsx | 354行 | 217行 | 39% |
| store.ts | 406行 | 12行 | 97% |

#### カスタムフック抽出

- `useBattleRhythm.ts` (260行) - リズムゲームロジック
- `useCardSelection.ts` (114行) - カード選択ロジック
- `useTutorialHints.ts` (107行) - チュートリアルロジック

#### ストア分割

- `game.store.ts` (271行) - ゲーム状態
- `tutorial.store.ts` (94行) - チュートリアル
- `ui.store.ts` (48行) - UI設定

### BGM実装（2025年10月4日）

- ダミーWAVファイル生成スクリプト作成
- タイトル/バトル画面でのBGM切り替え実装
- audioManagerによる音声管理

### テスト環境構築（2025年10月4日）

- Vitest + React Testing Library導入
- game-logic.test.ts作成（11テスト）
- TDD開発フロー確立

## まとめ

このアーキテクチャは以下の利点を提供します：

1. **保守性**: コンポーネントが小さく、責任が明確
2. **再利用性**: カスタムフックによるロジック共有
3. **テスタビリティ**: ロジックとUIの分離
4. **拡張性**: ドメイン別スライスによる柔軟な拡張
5. **可読性**: 各ファイルの行数が適切な範囲に収まっている
