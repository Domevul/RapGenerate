"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorialModal } from "@/components/ui/tutorial-modal";
import { useGameStore } from "@/lib/store";
import { GAME_CONFIG } from "@/lib/constants";
import { TUTORIAL_LEVEL1_RECOMMENDED, TUTORIAL_LEVEL2_RECOMMENDED } from "@/lib/tutorial-data";
import { cn } from "@/lib/utils";
import { RemainingDeckDisplay } from "@/components/ui/remaining-deck-display";
import { calculateCardAnnotations } from "@/lib/game-logic";
import type { SelectedTurnCollocations, RhymingGroup } from "@/lib/types";

export function BattlePrepareScreen() {
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
  const currentTurn = useGameStore((state) => state.currentTurn);
  const currentEnemyTurnInfo = useGameStore(
    (state) => state.currentEnemyTurnInfo
  );
  const uiSupport = useGameStore((state) => state.uiSupport);
  const tutorialState = useGameStore((state) => state.tutorialState);
  const setError = useGameStore((state) => state.setError);

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
  const [selectedSlot, setSelectedSlot] =
    useState<keyof SelectedTurnCollocations | null>(null);
  const [showTutorialHint, setShowTutorialHint] = useState(false);
  const [tutorialSlotStep, setTutorialSlotStep] = useState<number>(0);

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

  // チュートリアルモード: 最初のヒント表示
  useEffect(() => {
    if (
      tutorialState.isActive &&
      tutorialState.currentLevel === 1 &&
      !showTutorialHint
    ) {
      setShowTutorialHint(true);
      setSelectedSlot("slot1"); // 最初のスロットを自動選択
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialState.isActive, tutorialState.currentLevel]);

  // チュートリアルヒントメッセージ（レベルごとに異なる）
  const getTutorialHintMessages = () => {
    if (tutorialState.currentLevel === 1) {
      return [
        "💡 まず最初の掴みを選ぼう\n\n光っているカードがおすすめだよ!",
        "💡 次は相手への返しを選ぼう\n\n同じ韻（B系）を選ぶとチェーンになるよ!",
        "💡 もう一押し!\n\n韻を続けてボーナスを狙おう!",
        "💡 最後に締めよう\n\nこれで4枚選択完了だ!",
      ];
    } else if (tutorialState.currentLevel === 2) {
      if (currentTurn === 1) {
        return [
          "💡 掴みから始めよう\n\n今回は韻のチェーンを狙うよ!",
          "💡 A系の韻を選ぼう\n\n「〜い」で終わるカードだ!",
          "💡 チェーンを続けよう!\n\n同じA系でボーナス倍率アップ!",
          "💡 締めのカードを選ぼう\n\nチェーンボーナスで高得点だ!",
        ];
      } else {
        return [
          "💡 2ターン目！掴みから\n\n今度はタイプ相性を考えよう!",
          "💡 相手は#自慢タイプ\n\n#カウンターで効果的に返そう!",
          "💡 カウンター系を続けよう\n\nタイプ相性で高得点!",
          "💡 締めて勝利を掴め!\n\n戦略的な選択が鍵だ!",
        ];
      }
    }
    return [];
  };

  const tutorialHintMessages = getTutorialHintMessages();

  const handleTutorialCardSelect = (slotIndex: number) => {
    if (slotIndex < 3) {
      // 次のスロットへ
      setTutorialSlotStep(slotIndex + 1);
      setSelectedSlot(slots[slotIndex + 1]);
      setShowTutorialHint(true);
    } else {
      // 全スロット選択完了
      setShowTutorialHint(false);
    }
  };

  // チュートリアルモード: カード選択時の処理
  const handleCollocationSelect = (
    slot: keyof SelectedTurnCollocations,
    collocation: any
  ) => {
    selectCollocationForSlot(slot, collocation);

    if (tutorialState.isActive && tutorialState.currentLevel === 1) {
      const slotIndex = slots.indexOf(slot);
      handleTutorialCardSelect(slotIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card className="bg-black/80 border-cyan-500 border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-cyan-400">
                準備フェーズ - ターン {currentTurn}
              </CardTitle>
              <div className="text-3xl font-bold text-magenta-400">
                {timeLeft}秒
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          {slots.map((slot, index) => {
            const collocation = selectedTurnCollocations[slot];
            return (
              <Card
                key={slot}
                className={cn(
                  "cursor-pointer",
                  selectedSlot === slot
                    ? "bg-cyan-900/50 border-cyan-400 border-2"
                    : "bg-black/80 border-gray-600",
                  collocation && "border-magenta-400"
                )}
                onClick={() => setSelectedSlot(slot)}
              >
                <CardContent className="p-4 min-h-[100px] flex flex-col justify-center">
                  <p className="text-sm text-gray-400 mb-2">スロット {index + 1}</p>
                  {collocation ? (
                    <>
                      <p className="text-white text-sm">{collocation.text}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSlot(slot);
                        }}
                      >
                        クリア
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">未選択</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-black/80 border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              残りのコロケーション
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
              {remainingCollocations.all.map((collocation) => {
                // アノテーション計算
                const annotations =
                  uiSupport.chainPredictionEnabled ||
                  uiSupport.typeMatchingEnabled
                    ? calculateCardAnnotations(collocation, {
                        selectedCollocations: Object.values(
                          selectedTurnCollocations
                        ),
                        enemyType: currentEnemyTurnInfo?.type,
                        remainingByRhyming: {
                          A: remainingCollocations.byRhyming.A.length,
                          B: remainingCollocations.byRhyming.B.length,
                          C: remainingCollocations.byRhyming.C.length,
                          D: remainingCollocations.byRhyming.D.length,
                          "-": 0,
                        },
                      })
                    : [];

                // チュートリアルモード: 推奨カードかチェック
                const isRecommended = (() => {
                  if (!tutorialState.isActive || !selectedSlot) return false;

                  if (tutorialState.currentLevel === 1) {
                    return Object.entries(TUTORIAL_LEVEL1_RECOMMENDED).some(
                      ([slot, id]) => slot === selectedSlot && id === collocation.id
                    );
                  } else if (tutorialState.currentLevel === 2) {
                    const turnKey = currentTurn === 1 ? 'turn1' : 'turn2';
                    const recommended = TUTORIAL_LEVEL2_RECOMMENDED[turnKey];
                    return Object.entries(recommended).some(
                      ([slot, id]) => slot === selectedSlot && id === collocation.id
                    );
                  }

                  return false;
                })();

                return (
                  <Card
                    key={collocation.id}
                    className={cn(
                      "cursor-pointer bg-gray-900 border-gray-700 hover:border-cyan-400 transition-all",
                      isRecommended &&
                        "border-[#FFD700] border-4 animate-pulse shadow-[0_0_20px_#FFD700]"
                    )}
                    onClick={() => {
                      if (selectedSlot) {
                        handleCollocationSelect(selectedSlot, collocation);
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      {isRecommended && (
                        <div className="mb-2 text-[#FFD700] font-bold text-sm flex items-center gap-1">
                          ⭐ おすすめ!
                        </div>
                      )}
                      <p className="text-white text-sm">{collocation.text}</p>
                      <div className="flex gap-1 mt-2">
                        <span className="text-xs px-1 py-0.5 rounded bg-magenta-900/50 text-magenta-300">
                          {collocation.type}
                        </span>
                        <span className="text-xs px-1 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                          {collocation.rhyming}
                        </span>
                      </div>

                      {/* アノテーション表示 */}
                      {annotations.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {annotations.map((annotation, index) => (
                            <div
                              key={index}
                              className={cn(
                                "text-xs px-2 py-1 rounded",
                                annotation.type === "chain" &&
                                  "bg-orange-900/50 text-orange-300",
                                annotation.type === "typeMatch" &&
                                  "bg-cyan-900/50 text-cyan-300",
                                annotation.type === "warning" &&
                                  "bg-yellow-900/50 text-yellow-300"
                              )}
                            >
                              <div className="flex items-center gap-1">
                                <span>{annotation.icon}</span>
                                <span>{annotation.text}</span>
                              </div>
                              {annotation.subtext && (
                                <div className="text-xs opacity-80 mt-0.5">
                                  {annotation.subtext}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="neon"
          size="lg"
          onClick={proceedToAttack}
          disabled={!canProceedToAttack()}
          className="w-full"
        >
          攻撃フェーズへ
        </Button>
      </div>

      {/* 残りデッキ表示 */}
      <RemainingDeckDisplay />

      {/* チュートリアルヒントモーダル */}
      <TutorialModal
        show={showTutorialHint}
        title={`スロット${tutorialSlotStep + 1}を選ぼう`}
        message={tutorialHintMessages[tutorialSlotStep]}
        onNext={() => setShowTutorialHint(false)}
        nextButtonText="わかった"
      />
    </div>
  );
}
