import type { Collocation, Deck } from "./types";
import { ALL_COLLOCATIONS } from "./collocations-data";

// チュートリアルレベル1用のプリセットデッキ
// ライミングBを中心に、わかりやすいコロケーションを選択
export const TUTORIAL_LEVEL1_DECK: Deck = {
  collocations: [
    // スロット1推奨: はいはい
    ALL_COLLOCATIONS.find((c) => c.id === "intro_5")!, // はいはい
    ALL_COLLOCATIONS.find((c) => c.id === "intro_1")!, // わかるか
    ALL_COLLOCATIONS.find((c) => c.id === "intro_2")!, // 聞いてくれ

    // スロット2推奨: お前のスキルまだまだだ
    ALL_COLLOCATIONS.find((c) => c.id === "b07")!, // お前のスキルまだまだだ
    ALL_COLLOCATIONS.find((c) => c.id === "b03")!, // 勝てると思うな馬鹿が
    ALL_COLLOCATIONS.find((c) => c.id === "b02")!, // 大丈夫か頭

    // スロット3推奨: それじゃおれには敵わん
    ALL_COLLOCATIONS.find((c) => c.id === "b08")!, // それじゃおれには敵わん
    ALL_COLLOCATIONS.find((c) => c.id === "b04")!, // あがってく心と体
    ALL_COLLOCATIONS.find((c) => c.id === "b01")!, // ここで抜く刀

    // スロット4推奨: お疲れ
    ALL_COLLOCATIONS.find((c) => c.id === "end_3")!, // お疲れ
    ALL_COLLOCATIONS.find((c) => c.id === "end_1")!, // わかったか
    ALL_COLLOCATIONS.find((c) => c.id === "end_2")!, // 負けるはずがない
  ].filter((c): c is Collocation => c !== undefined),
};

// チュートリアルレベル1で使用する推奨コロケーションID
export const TUTORIAL_LEVEL1_RECOMMENDED = {
  slot1: "intro_5", // はいはい
  slot2: "b07", // お前のスキルまだまだだ
  slot3: "b08", // それじゃおれには敵わん
  slot4: "end_3", // お疲れ
};

// チュートリアルレベル1の敵が使うコロケーション
export const TUTORIAL_LEVEL1_ENEMY_COLLOCATION = ALL_COLLOCATIONS.find(
  (c) => c.id === "b07" // お前のスキルまだまだだ
)!;

// チュートリアルレベル2用のプリセットデッキ
// ターン1: ライミングA系でチェーンを学ぶ
// ターン2: タイプ相性（#自慢へのカウンター）を学ぶ
export const TUTORIAL_LEVEL2_DECK: Deck = {
  collocations: [
    // ターン1用（A系チェーン）
    ALL_COLLOCATIONS.find((c) => c.id === "intro_5")!, // はいはい (intro)
    ALL_COLLOCATIONS.find((c) => c.id === "a02")!, // 綺麗ごとで耳が痛い
    ALL_COLLOCATIONS.find((c) => c.id === "a06")!, // お前こそ痛い
    ALL_COLLOCATIONS.find((c) => c.id === "a07")!, // まだまだ言葉がいい足りない
    ALL_COLLOCATIONS.find((c) => c.id === "end_3")!, // お疲れ (end)

    // ターン2用（カウンター系）
    ALL_COLLOCATIONS.find((c) => c.id === "intro_1")!, // わかるか (intro)
    ALL_COLLOCATIONS.find((c) => c.id === "c06")!, // 言葉返すサルが (#カウンター, C)
    ALL_COLLOCATIONS.find((c) => c.id === "c07")!, // きかない言葉の軽さ (#カウンター, C)
    ALL_COLLOCATIONS.find((c) => c.id === "d07")!, // 返してもらうマイク (#カウンター, D)
    ALL_COLLOCATIONS.find((c) => c.id === "end_1")!, // わかったか (end)

    // その他の選択肢
    ALL_COLLOCATIONS.find((c) => c.id === "b03")!, // 勝てると思うな馬鹿が
    ALL_COLLOCATIONS.find((c) => c.id === "b08")!, // それじゃおれには敵わん
    ALL_COLLOCATIONS.find((c) => c.id === "a03")!, // 常に前だけ見てる後ろ見ない
    ALL_COLLOCATIONS.find((c) => c.id === "c03")!, // はじめますかまずは
  ].filter((c): c is Collocation => c !== undefined),
};

// チュートリアルレベル2で使用する推奨コロケーションID
export const TUTORIAL_LEVEL2_RECOMMENDED = {
  turn1: {
    slot1: "intro_5", // はいはい
    slot2: "a02", // 綺麗ごとで耳が痛い (A系)
    slot3: "a06", // お前こそ痛い (A系でチェーン)
    slot4: "end_3", // お疲れ
  },
  turn2: {
    slot1: "intro_1", // わかるか
    slot2: "c06", // 言葉返すサルが (#カウンター)
    slot3: "c07", // きかない言葉の軽さ (#カウンター)
    slot4: "end_1", // わかったか
  },
};
