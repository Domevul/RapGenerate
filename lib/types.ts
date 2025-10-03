// ゲーム画面の種類
export type GameScreen =
  | "title"
  | "deck-select"
  | "enemy-turn"
  | "battle-prepare"
  | "battle-attack"
  | "turn-result"
  | "final-result";

// コロケーションのタイプ
export type CollocationType = "#攻撃" | "#自慢" | "#夢中" | "#カウンター";

// ライミンググループ
export type RhymingGroup = "A" | "B" | "C" | "D";

// タップ判定
export type TapJudgement = "Perfect" | "Good" | "Bad" | "Miss";

// コロケーション
export interface Collocation {
  id: string;
  text: string;
  type: CollocationType;
  rhyming: RhymingGroup;
}

// フィラー(アドリブワード)
export interface Filler {
  id: string;
  text: string;
}

// デッキ(プレイヤーが選択したコロケーション)
export interface Deck {
  collocations: Collocation[];
}

// ターン中に選択したコロケーション(4つ)
export interface SelectedTurnCollocations {
  slot1: Collocation | null;
  slot2: Collocation | null;
  slot3: Collocation | null;
  slot4: Collocation | null;
}

// フィラーのタップ結果
export interface FillerTapResult {
  filler: Filler;
  judgement: TapJudgement;
  timestamp: number;
}

// ライミングチェーンの評価
export interface RhymingChainEvaluation {
  chainCount: number;
  multiplier: number;
  score: number;
}

// タイプ相性の評価
export interface TypeCompatibilityEvaluation {
  isCompatible: boolean;
  multiplier: number;
  score: number;
}

// リズム評価
export interface RhythmEvaluation {
  perfectCount: number;
  goodCount: number;
  badCount: number;
  missCount: number;
  score: number;
}

// ターン結果
export interface TurnResult {
  rhythmEvaluation: RhythmEvaluation;
  rhymingEvaluation: RhymingChainEvaluation;
  typeEvaluation: TypeCompatibilityEvaluation;
  totalScore: number;
}

// 敵キャラクター
export interface EnemyCharacter {
  id: string;
  name: string;
  description: string;
  deck: Deck;
}

// 敵のターン情報
export interface EnemyTurnInfo {
  collocation: Collocation;
  hintMood: string; // 雰囲気のヒント (例: "攻撃的")
  hintRhyming: string; // 韻のヒント (例: "A系(〜い、〜ない)")
}

// プレイヤーの残りコロケーション(リソース管理用)
export interface RemainingCollocations {
  all: Collocation[];
  byRhyming: {
    A: Collocation[];
    B: Collocation[];
    C: Collocation[];
    D: Collocation[];
  };
}

// ゲーム状態
export interface GameState {
  // 画面管理
  currentScreen: GameScreen;

  // デッキ
  playerDeck: Deck;
  enemyCharacter: EnemyCharacter;

  // バトル状態
  currentTurn: number;
  maxTurns: number;
  remainingCollocations: RemainingCollocations;

  // ターン内の状態
  selectedTurnCollocations: SelectedTurnCollocations;
  fillerTapResults: FillerTapResult[];

  // 敵ターン情報
  currentEnemyTurnInfo: EnemyTurnInfo | null;

  // 結果
  turnResults: TurnResult[];
  totalScore: number;

  // ゲームフラグ
  isGameStarted: boolean;
  isGameFinished: boolean;
}

// タイプ相性テーブルのエントリー
export interface TypeCompatibility {
  enemyType: CollocationType;
  effectiveType: CollocationType;
  multiplier: number;
}
