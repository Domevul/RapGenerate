"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useGameStore } from "@/lib/store";

type ErrorScreenProps = {
  errorType: "resource-depleted" | "unknown";
  onRetry?: () => void;
};

export function ErrorScreen({ errorType, onRetry }: ErrorScreenProps) {
  const resetGame = useGameStore((state) => state.resetGame);
  const setScreen = useGameStore((state) => state.setScreen);

  const errorMessages = {
    "resource-depleted": {
      title: "リソース不足",
      message: "残りのコロケーションが不足しています。\n\nデッキを再構築するか、タイトルに戻ってください。",
      icon: "⚠️",
    },
    unknown: {
      title: "エラーが発生しました",
      message: "予期しないエラーが発生しました。\n\nタイトルに戻ってやり直してください。",
      icon: "❌",
    },
  };

  const error = errorMessages[errorType];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4 flex items-center justify-center">
      <Card className="max-w-md w-full bg-black/80 border-2 border-red-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <CardTitle className="text-2xl text-red-400">
              {error.icon} {error.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-white whitespace-pre-wrap leading-relaxed">
            {error.message}
          </p>

          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button
                variant="outline"
                size="lg"
                onClick={onRetry}
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              >
                再試行
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                resetGame();
                setScreen("deck-select");
              }}
              className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-500/10"
            >
              デッキ選択に戻る
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                resetGame();
                setScreen("title");
              }}
              className="w-full"
            >
              タイトルに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
