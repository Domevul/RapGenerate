"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Settings } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { audioManager } from "@/lib/audio-manager";
import { SettingsScreen } from "./SettingsScreen";

export function TitleScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const setTutorialActive = useGameStore((state) => state.setTutorialActive);
  const setTutorialLevel = useGameStore((state) => state.setTutorialLevel);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // 初回マウント時にAudioContext初期化とBGM再生
  useEffect(() => {
    audioManager.initAudioContext();
    // タイトル画面のBGM再生（ダミーWAVファイル使用）
    audioManager.playBGM("title");
  }, []);

  const startTutorial = () => {
    setTutorialActive(true);
    setTutorialLevel(1);
    setScreen("deck-select"); // チュートリアルはdeck-selectから開始（自動的にプリセットデッキ適用）
  };

  const tutorialSteps = [
    {
      title: "ゲームの流れ",
      message:
        "このゲームは2ターン制のラップバトルです。\n相手のラップを聞いて、4枚のコロケーション（言葉）を選んで返します。",
    },
    {
      title: "スコアリング",
      message:
        "スコアは3要素で決まります：\n\n• リズム評価(25%) - タップのタイミング\n• ライミング評価(45%) - 韻のチェーン\n• タイプ評価(30%) - 相手との相性",
    },
    {
      title: "勝利条件",
      message:
        "2ターンの合計で150点以上を目指しましょう！\n\n同じ韻を連続で使うと「チェーンボーナス」\n相手のタイプに合わせると「相性ボーナス」が得られます。",
    },
  ];

  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-black to-black p-4">
      <div className="absolute inset-0 z-0 bg-black opacity-50"></div>

      {/* 設定ボタン */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 z-10 text-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--muted))]/50"
      >
        <Settings className="w-6 h-6" />
      </Button>

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
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-[hsl(var(--neon-cyan))]/20 border-[hsl(var(--neon-cyan))]"
            onClick={startTutorial}
          >
            チュートリアル
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setShowTutorial(true)}
          >
            遊び方
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          <p>韻を踏んで、リズムに乗れ。</p>
          <p>相手の攻撃を読み、最高のラップで返せ。</p>
        </div>
      </div>

      <Modal
        show={showTutorial}
        title={tutorialSteps[tutorialStep]?.title}
        message={tutorialSteps[tutorialStep]?.message}
        onNext={handleTutorialNext}
        onSkip={tutorialStep === 0 ? handleTutorialSkip : undefined}
        nextLabel={
          tutorialStep === tutorialSteps.length - 1 ? "はじめる" : "次へ"
        }
      />

      {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} />}
    </div>
  );
}
