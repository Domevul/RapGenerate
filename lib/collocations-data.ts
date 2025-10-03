import type { Collocation } from "./types";

// 全コロケーションデータ(仕様書より)
export const COLLOCATIONS_DATA: Collocation[] = [
  // ライミングA: 〜い系 (iai) - 9個
  { id: "a01", text: "じいちゃんの銀歯みたい", type: "#攻撃", rhyming: "A" },
  { id: "a02", text: "綺麗ごとで耳が痛い", type: "#攻撃", rhyming: "A" },
  { id: "a03", text: "常に前だけ見てる後ろ見ない", type: "#夢中", rhyming: "A" },
  { id: "a04", text: "これはただの消化試合", type: "#攻撃", rhyming: "A" },
  { id: "a05", text: "そんなの関係ない", type: "#カウンター", rhyming: "A" },
  { id: "a06", text: "お前こそ痛い", type: "#カウンター", rhyming: "A" },
  { id: "a07", text: "まだまだ言葉がいい足りない", type: "#夢中", rhyming: "A" },
  { id: "a08", text: "ポルシェをもう一台買いたい", type: "#自慢", rhyming: "A" },
  { id: "a09", text: "君はここで敗退", type: "#攻撃", rhyming: "A" },

  // ライミングB: 〜あ系 (aaa) - 8個
  { id: "b01", text: "ここで抜く刀", type: "#自慢", rhyming: "B" },
  { id: "b02", text: "大丈夫か頭", type: "#攻撃", rhyming: "B" },
  { id: "b03", text: "勝てると思うな馬鹿が", type: "#攻撃", rhyming: "B" },
  { id: "b04", text: "あがってく心と体", type: "#夢中", rhyming: "B" },
  { id: "b05", text: "陸に上がった魚", type: "#攻撃", rhyming: "B" },
  { id: "b06", text: "おれは日本の宝", type: "#自慢", rhyming: "B" },
  { id: "b07", text: "お前のスキルまだまだだ", type: "#カウンター", rhyming: "B" },
  { id: "b08", text: "それじゃおれには敵わん", type: "#カウンター", rhyming: "B" },

  // ライミングC: 〜ん系 (aua) - 7個
  { id: "c01", text: "おまえはここではお客さん", type: "#攻撃", rhyming: "C" },
  { id: "c02", text: "ここでかます爆弾", type: "#自慢", rhyming: "C" },
  { id: "c03", text: "はじめますかまずは", type: "#夢中", rhyming: "C" },
  { id: "c04", text: "見せつけるお前との落差", type: "#自慢", rhyming: "C" },
  { id: "c05", text: "俺のリスナーがたくさん", type: "#自慢", rhyming: "C" },
  { id: "c06", text: "言葉返すサルが", type: "#カウンター", rhyming: "C" },
  { id: "c07", text: "きかない言葉の軽さ", type: "#カウンター", rhyming: "C" },

  // ライミングD: 〜イフ系 (aiu) - 8個
  { id: "d01", text: "これがマイライフ", type: "#夢中", rhyming: "D" },
  { id: "d02", text: "パンパンになった財布", type: "#自慢", rhyming: "D" },
  { id: "d03", text: "言葉はまるでナイフ", type: "#自慢", rhyming: "D" },
  { id: "d04", text: "ありがとう今日のライブ", type: "#夢中", rhyming: "D" },
  { id: "d05", text: "たいしたことない小細工", type: "#攻撃", rhyming: "D" },
  { id: "d06", text: "いらないアドバイス", type: "#攻撃", rhyming: "D" },
  { id: "d07", text: "返してもらうマイク", type: "#カウンター", rhyming: "D" },
  { id: "d08", text: "それはラップじゃなくて俳句", type: "#カウンター", rhyming: "D" },
];

// ライミンググループごとにコロケーションを取得
export function getCollocationsByRhyming(rhyming: string): Collocation[] {
  return COLLOCATIONS_DATA.filter((c) => c.rhyming === rhyming);
}

// タイプごとにコロケーションを取得
export function getCollocationsByType(type: string): Collocation[] {
  return COLLOCATIONS_DATA.filter((c) => c.type === type);
}

// IDでコロケーションを取得
export function getCollocationById(id: string): Collocation | undefined {
  return COLLOCATIONS_DATA.find((c) => c.id === id);
}
