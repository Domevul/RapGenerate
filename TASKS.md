# タスク管理

## 🔴 優先度高 - 進行中

### チュートリアルレベル2の実装
- [x] チュートリアルレベル2の仕様確認
  - 戦略選択=戦略的判断を教える（ライミングチェーン、タイプ相性）
  - 2ターン制で複数ターンの流れを学ぶ
  - 準備時間10秒制限
- [x] レベル2用の敵ラップデータ作成（2ターン分）
  - TUTORIAL_LEVEL2_RAPS追加（ターン1: A系チェーン、ターン2: タイプ相性）
- [x] レベル2用の推奨カード設定（ターン1: ライミングチェーン重視、ターン2: タイプ相性重視）
  - TUTORIAL_LEVEL2_DECK追加
  - TUTORIAL_LEVEL2_RECOMMENDED追加（turn1/turn2別）
- [x] BattlePrepareScreenのタイムリミット実装（チュートリアルレベルに応じた時間制限）
  - getTimeLimit()関数でレベル別制限時間を取得
- [x] レベル2用のチュートリアルヒントメッセージ作成
  - getTutorialHintMessages()でレベル・ターン別メッセージ
- [x] FinalResultScreenにレベル1→2遷移ロジック追加
  - handleTutorialClear()でレベル進行管理
  - レベル1クリア→レベル2、レベル2クリア→通常モード
- [x] DeckSelectScreenのレベル2対応
  - レベル別プリセットデッキ読み込み
  - レベル別イントロメッセージ
- [x] ビルド確認（✅ 成功）

### BGM音源ファイルの追加
- [x] BGMファイルの配置先ディレクトリ作成（public/audio/bgm）
- [x] タイトル画面BGMのダミーファイル作成
- [x] バトル画面BGMのダミーファイル作成
- [x] audio-config.tsの設定確認（.wav形式に更新）
- [x] TitleScreenでのBGM再生実装
- [x] EnemyTurnScreenでのBGM切り替え実装
- [x] FinalResultScreenでのBGM切り替え実装
- [x] scripts/generate-dummy-audio.js作成（WAV生成スクリプト）
- [x] ビルド確認（✅ テスト11/11成功）

---

## 🟠 アーキテクチャ改善タスク

### コード品質・保守性
- [x] **大きすぎるコンポーネントの分割**
  - [x] BattleAttackScreen.tsx (408行 → 201行) → useBattleRhythm.tsに分離
  - [x] BattlePrepareScreen.tsx (354行 → 217行) → useCardSelection.ts, useTutorialHints.tsに分離
  - [x] store.ts (406行 → 12行) → lib/stores/に分割（game.store.ts, tutorial.store.ts, ui.store.ts）
- [x] **カスタムフックの整理**
  - [x] hooks/ディレクトリを作成
  - [x] useBattleRhythm.ts作成（タイムライン、タップ判定、コンボ管理）
  - [x] useCardSelection.ts作成（カード選択、タイマー、リソースチェック）
  - [x] useTutorialHints.ts作成（チュートリアルヒント、推奨カード表示）
- [ ] **定数の整理**
  - constants/ディレクトリを作成して分割
  - game.constants.ts, score.constants.ts, audio.constants.ts に分離
- [ ] **型定義の分割**
  - types/ディレクトリを作成
  - game.types.ts, tutorial.types.ts, audio.types.ts に分離

### テストカバレッジ向上
- [ ] **storeのテスト作成**
  - デッキ選択ロジックのテスト
  - ゲーム進行ロジックのテスト
  - チュートリアル状態管理のテスト
- [ ] **コンポーネントのテスト作成**
  - 画面遷移のテスト
  - ユーザー操作のテスト
- [ ] **エッジケースのテスト追加**
  - 境界値テスト
  - エラーハンドリングのテスト
- [ ] **カバレッジ目標設定**
  - 最低70%のカバレッジを目標

### パフォーマンス最適化
- [ ] **useMemoの適切な使用**
  - 重い計算のメモ化
  - カードアノテーション計算の最適化
- [ ] **useCallbackの適切な使用**
  - イベントハンドラーのメモ化
- [ ] **React.memoの検討**
  - 頻繁に再レンダリングされるコンポーネントの最適化

### ドキュメント整備
- [ ] **JSDocコメントの追加**
  - 主要な関数にドキュメントコメント
  - 複雑なロジックの説明
- [ ] **アーキテクチャ図の作成**
  - コンポーネント構成図
  - データフロー図
  - 状態管理図
- [ ] **READMEのプロジェクト構造更新**
  - 最新のディレクトリ構造を反映

### エラーハンドリング強化
- [ ] **エラーバウンダリの実装**
  - React Error Boundaryの追加
  - エラー画面の改善
- [ ] **ロギングシステムの導入**
  - デバッグ用のログ出力
  - エラートラッキング

### アクセシビリティ
- [ ] **ARIA属性の追加**
  - スクリーンリーダー対応
- [ ] **キーボード操作対応**
  - Tab, Enter, Escapeキーのサポート
- [ ] **フォーカス管理**
  - モーダルのフォーカストラップ

---

## 🟡 優先度中 - 未着手

### チュートリアルレベル3の実装
- [ ] レベル3の仕様確認
- [ ] デッキビルダーチュートリアルUI設計
- [ ] レベル3用の敵ラップデータ作成
- [ ] デッキ構築ガイドの実装
- [ ] タイムリミット（8秒）の実装
- [ ] レベル2→レベル3の遷移実装
- [ ] レベル3完了後の処理（通常モード解放）

### 詳細な結果表示画面の改善
- [ ] TurnResultScreenの評価内訳UI設計
- [ ] リズム評価の詳細表示
- [ ] ライミングチェーンの詳細表示
- [ ] タイプ相性の詳細表示
- [ ] スコア計算式の表示
- [ ] 改善ヒントの表示

---

## 🟢 優先度低 - フェーズ2

### 複数敵キャラクターの実装
- [ ] 敵キャラクター2体目のデータ作成
- [ ] 敵キャラクター3体目のデータ作成
- [ ] 敵選択画面の実装
- [ ] 敵ごとの専用ラップデータ作成
- [ ] 敵ごとの難易度調整

### 音声合成システム
- [ ] TTS（Text-to-Speech）ライブラリ調査
- [ ] コロケーション読み上げ機能の実装
- [ ] 音声の速度・ピッチ調整
- [ ] キャラクターボイスの設定

---

## 🧪 テスト環境

### テストフレームワーク
- **Vitest** - 高速でモダンなテストフレームワーク
- **React Testing Library** - Reactコンポーネントのテスト
- **@testing-library/jest-dom** - カスタムマッチャー

### テストスクリプト
- `npm test` - テスト実行（watch mode）
- `npm test -- --run` - テスト実行（1回のみ）
- `npm run test:ui` - UI付きテスト実行
- `npm run test:coverage` - カバレッジ計測

### テストファイル
- [x] `lib/game-logic.test.ts` - ゲームロジックのユニットテスト（11テスト ✅）
  - calculateRhythmEvaluation: リズムスコア計算
  - calculateRhymingChainEvaluation: ライミングチェーン評価
  - calculateTypeCompatibilityEvaluation: タイプ相性評価
  - calculateTurnResult: ターン結果統合
  - initializeRemainingCollocations: 残りカード初期化
  - updateRemainingCollocations: 残りカード更新

### テスト実行ルール
⚠️ **重要**: コード変更前に必ず `npm test -- --run` でテストを実行し、全テストが成功することを確認すること

---

## ✅ 完了済み

### 音楽・音声システムの基盤
- [x] audio-config.tsの作成
- [x] audio-manager.tsの作成（シングルトン）
- [x] Web Audio APIによるビート生成実装
- [x] プログラム生成効果音の実装
- [x] BattleAttackScreenへの音声統合
- [x] TitleScreenでのAudioContext初期化
- [x] SettingsScreenの音量設定連携

### リソース枯渇エラーUI
- [x] ErrorScreenコンポーネント作成
- [x] エラータイプの型定義追加
- [x] storeにエラー管理機能追加
- [x] BattlePrepareScreenでのリソース不足検出
- [x] app/page.tsxへのルーティング追加
- [x] ビルド確認とテスト

### 敵ラップシステム
- [x] enemy-raps.tsの作成
- [x] 固定オリジナルラップデータ作成（ターン1, 2）
- [x] チュートリアル用敵ラップ作成
- [x] storeの敵ターン生成ロジック更新

### チュートリアルレベル1
- [x] チュートリアル状態管理の実装
- [x] TutorialModalコンポーネント作成
- [x] レベル1の推奨カード設定
- [x] BattlePrepareScreenのヒント表示
- [x] おすすめカードのハイライト表示
- [x] 1ターン制限の実装

### バグ修正
- [x] タイムライン長の修正（16拍→11拍）
- [x] フィラータップの重複バグ修正
- [x] タイマー自動遷移の実装
- [x] useEffectの依存配列修正

---

## 📝 メモ
- 音声ファイルは現在プログラム生成のフォールバック機能で動作中
- チュートリアルは現在レベル1のみ実装済み
- デッキサイズは15-20枚で固定
- 勝利条件は150点以上
