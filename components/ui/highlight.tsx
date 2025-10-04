"use client";

import { cn } from "@/lib/utils";

type HighlightTarget =
  | "comboBuilder"
  | "attackPhase"
  | "deckDisplay"
  | "strategySelection"
  | "slot1"
  | "slot2"
  | "slot3"
  | "slot4";

type HighlightProps = {
  target: HighlightTarget;
  className?: string;
};

export function Highlight({ target, className }: HighlightProps) {
  // ターゲットに応じた位置とサイズのクラスを定義
  const targetClasses: Record<HighlightTarget, string> = {
    comboBuilder: "top-1/4 left-1/2 -translate-x-1/2 w-11/12 h-1/2",
    attackPhase: "top-1/3 left-1/2 -translate-x-1/2 w-11/12 h-1/3",
    deckDisplay: "top-4 right-4 w-64 h-96",
    strategySelection: "top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-1/3",
    slot1: "top-1/3 left-1/4 w-32 h-48",
    slot2: "top-1/3 left-1/2 -translate-x-1/2 w-32 h-48",
    slot3: "top-1/3 left-3/4 -translate-x-1/2 w-32 h-48",
    slot4: "top-1/2 left-1/2 -translate-x-1/2 w-32 h-48",
  };

  return (
    <>
      {/* 暗いオーバーレイ */}
      <div className="fixed inset-0 bg-black/70 z-40 pointer-events-none" />

      {/* ハイライトエリア */}
      <div
        className={cn(
          "fixed z-50 pointer-events-none",
          "border-4 border-[#FFD700] rounded-lg",
          "shadow-[0_0_20px_#FFD700,inset_0_0_20px_#FFD700]",
          "animate-pulse",
          targetClasses[target],
          className
        )}
      />
    </>
  );
}
