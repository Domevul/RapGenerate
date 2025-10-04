// 音楽・音声の再生を一元管理するマネージャー
// シングルトンパターンで実装

import { AUDIO_CONFIG, getBeatDuration } from "./audio-config";

type SoundType = "bgm" | "beat" | "sfx";

class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBGM: string | null = null;

  // 音量設定（SettingsScreenから変更可能）
  private volumes: {
    bgm: number;
    beat: number;
    sfx: number;
  } = {
    bgm: AUDIO_CONFIG.volume.bgm,
    beat: AUDIO_CONFIG.volume.beat,
    sfx: AUDIO_CONFIG.volume.sfx,
  };

  // BPM設定（SettingsScreenから変更可能）
  private bpm: number = AUDIO_CONFIG.bpm;

  // ビート再生用のインターバルID
  private beatIntervalId: number | null = null;

  private constructor() {
    // プライベートコンストラクタ（シングルトン）
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // AudioContextの初期化（ユーザー操作後に呼ぶ）
  public initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // BGMの再生
  public playBGM(bgmKey: keyof typeof AUDIO_CONFIG.bgm): void {
    const bgmPath = AUDIO_CONFIG.bgm[bgmKey];

    // 同じBGMが再生中なら何もしない
    if (this.currentBGM === bgmPath && this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }

    // 既存のBGMを停止
    this.stopBGM();

    // 新しいBGMを再生
    this.bgmAudio = new Audio(bgmPath);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.volumes.bgm;

    this.bgmAudio.play().catch((error) => {
      console.warn("BGM再生エラー:", error);
    });

    this.currentBGM = bgmPath;
  }

  // BGMの停止
  public stopBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio = null;
    }
    this.currentBGM = null;
  }

  // ビートの開始（BPMに同期したメトロノーム）
  public startBeat(onBeat?: (beatNumber: number) => void): void {
    this.initAudioContext();

    if (this.beatIntervalId !== null) {
      this.stopBeat();
    }

    const beatDuration = getBeatDuration(this.bpm);
    let beatCount = 0;

    // 最初のビートを即座に再生
    this.playBeatSound();
    if (onBeat) onBeat(beatCount);
    beatCount++;

    // 定期的にビートを再生
    this.beatIntervalId = window.setInterval(() => {
      this.playBeatSound();
      if (onBeat) onBeat(beatCount);
      beatCount++;
    }, beatDuration);
  }

  // ビートの停止
  public stopBeat(): void {
    if (this.beatIntervalId !== null) {
      clearInterval(this.beatIntervalId);
      this.beatIntervalId = null;
    }
  }

  // ビート音の再生（Web Audio APIでプログラム生成）
  private playBeatSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // キック音（低音）
    oscillator.frequency.value = AUDIO_CONFIG.programmaticBeat.kickFrequency;
    oscillator.type = "sine";

    // 音量設定
    gainNode.gain.setValueAtTime(this.volumes.beat, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + AUDIO_CONFIG.programmaticBeat.kickDuration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + AUDIO_CONFIG.programmaticBeat.kickDuration);
  }

  // 効果音の再生
  public playSFX(sfxKey: keyof typeof AUDIO_CONFIG.sfx): void {
    const sfxPath = AUDIO_CONFIG.sfx[sfxKey];
    const audio = new Audio(sfxPath);
    audio.volume = this.volumes.sfx;

    audio.play().catch((error) => {
      // ファイルが存在しない場合はプログラム生成音で代替
      console.warn("効果音ファイルが見つかりません。プログラム生成音を使用:", error);
      this.playProgrammaticSFX(sfxKey);
    });
  }

  // プログラム生成効果音（ファイルがない場合の代替）
  private playProgrammaticSFX(sfxKey: keyof typeof AUDIO_CONFIG.sfx): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 判定ごとに異なる音を生成
    const soundMap = {
      tapPerfect: { freq: 880, duration: 0.1 }, // A5音
      tapGood: { freq: 659, duration: 0.1 },    // E5音
      tapBad: { freq: 523, duration: 0.1 },     // C5音
      tapMiss: { freq: 220, duration: 0.15 },   // A3音（低音）
      select: { freq: 440, duration: 0.05 },    // A4音
      confirm: { freq: 523, duration: 0.1 },    // C5音
      result: { freq: 659, duration: 0.2 },     // E5音（長め）
    };

    const sound = soundMap[sfxKey] || { freq: 440, duration: 0.1 };

    oscillator.frequency.value = sound.freq;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(this.volumes.sfx * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + sound.duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + sound.duration);
  }

  // タップ判定音の再生
  public playTapSound(judgement: "Perfect" | "Good" | "Bad" | "Miss"): void {
    const sfxMap = {
      Perfect: "tapPerfect" as const,
      Good: "tapGood" as const,
      Bad: "tapBad" as const,
      Miss: "tapMiss" as const,
    };

    const sfxKey = sfxMap[judgement];
    this.playSFX(sfxKey);
  }

  // 音量設定
  public setVolume(type: SoundType, volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.volumes[type] = clampedVolume;

    // BGMの音量をリアルタイム更新
    if (type === "bgm" && this.bgmAudio) {
      this.bgmAudio.volume = clampedVolume;
    }
  }

  // 音量取得
  public getVolume(type: SoundType): number {
    return this.volumes[type];
  }

  // BPM設定
  public setBPM(bpm: number): void {
    if (bpm >= 60 && bpm <= 180) {
      this.bpm = bpm as typeof AUDIO_CONFIG.bpm;

      // ビートが再生中なら再起動
      if (this.beatIntervalId !== null) {
        this.stopBeat();
        this.startBeat();
      }
    }
  }

  // BPM取得
  public getBPM(): number {
    return this.bpm;
  }

  // クリーンアップ
  public cleanup(): void {
    this.stopBGM();
    this.stopBeat();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// シングルトンインスタンスをエクスポート
export const audioManager = AudioManager.getInstance();
