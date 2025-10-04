import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store";
import {
  TUTORIAL_LEVEL1_RECOMMENDED,
  TUTORIAL_LEVEL2_RECOMMENDED,
} from "@/lib/tutorial-data";
import type { SelectedTurnCollocations } from "@/lib/types";

export function useTutorialHints(selectedSlot: keyof SelectedTurnCollocations | null) {
  const tutorialState = useGameStore((state) => state.tutorialState);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const setTutorialStep = useGameStore((state) => state.setTutorialStep);

  const [showTutorialHint, setShowTutorialHint] = useState(false);
  const [tutorialSlotStep, setTutorialSlotStep] = useState<number>(0);

  // チュートリアルモード: 最初のヒント表示
  useEffect(() => {
    if (
      tutorialState.isActive &&
      tutorialState.currentLevel === 1 &&
      !showTutorialHint
    ) {
      setShowTutorialHint(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // チュートリアルメッセージ取得
  const getTutorialHintMessages = () => {
    if (!tutorialState.isActive) return [];

    const level = tutorialState.currentLevel;

    if (level === 1) {
      return [
        "まずはカードを4枚選んでみよう！\n上のスロットをタップして、好きなカードを選択しよう。",
        "いいね！次のカードも選ぼう。\n💡韻を揃えるとボーナスがもらえるよ",
        "あと2枚！カードの色（韻グループ）に注目してみよう。",
        "最後の1枚！全部揃ったら「ラップする」ボタンを押そう。",
      ];
    } else if (level === 2) {
      const turn = currentTurn;
      if (turn === 1) {
        return [
          "レベル2では戦略が重要だ！\n今回は韻のチェーンを狙ってみよう。",
          "💡ヒント: 同じ色（韻グループ）のカードを連続で使うと、チェーンボーナスがもらえるよ！",
          "相手のタイプも確認しよう。タイプ相性も大事だよ。",
          "準備できたら「ラップする」ボタンを押そう！",
        ];
      } else {
        return [
          "ターン2！今度はタイプ相性を意識してみよう。",
          "💡相手のタイプに対して有利なタイプを選ぶと、ボーナスがもらえるよ！",
          "残りカードも考慮して、次のターンも見据えて選ぼう。",
          "準備できたら「ラップする」ボタンを押そう！",
        ];
      }
    }

    return [];
  };

  const handleTutorialNext = () => {
    const messages = getTutorialHintMessages();
    if (tutorialSlotStep < messages.length - 1) {
      setTutorialSlotStep(tutorialSlotStep + 1);
    } else {
      setShowTutorialHint(false);
      setTutorialSlotStep(0);
    }
  };

  // チュートリアルレベル別の推奨カード
  const getRecommendedCardIds = (): string[] => {
    if (!tutorialState.isActive) return [];

    const level = tutorialState.currentLevel;
    const turn = currentTurn;

    if (level === 1) {
      return Object.values(TUTORIAL_LEVEL1_RECOMMENDED);
    } else if (level === 2) {
      if (turn === 1) {
        return Object.values(TUTORIAL_LEVEL2_RECOMMENDED.turn1);
      } else {
        return Object.values(TUTORIAL_LEVEL2_RECOMMENDED.turn2);
      }
    }

    return [];
  };

  const recommendedCardIds = getRecommendedCardIds();
  const tutorialMessages = getTutorialHintMessages();

  return {
    showTutorialHint,
    setShowTutorialHint,
    tutorialSlotStep,
    handleTutorialNext,
    recommendedCardIds,
    tutorialMessages,
    tutorialState,
  };
}
