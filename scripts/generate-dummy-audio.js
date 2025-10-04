// ダミー音声ファイル生成スクリプト
// 実際の音声ファイルが用意できるまでの暫定対応

const fs = require('fs');
const path = require('path');

// 簡易的なWAVファイルヘッダーを生成
function createWavHeader(dataSize, sampleRate = 44100, numChannels = 1, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // block align
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

// サイン波を生成
function generateSineWave(frequency, duration, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(numSamples * 2); // 16-bit = 2 bytes

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const value = Math.sin(2 * Math.PI * frequency * t) * 0.3; // 30% volume
    const sample = Math.floor(value * 32767); // 16-bit range
    buffer.writeInt16LE(sample, i * 2);
  }

  return buffer;
}

// ダミーBGMを生成（5秒のシンプルな和音）
function createDummyBGM(filename, description) {
  console.log(`Creating dummy BGM: ${filename} (${description})`);

  const sampleRate = 44100;
  const duration = 5; // 5秒
  const numSamples = sampleRate * duration;

  // 3つの音を重ねて和音を作る
  const freq1 = 440; // A4
  const freq2 = 554; // C#5
  const freq3 = 659; // E5

  const data = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const value = (
      Math.sin(2 * Math.PI * freq1 * t) +
      Math.sin(2 * Math.PI * freq2 * t) +
      Math.sin(2 * Math.PI * freq3 * t)
    ) * 0.1; // 10% volume (3音の合成なので低めに)

    const sample = Math.floor(value * 32767);
    data.writeInt16LE(sample, i * 2);
  }

  const header = createWavHeader(data.length, sampleRate);
  const wav = Buffer.concat([header, data]);

  fs.writeFileSync(filename, wav);
  console.log(`✓ Created: ${filename} (${(wav.length / 1024).toFixed(1)} KB)`);
}

// ダミー効果音を生成
function createDummySFX(filename, frequency, duration, description) {
  console.log(`Creating dummy SFX: ${filename} (${description})`);

  const sampleRate = 44100;
  const data = generateSineWave(frequency, duration, sampleRate);
  const header = createWavHeader(data.length, sampleRate);
  const wav = Buffer.concat([header, data]);

  fs.writeFileSync(filename, wav);
  console.log(`✓ Created: ${filename} (${(wav.length / 1024).toFixed(1)} KB)`);
}

// ディレクトリ作成
const dirs = [
  path.join(__dirname, '../public/audio/bgm'),
  path.join(__dirname, '../public/audio/sfx'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Generating dummy audio files...\n');

// BGMファイル生成
createDummyBGM(
  path.join(__dirname, '../public/audio/bgm/title.wav'),
  'Title screen BGM'
);

createDummyBGM(
  path.join(__dirname, '../public/audio/bgm/battle.wav'),
  'Battle screen BGM'
);

// 効果音ファイル生成
createDummySFX(
  path.join(__dirname, '../public/audio/sfx/tap-perfect.wav'),
  880, 0.1, 'Perfect tap sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/tap-good.wav'),
  659, 0.1, 'Good tap sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/tap-bad.wav'),
  523, 0.1, 'Bad tap sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/tap-miss.wav'),
  220, 0.15, 'Miss tap sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/select.wav'),
  440, 0.05, 'Select sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/confirm.wav'),
  523, 0.1, 'Confirm sound'
);

createDummySFX(
  path.join(__dirname, '../public/audio/sfx/result.wav'),
  659, 0.2, 'Result sound'
);

console.log('\n✅ All dummy audio files created successfully!');
console.log('Note: Replace these with actual audio files when available.');
