"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";

export function TurnResultScreen() {
  const turnResults = useGameStore((state) => state.turnResults);
  const proceedToNextTurn = useGameStore((state) => state.proceedToNextTurn);
  const currentTurn = useGameStore((state) => state.currentTurn);

  const latestResult = turnResults[turnResults.length - 1];

  if (!latestResult) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="bg-black/80 border-magenta-500 border-2">
          <CardHeader>
            <CardTitle className="text-3xl text-magenta-400 text-center">
              ターン {currentTurn} 結果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-900/50 p-4 rounded">
              <h3 className="text-lg text-cyan-400 mb-2">リズム評価</h3>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Perfect:</span>
                  <span className="text-white ml-2">
                    {latestResult.rhythmEvaluation.perfectCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Good:</span>
                  <span className="text-white ml-2">
                    {latestResult.rhythmEvaluation.goodCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Bad:</span>
                  <span className="text-white ml-2">
                    {latestResult.rhythmEvaluation.badCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Miss:</span>
                  <span className="text-white ml-2">
                    {latestResult.rhythmEvaluation.missCount}
                  </span>
                </div>
              </div>
              <p className="text-xl text-white mt-2">
                スコア: {Math.round(latestResult.rhythmEvaluation.score)}点
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded">
              <h3 className="text-lg text-cyan-400 mb-2">ライミング評価</h3>
              <p className="text-white">
                チェーン数: {latestResult.rhymingEvaluation.chainCount}
              </p>
              <p className="text-white">
                倍率: {latestResult.rhymingEvaluation.multiplier}x
              </p>
              <p className="text-xl text-white mt-2">
                スコア: {Math.round(latestResult.rhymingEvaluation.score)}点
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded">
              <h3 className="text-lg text-cyan-400 mb-2">タイプ評価</h3>
              <p className="text-white">
                相性:{" "}
                {latestResult.typeEvaluation.isCompatible ? "◎" : "○"}
              </p>
              <p className="text-white">
                倍率: {latestResult.typeEvaluation.multiplier}x
              </p>
              <p className="text-xl text-white mt-2">
                スコア: {Math.round(latestResult.typeEvaluation.score)}点
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900 to-magenta-900 p-6 rounded text-center">
              <p className="text-2xl text-white font-bold">総合スコア</p>
              <p className="text-5xl text-cyan-300 font-bold mt-2">
                {latestResult.totalScore}点
              </p>
            </div>

            <Button
              variant="neon"
              size="lg"
              onClick={proceedToNextTurn}
              className="w-full"
            >
              次へ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
