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
  const tutorialState = useGameStore((state) => state.tutorialState);
  const setTutorialLevel = useGameStore((state) => state.setTutorialLevel);
  const completeTutorialLevel = useGameStore((state) => state.completeTutorialLevel);
  const setTutorialActive = useGameStore((state) => state.setTutorialActive);

  const isWin = totalScore >= WIN_CONDITION.MIN_SCORE;

  // チュートリアルレベルクリア処理
  const handleTutorialClear = () => {
    if (!tutorialState.isActive) return;

    const currentLevel = tutorialState.currentLevel;
    completeTutorialLevel(currentLevel);

    if (currentLevel === 1 && isWin) {
      // レベル1クリア → レベル2へ
      setTutorialLevel(2);
      resetGame();
      setScreen("deck-select");
    } else if (currentLevel === 2 && isWin) {
      // レベル2クリア → 通常モードへ
      setTutorialActive(false);
      resetGame();
      setScreen("title");
    } else {
      // 失敗時は同じレベルをやり直し
      resetGame();
      setScreen("deck-select");
    }
  };

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

            {/* チュートリアルモードの場合 */}
            {tutorialState.isActive ? (
              <div className="space-y-3">
                {isWin && tutorialState.currentLevel === 1 && (
                  <div className="bg-cyan-900/50 p-4 rounded text-center">
                    <p className="text-cyan-300 font-bold">
                      🎊 チュートリアルレベル1クリア！
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      次はレベル2で戦略的な判断を学ぼう
                    </p>
                  </div>
                )}
                {isWin && tutorialState.currentLevel === 2 && (
                  <div className="bg-cyan-900/50 p-4 rounded text-center">
                    <p className="text-cyan-300 font-bold">
                      🎊 チュートリアルレベル2クリア！
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      通常モードが解放されました！
                    </p>
                  </div>
                )}
                {!isWin && (
                  <div className="bg-magenta-900/50 p-4 rounded text-center">
                    <p className="text-magenta-300 font-bold">
                      もう一度挑戦してみよう！
                    </p>
                  </div>
                )}
                <Button
                  variant="neon"
                  size="lg"
                  onClick={handleTutorialClear}
                  className="w-full"
                >
                  {isWin
                    ? tutorialState.currentLevel === 1
                      ? "レベル2へ進む"
                      : "通常モードへ"
                    : "もう一度挑戦"}
                </Button>
              </div>
            ) : (
              /* 通常モードの場合 */
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
