import type {
  Collocation,
  CollocationType,
  FillerTapResult,
  RhymingChainEvaluation,
  TypeCompatibilityEvaluation,
  RhythmEvaluation,
  TurnResult,
  RemainingCollocations,
  EnemyTurnInfo,
} from "./types";
import {
  RHYMING_CHAIN_MULTIPLIERS,
  TYPE_COMPATIBILITY_TABLE,
  TAP_SCORES,
  SCORE_WEIGHTS,
  TYPE_MOOD_HINTS,
  RHYMING_HINTS,
} from "./constants";

// ライミングチェーンの評価を計算
export function calculateRhymingChainEvaluation(
  collocations: (Collocation | null)[]
): RhymingChainEvaluation {
  const validCollocations = collocations.filter(
    (c): c is Collocation => c !== null
  );

  if (validCollocations.length === 0) {
    return { chainCount: 0, multiplier: 1.0, score: 0 };
  }

  // ライミンググループごとのカウント
  const rhymingCounts: Record<string, number> = {};

  for (const collocation of validCollocations) {
    const rhyming = collocation.rhyming;
    rhymingCounts[rhyming] = (rhymingCounts[rhyming] || 0) + 1;
  }

  // 最大チェーン数を取得
  const maxChainCount = Math.max(...Object.values(rhymingCounts));
  const multiplier = RHYMING_CHAIN_MULTIPLIERS[maxChainCount] || 1.0;

  // スコア計算(基礎点100 × 倍率)
  const baseScore = 100;
  const score = baseScore * multiplier;

  return {
    chainCount: maxChainCount,
    multiplier,
    score,
  };
}

// タイプ相性の評価を計算
export function calculateTypeCompatibilityEvaluation(
  playerCollocations: (Collocation | null)[],
  enemyType: CollocationType
): TypeCompatibilityEvaluation {
  const validCollocations = playerCollocations.filter(
    (c): c is Collocation => c !== null
  );

  if (validCollocations.length === 0) {
    return { isCompatible: false, multiplier: 1.0, score: 0 };
  }

  // プレイヤーのコロケーションタイプを集計
  const typeCounts: Record<string, number> = {};

  for (const collocation of validCollocations) {
    const type = collocation.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  // 最も多く使われたタイプを取得
  const mostUsedType = Object.entries(typeCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0] as CollocationType;

  // タイプ相性テーブルから倍率を取得
  const compatibility = TYPE_COMPATIBILITY_TABLE.find(
    (c) => c.enemyType === enemyType && c.effectiveType === mostUsedType
  );

  const multiplier = compatibility?.multiplier || 1.0;
  const isCompatible = !!compatibility;

  // スコア計算(基礎点100 × 倍率)
  const baseScore = 100;
  const score = baseScore * multiplier;

  return {
    isCompatible,
    multiplier,
    score,
  };
}

// リズム評価を計算
export function calculateRhythmEvaluation(
  fillerTapResults: FillerTapResult[]
): RhythmEvaluation {
  let perfectCount = 0;
  let goodCount = 0;
  let badCount = 0;
  let missCount = 0;

  for (const result of fillerTapResults) {
    switch (result.judgement) {
      case "Perfect":
        perfectCount++;
        break;
      case "Good":
        goodCount++;
        break;
      case "Bad":
        badCount++;
        break;
      case "Miss":
        missCount++;
        break;
    }
  }

  // スコア計算
  const totalScore =
    perfectCount * TAP_SCORES.Perfect +
    goodCount * TAP_SCORES.Good +
    badCount * TAP_SCORES.Bad +
    missCount * TAP_SCORES.Miss;

  const maxScore = fillerTapResults.length * TAP_SCORES.Perfect;
  const score = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  return {
    perfectCount,
    goodCount,
    badCount,
    missCount,
    score,
  };
}

// ターン結果を計算
export function calculateTurnResult(
  playerCollocations: (Collocation | null)[],
  enemyType: CollocationType,
  fillerTapResults: FillerTapResult[]
): TurnResult {
  const rhythmEvaluation = calculateRhythmEvaluation(fillerTapResults);
  const rhymingEvaluation = calculateRhymingChainEvaluation(playerCollocations);
  const typeEvaluation = calculateTypeCompatibilityEvaluation(
    playerCollocations,
    enemyType
  );

  // 総合スコア計算(重み付け平均)
  const totalScore =
    rhythmEvaluation.score * SCORE_WEIGHTS.RHYTHM +
    rhymingEvaluation.score * SCORE_WEIGHTS.RHYMING +
    typeEvaluation.score * SCORE_WEIGHTS.TYPE;

  return {
    rhythmEvaluation,
    rhymingEvaluation,
    typeEvaluation,
    totalScore: Math.round(totalScore),
  };
}

// 残りコロケーションを更新
export function updateRemainingCollocations(
  remaining: RemainingCollocations,
  usedCollocations: (Collocation | null)[]
): RemainingCollocations {
  const validUsed = usedCollocations.filter(
    (c): c is Collocation => c !== null
  );

  const usedIds = new Set(validUsed.map((c) => c.id));

  const newAll = remaining.all.filter((c) => !usedIds.has(c.id));

  return {
    all: newAll,
    byRhyming: {
      A: newAll.filter((c) => c.rhyming === "A"),
      B: newAll.filter((c) => c.rhyming === "B"),
      C: newAll.filter((c) => c.rhyming === "C"),
      D: newAll.filter((c) => c.rhyming === "D"),
    },
  };
}

// 敵のターン情報を生成
export function generateEnemyTurnInfo(
  enemyCollocation: Collocation
): EnemyTurnInfo {
  const hintMood = TYPE_MOOD_HINTS[enemyCollocation.type] || "不明";
  const hintRhyming = RHYMING_HINTS[enemyCollocation.rhyming] || "不明";

  return {
    collocation: enemyCollocation,
    hintMood,
    hintRhyming,
  };
}

// デッキからランダムにコロケーションを選択(敵用)
export function getRandomCollocationFromDeck(
  collocations: Collocation[]
): Collocation {
  const randomIndex = Math.floor(Math.random() * collocations.length);
  return collocations[randomIndex];
}

// デッキから残りコロケーションを初期化
export function initializeRemainingCollocations(
  deck: Collocation[]
): RemainingCollocations {
  return {
    all: [...deck],
    byRhyming: {
      A: deck.filter((c) => c.rhyming === "A"),
      B: deck.filter((c) => c.rhyming === "B"),
      C: deck.filter((c) => c.rhyming === "C"),
      D: deck.filter((c) => c.rhyming === "D"),
    },
  };
}
