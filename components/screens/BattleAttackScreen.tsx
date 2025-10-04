"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { calculateTurnResult } from "@/lib/game-logic";
import { useBattleRhythm } from "@/hooks/useBattleRhythm";

export function BattleAttackScreen() {
  const selectedTurnCollocations = useGameStore(
    (state) => state.selectedTurnCollocations
  );
  const finishAttackPhase = useGameStore((state) => state.finishAttackPhase);
  const currentEnemyTurnInfo = useGameStore(
    (state) => state.currentEnemyTurnInfo
  );

  const {
    timeline,
    currentTime,
    isPlaying,
    tapResults,
    countDown,
    tapEffects,
    isFinished,
    activeItem,
    progress,
    totalDuration,
    handleMainTap,
    handleFillerTap,
    combo,
    maxCombo,
  } = useBattleRhythm(Object.values(selectedTurnCollocations));

  // ゲーム終了時の処理
  useEffect(() => {
    if (isFinished) {
      const enemyType = (currentEnemyTurnInfo?.type || "#攻撃") as import("@/lib/types").CollocationType;
      const result = calculateTurnResult(
        Object.values(selectedTurnCollocations),
        enemyType,
        tapResults
      );
      finishAttackPhase(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  // 全歌詞
  const allLyrics = timeline
    .filter((item) => item.type === "collocation")
    .map((item) => item.content)
    .join(" / ");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4 flex flex-col relative">
      {/* カウントダウン表示 */}
      {countDown > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-9xl font-bold text-cyan-400 animate-ping">
            {countDown}
          </div>
        </div>
      )}

      {/* タップエフェクト */}
      {tapEffects.map((effect) => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-40 animate-ping"
          style={{
            left: effect.x,
            top: effect.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`text-3xl font-bold ${
              effect.judgement === "Perfect"
                ? "text-green-400"
                : effect.judgement === "Good"
                ? "text-yellow-400"
                : effect.judgement === "Bad"
                ? "text-orange-400"
                : "text-red-400"
            }`}
          >
            {effect.judgement}!
          </div>
        </div>
      ))}

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
            const left = (item.startTime / totalDuration) * 100;
            const width = (item.duration / totalDuration) * 100;
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

        {/* コンボ表示 */}
        {combo > 0 && (
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-yellow-400">
              {combo} COMBO!
            </div>
            {combo >= 5 && (
              <div className="text-sm text-yellow-300 animate-pulse">
                🔥 ON FIRE! 🔥
              </div>
            )}
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

      {/* デバッグ情報 + 統計 */}
      <div className="text-center text-xs text-gray-500 flex justify-between px-4">
        <span>
          {Math.floor(currentTime / 1000)}s / {Math.floor(totalDuration / 1000)}
          s
        </span>
        <span>MAX COMBO: {maxCombo}</span>
      </div>
    </div>
  );
}
