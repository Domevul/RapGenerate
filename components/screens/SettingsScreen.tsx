"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useGameStore } from "@/lib/store";
import { audioManager } from "@/lib/audio-manager";
import { X } from "lucide-react";

type SettingsScreenProps = {
  onClose: () => void;
};

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const uiSupport = useGameStore((state) => state.uiSupport);
  const updateUISupportSettings = useGameStore(
    (state) => state.updateUISupportSettings
  );

  // 音量変更をaudioManagerに反映
  useEffect(() => {
    audioManager.setVolume("bgm", uiSupport.bgmVolume / 100);
  }, [uiSupport.bgmVolume]);

  useEffect(() => {
    audioManager.setVolume("sfx", uiSupport.seVolume / 100);
  }, [uiSupport.seVolume]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* 設定画面 */}
      <Card className="relative z-10 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto bg-[hsl(var(--card))] border-2 border-[hsl(var(--neon-cyan))]">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[hsl(var(--neon-cyan))] neon-glow-cyan">
            ⚙️ 設定
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* コンテンツ */}
        <div className="p-4 space-y-6">
          {/* UI支援 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[hsl(var(--neon-magenta))]">
              UI支援
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uiSupport.hintsEnabled}
                  onChange={(e) =>
                    updateUISupportSettings({ hintsEnabled: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-[hsl(var(--foreground))]">
                  ヒント表示
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uiSupport.deckDisplayEnabled}
                  onChange={(e) =>
                    updateUISupportSettings({
                      deckDisplayEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-[hsl(var(--foreground))]">
                  残りデッキ表示
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uiSupport.chainPredictionEnabled}
                  onChange={(e) =>
                    updateUISupportSettings({
                      chainPredictionEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-[hsl(var(--foreground))]">
                  チェーン予測
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uiSupport.typeMatchingEnabled}
                  onChange={(e) =>
                    updateUISupportSettings({
                      typeMatchingEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-[hsl(var(--foreground))]">
                  タイプ相性表示
                </span>
              </label>
            </div>
          </div>

          {/* ゲーム設定 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[hsl(var(--neon-magenta))]">
              ゲーム設定
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-[hsl(var(--foreground))] mb-2 block">
                  コンボ構築時間
                </label>
                <div className="space-y-1">
                  {[8, 10, 12, 16].map((time) => (
                    <label key={time} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={uiSupport.comboTimeLimit === time}
                        onChange={() =>
                          updateUISupportSettings({
                            comboTimeLimit: time as 8 | 10 | 12 | 16,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[hsl(var(--foreground))]">
                        {time}秒
                        {time === 8 && " (標準)"}
                        {time === 12 && " (ゆっくり)"}
                        {time === 16 && " (じっくり)"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-[hsl(var(--foreground))] mb-2 block">
                  タップ判定
                </label>
                <div className="space-y-1">
                  {[
                    { value: "easy", label: "甘め" },
                    { value: "normal", label: "標準" },
                    { value: "hard", label: "厳しめ" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={uiSupport.tapJudgement === option.value}
                        onChange={() =>
                          updateUISupportSettings({
                            tapJudgement: option.value as
                              | "easy"
                              | "normal"
                              | "hard",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[hsl(var(--foreground))]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 音声・音楽 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[hsl(var(--neon-magenta))]">
              音声・音楽
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[hsl(var(--foreground))]">
                    BGM音量
                  </label>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {uiSupport.bgmVolume}%
                  </span>
                </div>
                <Slider
                  value={[uiSupport.bgmVolume]}
                  onValueChange={([value]) =>
                    updateUISupportSettings({ bgmVolume: value })
                  }
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[hsl(var(--foreground))]">
                    SE音量
                  </label>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {uiSupport.seVolume}%
                  </span>
                </div>
                <Slider
                  value={[uiSupport.seVolume]}
                  onValueChange={([value]) =>
                    updateUISupportSettings({ seVolume: value })
                  }
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] p-4">
          <Button
            onClick={onClose}
            className="w-full bg-[hsl(var(--neon-cyan))] hover:bg-[hsl(var(--neon-cyan))]/80 text-black font-bold"
          >
            保存して戻る
          </Button>
        </div>
      </Card>
    </div>
  );
}
