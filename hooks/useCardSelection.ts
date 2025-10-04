import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { GAME_CONFIG } from "@/lib/constants";
import type { SelectedTurnCollocations, Collocation } from "@/lib/types";

export function useCardSelection() {
  const remainingCollocations = useGameStore(
    (state) => state.remainingCollocations
  );
  const selectedTurnCollocations = useGameStore(
    (state) => state.selectedTurnCollocations
  );
  const selectCollocationForSlot = useGameStore(
    (state) => state.selectCollocationForSlot
  );
  const clearSlot = useGameStore((state) => state.clearSlot);
  const canProceedToAttack = useGameStore((state) => state.canProceedToAttack);
  const proceedToAttack = useGameStore((state) => state.proceedToAttack);
  const tutorialState = useGameStore((state) => state.tutorialState);
  const setError = useGameStore((state) => state.setError);

  const [selectedSlot, setSelectedSlot] =
    useState<keyof SelectedTurnCollocations | null>(null);

  // チュートリアルモードの場合はレベルに応じた制限時間を適用
  const getTimeLimit = () => {
    if (tutorialState.isActive) {
      const restriction = tutorialState.restrictions[tutorialState.currentLevel];
      if (restriction.timeLimit) {
        return restriction.timeLimit / 1000; // ミリ秒→秒
      }
    }
    return GAME_CONFIG.PREPARE_PHASE_DURATION / 1000;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLimit());

  // リソース不足チェック
  useEffect(() => {
    if (remainingCollocations.all.length < GAME_CONFIG.TURN_COLLOCATIONS_COUNT) {
      console.error(
        `リソース不足: 残り${remainingCollocations.all.length}個（必要: ${GAME_CONFIG.TURN_COLLOCATIONS_COUNT}個）`
      );
      // エラー画面への遷移
      setError("resource-depleted");
    }
  }, [remainingCollocations, setError]);

  // タイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // タイムアップ時に自動遷移
          if (canProceedToAttack()) {
            proceedToAttack();
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots: (keyof SelectedTurnCollocations)[] = [
    "slot1",
    "slot2",
    "slot3",
    "slot4",
  ];

  // スロット選択
  const handleSlotClick = (slot: keyof SelectedTurnCollocations) => {
    if (selectedTurnCollocations[slot]) {
      // 既に選択されている場合はクリア
      clearSlot(slot);
      setSelectedSlot(null);
    } else {
      // 空の場合は選択状態に
      setSelectedSlot(slot);
    }
  };

  // カード選択
  const handleCardClick = (collocation: Collocation) => {
    if (selectedSlot) {
      selectCollocationForSlot(selectedSlot, collocation);
      // 次のスロットへ自動移動
      const currentIndex = slots.indexOf(selectedSlot);
      if (currentIndex < slots.length - 1) {
        const nextSlot = slots[currentIndex + 1];
        if (!selectedTurnCollocations[nextSlot]) {
          setSelectedSlot(nextSlot);
        } else {
          setSelectedSlot(null);
        }
      } else {
        setSelectedSlot(null);
      }
    }
  };

  return {
    timeLeft,
    selectedSlot,
    setSelectedSlot,
    slots,
    handleSlotClick,
    handleCardClick,
    remainingCollocations,
    selectedTurnCollocations,
    canProceedToAttack,
    proceedToAttack,
  };
}
