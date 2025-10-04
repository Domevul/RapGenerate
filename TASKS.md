# タスク管理

## 🎯 現在のフォーカス

### 🟠 アーキテクチャ改善（進行中）

#### コード品質・保守性
- [x] **大きすぎるコンポーネントの分割** ✅
  - BattleAttackScreen.tsx: 408行 → 201行（50%削減）
  - BattlePrepareScreen.tsx: 354行 → 217行（39%削減）
  - store.ts: 406行 → 12行（97%削減、3ドメインに分離）

- [x] **カスタムフックの整理** ✅
  - hooks/ディレクトリ作成
  - useBattleRhythm.ts（260行）
  - useCardSelection.ts（114行）
  - useTutorialHints.ts（107行）

- [ ] **定数の整理**
  - constants/ディレクトリを作成して分割
  - game.constants.ts, score.constants.ts, audio.constants.ts に分離

- [ ] **型定義の分割**
  - types/ディレクトリを作成
  - game.types.ts, tutorial.types.ts, audio.types.ts に分離

#### テストカバレッジ向上
- [x] テスト環境構築（Vitest + React Testing Library） ✅
- [x] game-logic.test.ts作成（11テスト） ✅
- [ ] storeのテスト作成
- [ ] コンポーネントのテスト作成
- [ ] エッジケースのテスト追加
- [ ] カバレッジ目標設定（70%以上）

#### パフォーマンス最適化
- [ ] useMemoの適切な使用（重い計算のメモ化）
- [ ] useCallbackの適切な使用（イベントハンドラー）
- [ ] React.memoの検討（頻繁な再レンダリング対策）

#### ドキュメント整備
- [x] README.md更新 ✅
- [x] ARCHITECTURE.md更新 ✅
- [x] docs/ディレクトリ作成 ✅
- [ ] JSDocコメントの追加
- [ ] アーキテクチャ図の作成

#### エラーハンドリング強化
- [ ] React Error Boundaryの追加
- [ ] ロギングシステムの導入

#### アクセシビリティ
- [ ] ARIA属性の追加
- [ ] キーボード操作対応
- [ ] フォーカス管理

---

## 🟡 次の優先タスク

### チュートリアルレベル3の実装
- [ ] レベル3の仕様確認
- [ ] デッキビルダーチュートリアルUI設計
- [ ] レベル3用の敵ラップデータ作成
- [ ] デッキ構築ガイドの実装
- [ ] タイムリミット（8秒）の実装
- [ ] レベル2→レベル3の遷移実装

### 詳細な結果表示画面の改善
- [ ] TurnResultScreenの評価内訳UI設計
- [ ] リズム評価の詳細表示
- [ ] ライミングチェーンの詳細表示
- [ ] タイプ相性の詳細表示
- [ ] スコア計算式の表示
- [ ] 改善ヒントの表示

---

## 🟢 フェーズ2（将来の拡張）

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

### セットアップ済み
- **Vitest** - 高速でモダンなテストフレームワーク
- **React Testing Library** - Reactコンポーネントのテスト
- **@testing-library/jest-dom** - カスタムマッチャー

### テストスクリプト
```bash
npm test              # watch mode
npm test -- --run     # 1回のみ
npm run test:ui       # UI付き
npm run test:coverage # カバレッジ計測
```

### 現在のテスト
- [x] `lib/game-logic.test.ts`（11テスト ✅）
  - リズムスコア計算
  - ライミングチェーン評価
  - タイプ相性評価
  - ターン結果統合
  - 残りカード管理

### テスト実行ルール
⚠️ **重要**: コード変更前に必ず `npm test -- --run` でテストを実行し、全テストが成功することを確認すること

---

## ✅ 完了済みタスク（アーカイブ）

<details>
<summary>完了したタスクを表示</summary>

### チュートリアルレベル2の実装 ✅
- [x] チュートリアルレベル2の仕様確認
- [x] レベル2用の敵ラップデータ作成（2ターン分）
- [x] レベル2用の推奨カード設定
- [x] BattlePrepareScreenのタイムリミット実装
- [x] レベル2用のチュートリアルヒントメッセージ作成
- [x] FinalResultScreenにレベル1→2遷移ロジック追加
- [x] DeckSelectScreenのレベル2対応
- [x] ビルド確認

### BGM音源ファイルの追加 ✅
- [x] BGMディレクトリ作成（public/audio/bgm）
- [x] ダミーBGMファイル生成（title.wav, battle.wav）
- [x] audio-config.ts設定（.wav形式）
- [x] TitleScreenでのBGM再生実装
- [x] EnemyTurnScreenでのBGM切り替え実装
- [x] FinalResultScreenでのBGM切り替え実装
- [x] scripts/generate-dummy-audio.js作成
- [x] ビルド確認（テスト11/11成功）

### 音楽・音声システムの基盤 ✅
- [x] audio-config.ts作成
- [x] audio-manager.ts作成（シングルトン）
- [x] Web Audio APIによるビート生成実装
- [x] プログラム生成効果音の実装
- [x] BattleAttackScreenへの音声統合
- [x] TitleScreenでのAudioContext初期化
- [x] SettingsScreenの音量設定連携

### リソース枯渇エラーUI ✅
- [x] ErrorScreenコンポーネント作成
- [x] エラータイプの型定義追加
- [x] storeにエラー管理機能追加
- [x] BattlePrepareScreenでのリソース不足検出
- [x] app/page.tsxへのルーティング追加
- [x] ビルド確認とテスト

### 敵ラップシステム ✅
- [x] enemy-raps.ts作成
- [x] 固定オリジナルラップデータ作成（ターン1, 2）
- [x] チュートリアル用敵ラップ作成
- [x] storeの敵ターン生成ロジック更新

### チュートリアルレベル1 ✅
- [x] チュートリアル状態管理の実装
- [x] TutorialModalコンポーネント作成
- [x] レベル1の推奨カード設定
- [x] BattlePrepareScreenのヒント表示
- [x] おすすめカードのハイライト表示
- [x] 1ターン制限の実装

### バグ修正 ✅
- [x] タイムライン長の修正（16拍→11拍）
- [x] フィラータップの重複バグ修正
- [x] タイマー自動遷移の実装
- [x] useEffectの依存配列修正

</details>

---

## 📝 メモ

- 音声ファイルは現在ダミーWAVで実装済み（将来的にMP3等に差し替え可能）
- チュートリアルは現在レベル1, 2が実装済み
- デッキサイズは15-20枚で固定
- 勝利条件は150点以上
- TDD開発フローを採用（t-wadaの手法）
