"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorialModal } from "@/components/ui/tutorial-modal";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { RemainingDeckDisplay } from "@/components/ui/remaining-deck-display";
import { calculateCardAnnotations } from "@/lib/game-logic";
import { useCardSelection } from "@/hooks/useCardSelection";
import { useTutorialHints } from "@/hooks/useTutorialHints";
import type { SelectedTurnCollocations } from "@/lib/types";

export function BattlePrepareScreen() {
  const currentTurn = useGameStore((state) => state.currentTurn);
  const currentEnemyTurnInfo = useGameStore(
    (state) => state.currentEnemyTurnInfo
  );
  const uiSupport = useGameStore((state) => state.uiSupport);

  const {
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
  } = useCardSelection();

  const {
    showTutorialHint,
    tutorialMessages,
    tutorialSlotStep,
    setShowTutorialHint,
    recommendedCardIds,
    tutorialState,
  } = useTutorialHints(selectedSlot);

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
                onClick={() => handleSlotClick(slot)}
              >
                <CardContent className="p-4 min-h-[100px] flex flex-col justify-center">
                  <p className="text-sm text-gray-400 mb-2">スロット {index + 1}</p>
                  {collocation ? (
                    <>
                      <p className="text-white text-sm">{collocation.text}</p>
                      <div className="flex gap-1 mt-2">
                        <span className="text-xs px-1 py-0.5 rounded bg-magenta-900/50 text-magenta-300">
                          {collocation.type}
                        </span>
                        <span className="text-xs px-1 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                          {collocation.rhyming}
                        </span>
                      </div>
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
                        enemyType: currentEnemyTurnInfo?.type as import("@/lib/types").CollocationType | undefined,
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
                const isRecommended =
                  tutorialState.isActive &&
                  recommendedCardIds.includes(collocation.id);

                return (
                  <Card
                    key={collocation.id}
                    className={cn(
                      "cursor-pointer bg-gray-900 border-gray-700 hover:border-cyan-400 transition-all",
                      isRecommended &&
                        "border-[#FFD700] border-4 animate-pulse shadow-[0_0_20px_#FFD700]"
                    )}
                    onClick={() => handleCardClick(collocation)}
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
        message={tutorialMessages[tutorialSlotStep]}
        onNext={() => setShowTutorialHint(false)}
        nextButtonText="わかった"
      />
    </div>
  );
}
