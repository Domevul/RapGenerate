// 敵のオリジナルラップデータ

export interface EnemyRap {
  id: string;
  turn: 1 | 2;
  lyrics: string; // 表示用の歌詞
  type: "#攻撃" | "#自慢" | "#夢中" | "#カウンター";
  rhyming: "A" | "B" | "C" | "D";
  hintMood: string; // 雰囲気のヒント
  hintRhyming: string; // 韻のヒント
}

// ターン1の敵ラップ（プレイヤーが先攻）
export const ENEMY_RAPS_TURN1: EnemyRap[] = [
  {
    id: "enemy_t1_1",
    turn: 1,
    lyrics: "お前のライムはぬるま湯みたい",
    type: "#攻撃",
    rhyming: "A",
    hintMood: "挑発的",
    hintRhyming: "〜い系（A系）",
  },
  {
    id: "enemy_t1_2",
    turn: 1,
    lyrics: "俺の前じゃお前は赤ん坊",
    type: "#攻撃",
    rhyming: "B",
    hintMood: "見下している",
    hintRhyming: "〜あ系（B系）",
  },
  {
    id: "enemy_t1_3",
    turn: 1,
    lyrics: "お前のスキルはまだまだ",
    type: "#攻撃",
    rhyming: "B",
    hintMood: "批判的",
    hintRhyming: "〜あ系（B系）",
  },
];

// ターン2の敵ラップ（プレイヤーが先攻なので、返しとして）
export const ENEMY_RAPS_TURN2: EnemyRap[] = [
  {
    id: "enemy_t2_1",
    turn: 2,
    lyrics: "お前の言葉は軽い",
    type: "#カウンター",
    rhyming: "A",
    hintMood: "反撃的",
    hintRhyming: "〜い系（A系）",
  },
  {
    id: "enemy_t2_2",
    turn: 2,
    lyrics: "俺のフロウは止まらん",
    type: "#自慢",
    rhyming: "C",
    hintMood: "自信満々",
    hintRhyming: "〜ん系（C系）",
  },
  {
    id: "enemy_t2_3",
    turn: 2,
    lyrics: "まだまだ修行が足りん",
    type: "#攻撃",
    rhyming: "C",
    hintMood: "辛辣",
    hintRhyming: "〜ん系（C系）",
  },
];

// チュートリアル用の敵ラップ（レベル1）
export const TUTORIAL_ENEMY_RAP: EnemyRap = {
  id: "tutorial_enemy",
  turn: 1,
  lyrics: "お前のスキルはまだまだだ",
  type: "#攻撃",
  rhyming: "B",
  hintMood: "挑発的",
  hintRhyming: "〜あ系（B系）で返そう",
};

// チュートリアルレベル2用の敵ラップ（2ターン分）
export const TUTORIAL_LEVEL2_RAPS = {
  turn1: {
    id: "tutorial_lv2_t1",
    turn: 1,
    lyrics: "お前のライムは薄っぺらい",
    type: "#攻撃",
    rhyming: "A",
    hintMood: "批判的",
    hintRhyming: "〜い系（A系）でチェーンを狙おう",
  } as EnemyRap,
  turn2: {
    id: "tutorial_lv2_t2",
    turn: 2,
    lyrics: "俺のフロウは止まらん",
    type: "#自慢",
    rhyming: "C",
    hintMood: "自信満々",
    hintRhyming: "タイプ相性を考えよう",
  } as EnemyRap,
};

// ランダムに敵のラップを取得
export function getRandomEnemyRap(turn: 1 | 2): EnemyRap {
  const raps = turn === 1 ? ENEMY_RAPS_TURN1 : ENEMY_RAPS_TURN2;
  return raps[Math.floor(Math.random() * raps.length)]!;
}
