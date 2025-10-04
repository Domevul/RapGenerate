// 音楽・音声システムの設定ファイル
// BPM、ファイルパス、音量などをここで一元管理

export const AUDIO_CONFIG = {
  // BPM設定（変更可能: 60-180）
  bpm: 120,

  // BGMファイルパス（現在はダミーWAV、将来的にMP3に差し替え可能）
  bgm: {
    title: "/audio/bgm/title.wav",
    battle: "/audio/bgm/battle.wav",
  },

  // ビート音ファイルパス（プログラム生成の場合は未使用）
  beat: {
    kick: "/audio/beat/kick.mp3",
    snare: "/audio/beat/snare.mp3",
  },

  // 効果音ファイルパス（現在はダミーWAV、将来的にMP3に差し替え可能）
  sfx: {
    tapPerfect: "/audio/sfx/tap-perfect.wav",
    tapGood: "/audio/sfx/tap-good.wav",
    tapBad: "/audio/sfx/tap-bad.wav",
    tapMiss: "/audio/sfx/tap-miss.wav",
    select: "/audio/sfx/select.wav",
    confirm: "/audio/sfx/confirm.wav",
    result: "/audio/sfx/result.wav",
  },

  // デフォルト音量設定（0.0 - 1.0）
  volume: {
    bgm: 0.5,
    beat: 0.7,
    sfx: 0.8,
  },

  // ビート生成方式
  beatGenerationMode: "programmatic" as "programmatic" | "file",
  // "programmatic": Web Audio APIでプログラム生成（初期設定）
  // "file": 音声ファイルを使用

  // プログラム生成ビートの設定
  programmaticBeat: {
    kickFrequency: 100, // Hz
    kickDuration: 0.1, // 秒
    snareFrequency: 200, // Hz
    snareDuration: 0.05, // 秒
  },
} as const;

// 設定の型定義
export type AudioConfig = typeof AUDIO_CONFIG;

// BPMから1拍の時間を計算（ミリ秒）
export function getBeatDuration(bpm: number = AUDIO_CONFIG.bpm): number {
  return (60000 / bpm);
}

// BPM変更可能範囲のバリデーション
export function isValidBPM(bpm: number): boolean {
  return bpm >= 60 && bpm <= 180;
}
