"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { WIN_CONDITION } from "@/lib/constants";

export function FinalResultScreen() {
  const totalScore = useGameStore((state) => state.totalScore);
  const turnResults = useGameStore((state) => state.turnResults);
  const resetGame = useGameStore((state) => state.resetGame);
  const setScreen = useGameStore((state) => state.setScreen);

  const isWin = totalScore >= WIN_CONDITION.MIN_SCORE;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card
          className={`bg-black/80 border-2 ${
            isWin ? "border-cyan-500" : "border-magenta-500"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`text-5xl text-center ${
                isWin ? "text-cyan-400" : "text-magenta-400"
              }`}
            >
              {isWin ? "🎉 勝利!" : "😢 敗北"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900 to-magenta-900 p-8 rounded text-center">
              <p className="text-2xl text-white font-bold">最終スコア</p>
              <p className="text-6xl text-cyan-300 font-bold mt-4">
                {totalScore}点
              </p>
              <p className="text-gray-300 mt-2">
                (目標: {WIN_CONDITION.MIN_SCORE}点)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl text-cyan-400">各ターン結果</h3>
              {turnResults.map((result, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-white">ターン {index + 1}</span>
                    <span className="text-2xl text-cyan-300 font-bold">
                      {result.totalScore}点
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-400">
                    <div>
                      リズム: {Math.round(result.rhythmEvaluation.score)}
                    </div>
                    <div>
                      ライミング: {Math.round(result.rhymingEvaluation.score)}
                    </div>
                    <div>タイプ: {Math.round(result.typeEvaluation.score)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  resetGame();
                  setScreen("title");
                }}
                className="flex-1"
              >
                タイトルへ
              </Button>
              <Button
                variant="neon"
                size="lg"
                onClick={() => {
                  resetGame();
                  setScreen("deck-select");
                }}
                className="flex-1"
              >
                もう一度
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
