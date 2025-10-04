"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorialModal } from "@/components/ui/tutorial-modal";
import { useGameStore } from "@/lib/store";
import { GAME_CONFIG } from "@/lib/constants";
import { audioManager } from "@/lib/audio-manager";

export function EnemyTurnScreen() {
  const currentEnemyTurnInfo = useGameStore(
    (state) => state.currentEnemyTurnInfo
  );
  const currentTurn = useGameStore((state) => state.currentTurn);
  const generateEnemyTurn = useGameStore((state) => state.generateEnemyTurn);
  const proceedToPlayerPrepare = useGameStore(
    (state) => state.proceedToPlayerPrepare
  );
  const tutorialState = useGameStore((state) => state.tutorialState);
  const setTutorialStep = useGameStore((state) => state.setTutorialStep);

  const [showTutorialModal, setShowTutorialModal] = useState(false);

  useEffect(() => {
    generateEnemyTurn();

    // BGMをバトル画面用に切り替え
    audioManager.playBGM("battle");

    // チュートリアルモードの場合、少し待ってからモーダル表示
    if (tutorialState.isActive && tutorialState.currentLevel === 1) {
      const modalTimer = setTimeout(() => {
        setShowTutorialModal(true);
        setTutorialStep("enemy-turn-intro");
      }, 3000); // 3秒後にモーダル表示

      return () => clearTimeout(modalTimer);
    } else {
      // 通常モード
      const timer = setTimeout(() => {
        proceedToPlayerPrepare();
      }, GAME_CONFIG.ENEMY_TURN_DURATION);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - run once on mount

  const handleTutorialNext = () => {
    setShowTutorialModal(false);
    proceedToPlayerPrepare();
  };

  if (!currentEnemyTurnInfo) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="bg-black/80 border-magenta-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-magenta-400">
              敵のターン {currentTurn}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <p className="text-3xl text-white font-bold animate-pulse">
                {currentEnemyTurnInfo.lyrics}
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded space-y-2">
              <p className="text-sm text-gray-400">ヒント:</p>
              <p className="text-cyan-300">
                💬 雰囲気: {currentEnemyTurnInfo.hintMood}
              </p>
              <p className="text-magenta-300">
                🎵 韻: {currentEnemyTurnInfo.hintRhyming}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チュートリアルモーダル */}
      <TutorialModal
        show={showTutorialModal}
        title="相手が攻めてきた!"
        message="さあ、4枚のカードを選んで返そう!
💡 韻を揃えるとボーナスがもらえるよ"
        onNext={handleTutorialNext}
        nextButtonText="カードを選ぶ"
      />
    </div>
  );
}
