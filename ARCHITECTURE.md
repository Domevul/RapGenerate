# アーキテクチャドキュメント

## プロジェクト構造

```
rapbattle/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト（フォント設定）
│   ├── page.tsx                 # メインページ（画面ルーティング）
│   └── globals.css              # グローバルスタイル
│
├── components/
│   ├── screens/                 # 画面コンポーネント (408行, 354行など大きい)
│   │   ├── TitleScreen.tsx             # タイトル画面
│   │   ├── DeckSelectScreen.tsx        # デッキ選択画面
│   │   ├── EnemyTurnScreen.tsx         # 敵ターン画面
│   │   ├── BattlePrepareScreen.tsx     # 準備フェーズ (354行) ⚠️
│   │   ├── BattleAttackScreen.tsx      # 攻撃フェーズ (408行) ⚠️
│   │   ├── TurnResultScreen.tsx        # ターン結果画面
│   │   ├── FinalResultScreen.tsx       # 最終結果画面
│   │   ├── SettingsScreen.tsx          # 設定画面 (255行)
│   │   └── ErrorScreen.tsx             # エラー画面
│   │
│   └── ui/                      # 再利用可能なUIコンポーネント
│       ├── button.tsx                  # ボタン（Shadcn UI）
│       ├── card.tsx                    # カード（Shadcn UI）
│       ├── slider.tsx                  # スライダー（Shadcn UI）
│       ├── modal.tsx                   # モーダル
│       ├── tutorial-modal.tsx          # チュートリアルモーダル
│       ├── highlight.tsx               # ハイライトコンポーネント
│       └── remaining-deck-display.tsx  # 残りデッキ表示 (139行)
│
├── lib/                         # ビジネスロジック・ユーティリティ
│   ├── store.ts                 # Zustand状態管理 (406行) ⚠️
│   ├── types.ts                 # TypeScript型定義 (216行) ⚠️
│   ├── constants.ts             # ゲーム定数
│   ├── game-logic.ts            # ゲームロジック (298行)
│   ├── game-logic.test.ts       # ゲームロジックのテスト (201行) ✅
│   │
│   ├── audio-config.ts          # 音声設定
│   ├── audio-manager.ts         # 音声マネージャー (248行)
│   │
│   ├── collocations-data.ts     # コロケーションデータ
│   ├── fillers-data.ts          # フィラーデータ
│   ├── enemy-data.ts            # 敵キャラクターデータ
│   ├── enemy-raps.ts            # 敵ラップデータ
│   ├── tutorial-data.ts         # チュートリアルデータ
│   │
│   └── utils.ts                 # ユーティリティ関数
│
├── public/                      # 静的ファイル
│   └── audio/                   # 音声ファイル（未配置）
│       ├── bgm/
│       └── sfx/
│
├── vitest.config.ts             # Vitestテスト設定
├── vitest.setup.ts              # テストセットアップ
├── tailwind.config.ts           # Tailwind CSS設定
└── tsconfig.json                # TypeScript設定
```

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router) - Reactフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Shadcn UI** - UIコンポーネントライブラリ

### 状態管理
- **Zustand** - グローバル状態管理（シンプルで軽量）

### テスト
- **Vitest** - 高速テストフレームワーク
- **React Testing Library** - コンポーネントテスト
- **@vitest/coverage-v8** - カバレッジ計測

### 音声
- **Web Audio API** - ビート・効果音の生成

## データフロー

```
┌─────────────────────────────────────────────────────────┐
│                    Zustand Store (store.ts)              │
│  - currentScreen (画面状態)                              │
│  - playerDeck (プレイヤーデッキ)                          │
│  - enemyCharacter (敵キャラクター)                        │
│  - currentTurn (現在のターン)                            │
│  - remainingCollocations (残りカード)                     │
│  - selectedTurnCollocations (選択カード)                  │
│  - tutorialState (チュートリアル状態)                     │
│  - uiSupport (UI支援設定)                                │
└─────────────────────────────────────────────────────────┘
                             │
                             │ useGameStore()
                             ↓
┌─────────────────────────────────────────────────────────┐
│                    Screen Components                     │
│  - TitleScreen → DeckSelectScreen → EnemyTurnScreen     │
│  → BattlePrepareScreen → BattleAttackScreen →           │
│  TurnResultScreen → FinalResultScreen                   │
└─────────────────────────────────────────────────────────┘
                             │
                             │ 呼び出し
                             ↓
┌─────────────────────────────────────────────────────────┐
│                   Game Logic (lib/)                      │
│  - calculateRhythmEvaluation()                           │
│  - calculateRhymingChainEvaluation()                     │
│  - calculateTypeCompatibilityEvaluation()                │
│  - calculateTurnResult()                                 │
│  - updateRemainingCollocations()                         │
└─────────────────────────────────────────────────────────┘
```

## 画面遷移フロー

```
[タイトル画面]
     │
     ↓ チュートリアル開始 / 通常プレイ開始
     │
[デッキ選択画面]
     │
     ↓ ゲーム開始
     │
[敵ターン画面] ← ┐
     │           │
     ↓           │
[準備フェーズ]    │
     │           │
     ↓           │
[攻撃フェーズ]    │
     │           │
     ↓           │
[ターン結果]      │
     │           │
     ├───────────┘ 次のターンへ
     │
     ↓ 全ターン終了
     │
[最終結果画面]
     │
     └→ タイトルへ / もう一度
```

## 主要な課題

### 1. コンポーネントサイズ ⚠️
- **BattleAttackScreen.tsx**: 408行 → カスタムフックに分離すべき
- **BattlePrepareScreen.tsx**: 354行 → カスタムフックに分離すべき
- **store.ts**: 406行 → ドメイン別に分割すべき

### 2. テストカバレッジ
- ゲームロジック: ✅ 11テスト実装済み
- store: ❌ テストなし
- コンポーネント: ❌ テストなし

### 3. 型定義の肥大化
- **types.ts**: 216行 → ドメイン別に分割すべき

### 4. パフォーマンス最適化
- useMemo/useCallbackの使用が不十分
- 不要な再レンダリングの可能性

## 改善提案

### 短期（優先度高）
1. **カスタムフックの抽出**
   - `hooks/useGameTimer.ts`
   - `hooks/useTutorial.ts`
   - `hooks/useCardSelection.ts`

2. **storeの分割**
   - `stores/gameStore.ts`
   - `stores/tutorialStore.ts`
   - `stores/uiStore.ts`

3. **テストの追加**
   - storeのユニットテスト
   - コンポーネントの統合テスト

### 中期（優先度中）
4. **型定義の整理**
   - `types/game.types.ts`
   - `types/tutorial.types.ts`
   - `types/audio.types.ts`

5. **パフォーマンス最適化**
   - React.memo, useMemo, useCallbackの適用
   - 再レンダリングの最適化

### 長期（優先度低）
6. **アクセシビリティ対応**
   - ARIA属性の追加
   - キーボード操作対応

7. **エラーハンドリング強化**
   - React Error Boundary
   - ロギングシステム

## TDD原則

コード変更前に必ず以下を実行：

```bash
npm test -- --run
```

全テストが成功することを確認してから変更を行うこと。
