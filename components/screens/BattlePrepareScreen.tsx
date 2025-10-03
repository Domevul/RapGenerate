"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { GAME_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SelectedTurnCollocations } from "@/lib/types";

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

  const [timeLeft, setTimeLeft] = useState(
    GAME_CONFIG.PREPARE_PHASE_DURATION / 1000
  );
  const [selectedSlot, setSelectedSlot] =
    useState<keyof SelectedTurnCollocations | null>(null);

  // リソース不足チェック
  useEffect(() => {
    if (remainingCollocations.all.length < GAME_CONFIG.TURN_COLLOCATIONS_COUNT) {
      console.error(
        `リソース不足: 残り${remainingCollocations.all.length}個（必要: ${GAME_CONFIG.TURN_COLLOCATIONS_COUNT}個）`
      );
      // TODO: エラー画面への遷移または警告表示
    }
  }, [remainingCollocations]);

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
  }, [canProceedToAttack, proceedToAttack]);

  const slots: (keyof SelectedTurnCollocations)[] = [
    "slot1",
    "slot2",
    "slot3",
    "slot4",
  ];

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
              {remainingCollocations.all.map((collocation) => (
                <Card
                  key={collocation.id}
                  className="cursor-pointer bg-gray-900 border-gray-700 hover:border-cyan-400 transition-all"
                  onClick={() => {
                    if (selectedSlot) {
                      selectCollocationForSlot(selectedSlot, collocation);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <p className="text-white text-sm">{collocation.text}</p>
                    <div className="flex gap-1 mt-2">
                      <span className="text-xs px-1 py-0.5 rounded bg-magenta-900/50 text-magenta-300">
                        {collocation.type}
                      </span>
                      <span className="text-xs px-1 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                        {collocation.rhyming}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
    </div>
  );
}
