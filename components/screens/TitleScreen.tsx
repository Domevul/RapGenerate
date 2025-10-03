"use client";

import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";

export function TitleScreen() {
  const setScreen = useGameStore((state) => state.setScreen);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="absolute inset-0 z-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-12 text-center">
        <h1 className="text-7xl font-bold text-white md:text-8xl">
          <span className="neon-glow-cyan text-cyan-400">MC</span>
          <br />
          <span className="neon-glow-magenta text-magenta-400">BATTLE</span>
        </h1>

        <div className="flex w-full flex-col space-y-4 pt-8">
          <Button
            variant="neon"
            size="xl"
            className="w-full"
            onClick={() => setScreen("deck-select")}
          >
            はじめる
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          <p>韻を踏んで、リズムに乗れ。</p>
          <p>相手の攻撃を読み、最高のラップで返せ。</p>
        </div>
      </div>
    </div>
  );
}
