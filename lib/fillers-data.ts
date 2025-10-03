import type { Filler } from "./types";

// フィラーデータ(仕様書より)
export const FILLERS_DATA: Filler[] = [
  { id: "f01", text: "ya" },
  { id: "f02", text: "エイ" },
];

// ランダムにフィラーを取得
export function getRandomFiller(): Filler {
  const randomIndex = Math.floor(Math.random() * FILLERS_DATA.length);
  return FILLERS_DATA[randomIndex];
}

// IDでフィラーを取得
export function getFillerById(id: string): Filler | undefined {
  return FILLERS_DATA.find((f) => f.id === id);
}
