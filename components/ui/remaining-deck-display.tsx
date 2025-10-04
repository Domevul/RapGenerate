"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { RhymingGroup, CollocationType } from "@/lib/types";

export function RemainingDeckDisplay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const remainingCollocations = useGameStore(
    (state) => state.remainingCollocations
  );
  const deckDisplayEnabled = useGameStore(
    (state) => state.uiSupport.deckDisplayEnabled
  );

  if (!deckDisplayEnabled) return null;

  // ライミンググループごとの残り枚数
  const rhymingCounts: Record<RhymingGroup, number> = {
    A: remainingCollocations.byRhyming.A.length,
    B: remainingCollocations.byRhyming.B.length,
    C: remainingCollocations.byRhyming.C.length,
    D: remainingCollocations.byRhyming.D.length,
    "-": 0,
  };

  // タイプごとの残り枚数
  const typeCounts: Record<CollocationType, number> = {
    "#攻撃": 0,
    "#自慢": 0,
    "#夢中": 0,
    "#カウンター": 0,
  };

  remainingCollocations.all.forEach((collocation) => {
    typeCounts[collocation.type]++;
  });

  // ゲージの最大値（初期デッキサイズの想定）
  const maxRhymingCount = 9;

  // ゲージの■を生成
  const renderGauge = (count: number, max: number) => {
    const filled = Math.ceil((count / max) * 5);
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "text-sm",
              i < filled ? "text-[hsl(var(--neon-cyan))]" : "text-gray-600"
            )}
          >
            ■
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed top-4 right-4 z-30">
      <Card className="bg-[hsl(var(--card))]/95 border-[hsl(var(--neon-cyan))] shadow-lg">
        {/* ヘッダー */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-[hsl(var(--muted))]/50"
        >
          <span className="text-[hsl(var(--neon-cyan))] font-bold flex items-center gap-2">
            🎴 デッキ
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
          )}
        </Button>

        {/* 展開時のコンテンツ */}
        {isExpanded && (
          <div className="px-3 pb-3 space-y-3">
            {/* ライミング残数 */}
            <div className="space-y-1.5">
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold">
                ライミング
              </p>
              {(["A", "B", "C", "D"] as RhymingGroup[]).map((rhyming) => (
                <div
                  key={rhyming}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm text-[hsl(var(--foreground))]">
                    韻{rhyming}:
                  </span>
                  <div className="flex items-center gap-2">
                    {renderGauge(rhymingCounts[rhyming], maxRhymingCount)}
                    <span className="text-sm text-[hsl(var(--foreground))] w-8 text-right">
                      {rhymingCounts[rhyming]}枚
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[hsl(var(--border))]" />

            {/* タイプ残数 */}
            <div className="space-y-1.5">
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold">
                タイプ
              </p>
              {(
                ["#攻撃", "#カウンター", "#自慢", "#夢中"] as CollocationType[]
              ).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm text-[hsl(var(--foreground))]">
                    {type}:
                  </span>
                  <span className="text-sm text-[hsl(var(--foreground))]">
                    {typeCounts[type]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
