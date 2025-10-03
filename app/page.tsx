"use client";

import { useGameStore } from "@/lib/store";
import { TitleScreen } from "@/components/screens/TitleScreen";
import { DeckSelectScreen } from "@/components/screens/DeckSelectScreen";
import { EnemyTurnScreen } from "@/components/screens/EnemyTurnScreen";
import { BattlePrepareScreen } from "@/components/screens/BattlePrepareScreen";
import { BattleAttackScreen } from "@/components/screens/BattleAttackScreen";
import { TurnResultScreen } from "@/components/screens/TurnResultScreen";
import { FinalResultScreen } from "@/components/screens/FinalResultScreen";

export default function GameRouter() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  return (
    <main className="min-h-screen">
      {currentScreen === "title" && <TitleScreen />}
      {currentScreen === "deck-select" && <DeckSelectScreen />}
      {currentScreen === "enemy-turn" && <EnemyTurnScreen />}
      {currentScreen === "battle-prepare" && <BattlePrepareScreen />}
      {currentScreen === "battle-attack" && <BattleAttackScreen />}
      {currentScreen === "turn-result" && <TurnResultScreen />}
      {currentScreen === "final-result" && <FinalResultScreen />}
    </main>
  );
}
