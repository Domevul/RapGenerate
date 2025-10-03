import type { TypeCompatibility } from "./types";

// ゲーム設定
export const GAME_CONFIG = {
  MAX_TURNS: 2, // MVP版は2ターン(プレイヤーの攻撃ターン)
  MAX_DECK_SIZE: 20, // デッキに入れられる最大コロケーション数
  MIN_DECK_SIZE: 15, // デッキに入れられる最小コロケーション数
  TURN_COLLOCATIONS_COUNT: 4, // 1ターンで選択するコロケーション数
  PREPARE_PHASE_DURATION: 8000, // 準備フェーズの時間(ミリ秒)
  ATTACK_PHASE_DURATION: 8000, // 攻撃フェーズの時間(ミリ秒)
  ENEMY_TURN_DURATION: 8000, // 敵ターンの時間(ミリ秒)
} as const;

// スコア配分
export const SCORE_WEIGHTS = {
  RHYTHM: 0.25, // リズム評価の重み(25%)
  RHYMING: 0.45, // ライミング評価の重み(45%)
  TYPE: 0.3, // タイプ評価の重み(30%)
} as const;

// タップ判定のスコア
export const TAP_SCORES = {
  Perfect: 100,
  Good: 70,
  Bad: 30,
  Miss: 0,
} as const;

// ライミングチェーンの倍率
export const RHYMING_CHAIN_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
  4: 3.0,
  5: 4.0,
} as const;

// タイプ相性テーブル
export const TYPE_COMPATIBILITY_TABLE: TypeCompatibility[] = [
  { enemyType: "#攻撃", effectiveType: "#カウンター", multiplier: 1.5 },
  { enemyType: "#攻撃", effectiveType: "#夢中", multiplier: 1.3 },
  { enemyType: "#自慢", effectiveType: "#攻撃", multiplier: 1.3 },
  { enemyType: "#自慢", effectiveType: "#カウンター", multiplier: 1.2 },
  { enemyType: "#夢中", effectiveType: "#攻撃", multiplier: 1.2 },
  { enemyType: "#カウンター", effectiveType: "#自慢", multiplier: 1.3 },
];

// 勝利条件
export const WIN_CONDITION = {
  MIN_SCORE: 150, // 2ターン合計で150点以上で勝利(各ターン最大100点)
  MAX_SCORE_PER_TURN: 100,
} as const;

// タイプのヒント表示用テキスト
export const TYPE_MOOD_HINTS: Record<string, string> = {
  "#攻撃": "攻撃的",
  "#自慢": "自慢げ",
  "#夢中": "マイペース",
  "#カウンター": "反論的",
} as const;

// ライミンググループのヒント表示用テキスト
export const RHYMING_HINTS: Record<string, string> = {
  A: "A系(〜い、〜ない)",
  B: "B系(〜あ、〜だ)",
  C: "C系(〜ん、〜さ)",
  D: "D系(〜イフ、〜イス)",
} as const;
