"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { getRandomFiller } from "@/lib/fillers-data";
import { calculateTurnResult } from "@/lib/game-logic";
import type { TapJudgement, FillerTapResult } from "@/lib/types";

type SequenceItem =
  | { type: "collocation"; content: string; id: number }
  | {
      type: "filler";
      content: string;
      filler: ReturnType<typeof getRandomFiller>;
      id: number;
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

  const [displayText, setDisplayText] = useState("");
  const [currentType, setCurrentType] = useState<"collocation" | "filler" | null>(null);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [tapWindowStart, setTapWindowStart] = useState(0);
  const [markerScale, setMarkerScale] = useState(1);
  const [lastJudgement, setLastJudgement] = useState<TapJudgement | null>(null);
  const [tapResults, setTapResults] = useState<FillerTapResult[]>([]);
  const [collocationTapResults, setCollocationTapResults] = useState<
    Array<{ id: number; judgement: TapJudgement; timestamp: number }>
  >([]);
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);

  // シーケンス生成（初回のみ）
  useEffect(() => {
    const collocations = Object.values(selectedTurnCollocations).filter(
      (c) => c !== null
    );

    const newSequence: SequenceItem[] = [];
    let idCounter = 0;
    for (let i = 0; i < collocations.length; i++) {
      newSequence.push({
        type: "collocation",
        content: collocations[i]!.text,
        id: idCounter++,
      });
      if (i < collocations.length - 1) {
        const filler = getRandomFiller();
        newSequence.push({
          type: "filler",
          content: filler.text,
          filler,
          id: idCounter++,
        });
      }
    }
    setSequence(newSequence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // シーケンス進行
  useEffect(() => {
    if (sequence.length === 0) return;

    let currentIndex = currentSequenceIndex;

    if (currentIndex >= sequence.length) {
      // 全てのタップ結果を合算
      const allTapResults = [...tapResults];
      allTapResults.forEach((result) => addFillerTapResult(result));

      const enemyType = currentEnemyTurnInfo?.collocation.type || "#攻撃";
      const result = calculateTurnResult(
        Object.values(selectedTurnCollocations),
        enemyType,
        allTapResults
      );
      finishAttackPhase(result);
      return;
    }

    const item = sequence[currentIndex];
    setDisplayText(item.content);
    setCurrentType(item.type);
    setCurrentItemId(item.id);
    setTapWindowStart(Date.now());
    setMarkerScale(1);
    setLastJudgement(null);
    setCurrentSequenceIndex(currentIndex);

    // タイミングマーカーアニメーション
    let scale = 1;
    const markerInterval = setInterval(() => {
      scale -= 0.015;
      if (scale <= 0) {
        clearInterval(markerInterval);
        // タイミングウィンドウ終了時の処理
        const alreadyTapped =
          item.type === "filler"
            ? tapResults.some((r) => r.filler.id === item.filler.id)
            : collocationTapResults.some((r) => r.id === item.id);

        if (!alreadyTapped) {
          if (item.type === "filler") {
            setTapResults((prev) => [
              ...prev,
              {
                filler: item.filler,
                judgement: "Miss",
                timestamp: Date.now(),
              },
            ]);
          } else {
            setCollocationTapResults((prev) => [
              ...prev,
              {
                id: item.id,
                judgement: "Miss",
                timestamp: Date.now(),
              },
            ]);
          }
        }
      } else {
        setMarkerScale(scale);
      }
    }, 20);

    // 次のアイテムへ進む
    const timer = setTimeout(() => {
      setCurrentSequenceIndex((prev) => prev + 1);
    }, 1500);

    return () => {
      clearInterval(markerInterval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSequenceIndex, sequence]);

  const handleMainButtonTap = () => {
    if (currentType !== "collocation" || currentItemId === null) return;

    const alreadyTapped = collocationTapResults.some((r) => r.id === currentItemId);
    if (alreadyTapped) return;

    const now = Date.now();
    const diff = now - tapWindowStart;
    const judgement = calculateJudgement(diff);

    setCollocationTapResults((prev) => [
      ...prev,
      {
        id: currentItemId,
        judgement,
        timestamp: now,
      },
    ]);

    setLastJudgement(judgement);
    setTimeout(() => setLastJudgement(null), 500);
  };

  const handleFillerButtonTap = () => {
    if (currentType !== "filler" || currentItemId === null) return;
    if (sequence.length === 0 || currentSequenceIndex >= sequence.length) return;

    const currentItem = sequence[currentSequenceIndex];
    if (currentItem.type !== "filler") return;

    // 既にタップ済みかチェック
    const alreadyTapped = tapResults.some(
      (r) => r.filler.id === currentItem.filler.id
    );
    if (alreadyTapped) return;

    const now = Date.now();
    const diff = now - tapWindowStart;
    const judgement = calculateJudgement(diff);

    // 現在表示中のフィラーを使用
    setTapResults((prev) => [
      ...prev,
      {
        filler: currentItem.filler,
        judgement,
        timestamp: now,
      },
    ]);

    setLastJudgement(judgement);
    setTimeout(() => setLastJudgement(null), 500);
  };

  const calculateJudgement = (diff: number): TapJudgement => {
    const perfectWindow = 1500 * 0.15;
    const goodWindow = 1500 * 0.3;
    const badWindow = 1500 * 0.5;

    if (diff < perfectWindow || diff > 1500 - perfectWindow) {
      return "Perfect";
    } else if (diff < goodWindow || diff > 1500 - goodWindow) {
      return "Good";
    } else if (diff < badWindow || diff > 1500 - badWindow) {
      return "Bad";
    }
    return "Miss";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4 flex flex-col">
      {/* 上部: ラップテキスト表示エリア */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <p className="text-4xl text-white font-bold animate-pulse">
            {displayText}
          </p>
        </div>

        {/* タイミングマーカー */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-cyan-500 rounded-full" />
          <div
            className="absolute border-4 border-magenta-500 rounded-full transition-all"
            style={{
              width: `${markerScale * 192}px`,
              height: `${markerScale * 192}px`,
              opacity: markerScale,
            }}
          />
          {lastJudgement && (
            <div className="absolute text-3xl font-bold text-cyan-400 animate-bounce">
              {lastJudgement}!
            </div>
          )}
        </div>
      </div>

      {/* 下部: 常設ボタン */}
      <div className="pb-8 flex justify-center gap-4">
        <Button
          variant="neon"
          size="xl"
          onClick={handleMainButtonTap}
          className="w-48 h-24 text-2xl"
        >
          メイン
        </Button>
        <Button
          variant="neonMagenta"
          size="xl"
          onClick={handleFillerButtonTap}
          className="w-48 h-24 text-2xl"
        >
          フィラー
        </Button>
      </div>
    </div>
  );
}
