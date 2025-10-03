"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { getRandomFiller } from "@/lib/fillers-data";
import { calculateTurnResult } from "@/lib/game-logic";
import type { TapJudgement, FillerTapResult } from "@/lib/types";

// BPM120 = 1拍500ms
const BPM = 120;
const BEAT_DURATION = 60000 / BPM; // 500ms
const TOTAL_DURATION = BEAT_DURATION * 16; // 16拍 = 8秒

type TimelineItem = {
  type: "collocation" | "filler";
  content: string;
  startTime: number; // ms
  duration: number; // ms
  id: number;
  filler?: ReturnType<typeof getRandomFiller>;
};

export function BattleAttackScreen() {
  const selectedTurnCollocations = useGameStore(
    (state) => state.selectedTurnCollocations
  );
  const addFillerTapResult = useGameStore((state) => state.addFillerTapResult);
  const finishAttackPhase = useGameStore((state) => state.finishAttackPhase);
  const currentEnemyTurnInfo = useGameStore(
    (state) => state.currentEnemyTurnInfo
  );

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapResults, setTapResults] = useState<FillerTapResult[]>([]);
  const [collocationTaps, setCollocationTaps] = useState<
    Array<{ id: number; judgement: TapJudgement; timestamp: number }>
  >([]);
  const [lastJudgement, setLastJudgement] = useState<TapJudgement | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // タイムライン生成（初回のみ）
  useEffect(() => {
    const collocations = Object.values(selectedTurnCollocations).filter(
      (c) => c !== null
    );

    const newTimeline: TimelineItem[] = [];
    let currentPos = 0;
    let idCounter = 0;

    // 各コロケーション = 2拍（1000ms）、フィラー = 1拍（500ms）
    for (let i = 0; i < collocations.length; i++) {
      newTimeline.push({
        type: "collocation",
        content: collocations[i]!.text,
        startTime: currentPos,
        duration: BEAT_DURATION * 2, // 2拍
        id: idCounter++,
      });
      currentPos += BEAT_DURATION * 2;

      // 最後以外はフィラーを挿入
      if (i < collocations.length - 1) {
        const filler = getRandomFiller();
        newTimeline.push({
          type: "filler",
          content: filler.text,
          startTime: currentPos,
          duration: BEAT_DURATION, // 1拍
          id: idCounter++,
          filler,
        });
        currentPos += BEAT_DURATION;
      }
    }

    setTimeline(newTimeline);

    // 自動開始
    setTimeout(() => {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー進行
  useEffect(() => {
    if (!isPlaying) return;

    const updateTime = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setCurrentTime(elapsed);

      if (elapsed >= TOTAL_DURATION) {
        // 終了処理
        setIsPlaying(false);
        const enemyType = currentEnemyTurnInfo?.collocation.type || "#攻撃";
        const result = calculateTurnResult(
          Object.values(selectedTurnCollocations),
          enemyType,
          tapResults
        );
        finishAttackPhase(result);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // 現在アクティブなアイテム
  const activeItem = timeline.find(
    (item) =>
      currentTime >= item.startTime &&
      currentTime < item.startTime + item.duration
  );

  // タップ判定
  const calculateJudgement = (
    tapTime: number,
    targetTime: number
  ): TapJudgement => {
    const diff = Math.abs(tapTime - targetTime);
    const perfectWindow = 100; // ±100ms
    const goodWindow = 200; // ±200ms
    const badWindow = 300; // ±300ms

    if (diff < perfectWindow) return "Perfect";
    if (diff < goodWindow) return "Good";
    if (diff < badWindow) return "Bad";
    return "Miss";
  };

  // メインボタンタップ（コロケーション）
  const handleMainTap = () => {
    if (!activeItem || activeItem.type !== "collocation") return;

    const alreadyTapped = collocationTaps.some((t) => t.id === activeItem.id);
    if (alreadyTapped) return;

    const targetTime = activeItem.startTime;
    const judgement = calculateJudgement(currentTime, targetTime);

    setCollocationTaps((prev) => [
      ...prev,
      { id: activeItem.id, judgement, timestamp: currentTime },
    ]);

    setLastJudgement(judgement);
    setTimeout(() => setLastJudgement(null), 500);
  };

  // フィラーボタンタップ（自由リズム）
  const handleFillerTap = () => {
    // BPM120のビートに近いタイミングかチェック
    const beatIndex = Math.round(currentTime / BEAT_DURATION);
    const nearestBeatTime = beatIndex * BEAT_DURATION;
    const diff = Math.abs(currentTime - nearestBeatTime);

    let judgement: TapJudgement;
    if (diff < 100) judgement = "Perfect";
    else if (diff < 200) judgement = "Good";
    else if (diff < 300) judgement = "Bad";
    else judgement = "Miss";

    const filler = getRandomFiller();
    setTapResults((prev) => [
      ...prev,
      {
        filler,
        judgement,
        timestamp: currentTime,
      },
    ]);

    setLastJudgement(judgement);
    setTimeout(() => setLastJudgement(null), 500);
  };

  // 全歌詞
  const allLyrics = timeline
    .filter((item) => item.type === "collocation")
    .map((item) => item.content)
    .join(" / ");

  // プログレスバーの位置（0-100%）
  const progress = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4 flex flex-col">
      {/* 上部: 全歌詞表示 */}
      <div className="mb-8">
        <div className="text-center text-gray-400 text-sm mb-2">YOUR RAP</div>
        <div className="text-center text-white text-lg px-4">{allLyrics}</div>
      </div>

      {/* 中央: タイムラインとシーケンスバー */}
      <div className="flex-1 flex flex-col justify-center px-4">
        {/* 現在再生中の歌詞 */}
        <div className="text-center mb-8">
          <div className="text-5xl text-cyan-400 font-bold mb-2">
            {activeItem?.content || ""}
          </div>
          <div className="text-sm text-magenta-400">
            {activeItem?.type === "collocation" ? "メイン" : "フィラー"}
          </div>
        </div>

        {/* タイムライン */}
        <div className="relative w-full h-24 mb-8">
          {/* 背景レーン */}
          <div className="absolute inset-0 bg-gray-900/50 rounded-lg border-2 border-gray-700" />

          {/* タイムラインアイテム */}
          {timeline.map((item) => {
            const left = (item.startTime / TOTAL_DURATION) * 100;
            const width = (item.duration / TOTAL_DURATION) * 100;
            const isPassed = currentTime >= item.startTime + item.duration;
            const isActive = activeItem?.id === item.id;

            return (
              <div
                key={item.id}
                className={`absolute top-2 bottom-2 rounded transition-all ${
                  isActive
                    ? "bg-cyan-500 border-2 border-cyan-300 scale-110"
                    : isPassed
                    ? "bg-gray-600"
                    : item.type === "collocation"
                    ? "bg-cyan-700 border border-cyan-500"
                    : "bg-magenta-700 border border-magenta-500"
                }`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                <div className="text-white text-xs text-center mt-2 truncate px-1">
                  {item.content}
                </div>
              </div>
            );
          })}

          {/* シーケンスバー（再生位置） */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50 transition-all"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* 判定表示 */}
        {lastJudgement && (
          <div className="text-center mb-4">
            <div
              className={`text-4xl font-bold animate-bounce ${
                lastJudgement === "Perfect"
                  ? "text-green-400"
                  : lastJudgement === "Good"
                  ? "text-yellow-400"
                  : lastJudgement === "Bad"
                  ? "text-orange-400"
                  : "text-red-400"
              }`}
            >
              {lastJudgement}!
            </div>
          </div>
        )}
      </div>

      {/* 下部: ボタン */}
      <div className="pb-8 flex justify-center gap-4">
        <Button
          variant="neon"
          size="xl"
          onClick={handleMainTap}
          disabled={!isPlaying}
          className="w-48 h-24 text-2xl"
        >
          メイン
        </Button>
        <Button
          variant="neonMagenta"
          size="xl"
          onClick={handleFillerTap}
          disabled={!isPlaying}
          className="w-48 h-24 text-2xl"
        >
          フィラー
        </Button>
      </div>

      {/* デバッグ情報 */}
      <div className="text-center text-xs text-gray-500">
        {Math.floor(currentTime / 1000)}s / {Math.floor(TOTAL_DURATION / 1000)}s
      </div>
    </div>
  );
}
