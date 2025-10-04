"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TutorialModalProps = {
  show: boolean;
  title: string;
  message: string;
  onNext?: () => void;
  onSkip?: () => void;
  nextButtonText?: string;
  skipButtonText?: string;
};

export function TutorialModal({
  show,
  title,
  message,
  onNext,
  onSkip,
  nextButtonText = "次へ",
  skipButtonText = "スキップ",
}: TutorialModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/70" />

      {/* モーダルコンテンツ */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 bg-[hsl(var(--card))] border-2 border-[hsl(var(--neon-cyan))] shadow-[0_0_20px_hsl(var(--neon-cyan))]">
        <div className="space-y-4">
          {/* タイトル */}
          <h2 className="text-2xl font-bold text-center text-[hsl(var(--neon-cyan))] neon-glow-cyan">
            {title}
          </h2>

          {/* メッセージ */}
          <p className="text-base text-[hsl(var(--foreground))] whitespace-pre-wrap leading-relaxed">
            {message}
          </p>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            {onNext && (
              <Button
                onClick={onNext}
                className="flex-1 bg-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan))]/80 text-black font-bold"
              >
                {nextButtonText}
              </Button>
            )}
            {onSkip && (
              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1 border-[hsl(var(--muted-foreground))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/50"
              >
                {skipButtonText}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
