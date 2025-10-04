import { useState, useEffect, useRef } from "react";
import { getRandomFiller } from "@/lib/fillers-data";
import { audioManager } from "@/lib/audio-manager";
import type { TapJudgement, FillerTapResult, Collocation } from "@/lib/types";

// BPM120 = 1拍500ms
const BPM = 120;
const BEAT_DURATION = 60000 / BPM; // 500ms
// コロケーション4つ(各2拍) + フィラー3つ(各1拍) = 11拍
const TOTAL_DURATION = BEAT_DURATION * 11; // 11拍 = 5500ms

export type TimelineItem = {
  type: "collocation" | "filler";
  content: string;
  startTime: number; // ms
  duration: number; // ms
  id: number;
  filler?: ReturnType<typeof getRandomFiller>;
};

type TapEffect = {
  id: number;
  x: number;
  y: number;
  judgement: TapJudgement;
};

export function useBattleRhythm(collocations: Array<Collocation | null>) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapResults, setTapResults] = useState<FillerTapResult[]>([]);
  const [collocationTaps, setCollocationTaps] = useState<
    Array<{ id: number; judgement: TapJudgement; timestamp: number }>
  >([]);
  const [lastJudgement, setLastJudgement] = useState<TapJudgement | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [countDown, setCountDown] = useState(3);
  const [tapEffects, setTapEffects] = useState<TapEffect[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const nextEffectIdRef = useRef(0);

  // タイムライン生成（初回のみ）
  useEffect(() => {
    const filteredCollocations = collocations.filter((c) => c !== null);

    const newTimeline: TimelineItem[] = [];
    let currentPos = 0;
    let idCounter = 0;

    // 各コロケーション = 2拍（1000ms）、フィラー = 1拍（500ms）
    for (let i = 0; i < filteredCollocations.length; i++) {
      newTimeline.push({
        type: "collocation",
        content: filteredCollocations[i]!.text,
        startTime: currentPos,
        duration: BEAT_DURATION * 2, // 2拍
        id: idCounter++,
      });
      currentPos += BEAT_DURATION * 2;

      // 最後以外はフィラーを挿入
      if (i < filteredCollocations.length - 1) {
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

    // カウントダウン開始
    const countdownInterval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // カウントダウン終了後、ゲーム開始
          setTimeout(() => {
            setCountDown(0);
            setIsPlaying(true);
            startTimeRef.current = Date.now();
            // ビート開始
            audioManager.startBeat();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(countdownInterval);
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
        setIsFinished(true);
        audioManager.stopBeat();
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
  }, [isPlaying]);

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

  // タップエフェクト追加
  const addTapEffect = (x: number, y: number, judgement: TapJudgement) => {
    const effectId = nextEffectIdRef.current++;
    setTapEffects((prev) => [...prev, { id: effectId, x, y, judgement }]);
    setTimeout(() => {
      setTapEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 800);
  };

  // コンボ更新
  const updateCombo = (judgement: TapJudgement) => {
    if (judgement === "Perfect" || judgement === "Good") {
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
    } else {
      setCombo(0);
    }
  };

  // 現在アクティブなアイテム
  const activeItem = timeline.find(
    (item) =>
      currentTime >= item.startTime &&
      currentTime < item.startTime + item.duration
  );

  // メインボタンタップ（コロケーション）
  const handleMainTap = (e: React.MouseEvent) => {
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

    // エフェクトとコンボ
    addTapEffect(e.clientX, e.clientY, judgement);
    updateCombo(judgement);

    // 効果音再生
    audioManager.playTapSound(judgement);
  };

  // フィラーボタンタップ（自由リズム）
  const handleFillerTap = (e: React.MouseEvent) => {
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

    // エフェクトとコンボ
    addTapEffect(e.clientX, e.clientY, judgement);
    updateCombo(judgement);

    // 効果音再生
    audioManager.playTapSound(judgement);
  };

  const progress = (currentTime / TOTAL_DURATION) * 100;

  return {
    timeline,
    currentTime,
    isPlaying,
    tapResults,
    collocationTaps,
    lastJudgement,
    combo,
    maxCombo,
    countDown,
    tapEffects,
    isFinished,
    activeItem,
    progress,
    totalDuration: TOTAL_DURATION,
    handleMainTap,
    handleFillerTap,
  };
}
