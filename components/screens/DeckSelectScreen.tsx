"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorialModal } from "@/components/ui/tutorial-modal";
import { useGameStore } from "@/lib/store";
import { COLLOCATIONS_DATA } from "@/lib/collocations-data";
import { GAME_CONFIG } from "@/lib/constants";
import { TUTORIAL_LEVEL1_DECK, TUTORIAL_LEVEL2_DECK } from "@/lib/tutorial-data";
import { cn } from "@/lib/utils";

export function DeckSelectScreen() {
  const playerDeck = useGameStore((state) => state.playerDeck);
  const toggleCollocationInDeck = useGameStore(
    (state) => state.toggleCollocationInDeck
  );
  const isCollocationInDeck = useGameStore(
    (state) => state.isCollocationInDeck
  );
  const startGame = useGameStore((state) => state.startGame);
  const setScreen = useGameStore((state) => state.setScreen);
  const tutorialState = useGameStore((state) => state.tutorialState);
  const setTutorialStep = useGameStore((state) => state.setTutorialStep);

  const [showIntroModal, setShowIntroModal] = useState(false);

  const canStart =
    playerDeck.collocations.length >= GAME_CONFIG.MIN_DECK_SIZE &&
    playerDeck.collocations.length <= GAME_CONFIG.MAX_DECK_SIZE;

  // チュートリアルモードの場合、プリセットデッキを適用してすぐに開始
  useEffect(() => {
    if (tutorialState.isActive) {
      // レベルに応じたプリセットデッキを取得
      const tutorialDeck = tutorialState.currentLevel === 1
        ? TUTORIAL_LEVEL1_DECK
        : TUTORIAL_LEVEL2_DECK;

      // プリセットデッキを適用
      tutorialDeck.collocations.forEach((collocation) => {
        if (!isCollocationInDeck(collocation.id)) {
          toggleCollocationInDeck(collocation);
        }
      });

      // イントロモーダルを表示
      setShowIntroModal(true);
      setTutorialStep("welcome");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialState.isActive, tutorialState.currentLevel]);

  const handleTutorialStart = () => {
    setShowIntroModal(false);
    startGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card className="bg-black/80 border-cyan-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-400">
              デッキ選択
            </CardTitle>
            <p className="text-sm text-gray-400">
              {playerDeck.collocations.length} / {GAME_CONFIG.MIN_DECK_SIZE}〜
              {GAME_CONFIG.MAX_DECK_SIZE}個 選択中
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLLOCATIONS_DATA.map((collocation) => {
            const isSelected = isCollocationInDeck(collocation.id);
            return (
              <Card
                key={collocation.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  isSelected
                    ? "bg-cyan-900/50 border-cyan-400 border-2"
                    : "bg-black/80 border-gray-600"
                )}
                onClick={() => toggleCollocationInDeck(collocation)}
              >
                <CardContent className="p-4">
                  <p className="text-white font-medium">{collocation.text}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-magenta-900/50 text-magenta-300">
                      {collocation.type}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-cyan-900/50 text-cyan-300">
                      ライミング{collocation.rhyming}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setScreen("title")}
            className="flex-1"
          >
            戻る
          </Button>
          <Button
            variant="neon"
            size="lg"
            onClick={startGame}
            disabled={!canStart}
            className="flex-1"
          >
            バトル開始
          </Button>
        </div>
      </div>

      {/* チュートリアルイントロモーダル */}
      <TutorialModal
        show={showIntroModal}
        title={
          tutorialState.currentLevel === 1
            ? "ラップバトルに挑戦しよう!"
            : "レベル2：戦略を学ぼう"
        }
        message={
          tutorialState.currentLevel === 1
            ? "相手のラップを聞いて、カードで返すんだ。\nまずは基本を学ぼう!"
            : "ライミングチェーンとタイプ相性を使いこなそう！\n2ターン制で戦略的な判断を学ぶよ。"
        }
        onNext={handleTutorialStart}
        nextButtonText="バトル開始"
      />
    </div>
  );
}
