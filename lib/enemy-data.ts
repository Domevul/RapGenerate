import type { EnemyCharacter, Collocation } from "./types";
import { COLLOCATIONS_DATA } from "./collocations-data";

// ヘルパー関数: IDでコロケーションを安全に取得
function getRequiredCollocationById(id: string): Collocation {
  const collocation = COLLOCATIONS_DATA.find((c) => c.id === id);
  if (!collocation) {
    throw new Error(`Collocation with id "${id}" not found in COLLOCATIONS_DATA`);
  }
  return collocation;
}

// MVP版の敵キャラクター「ストリート・ファイター」
export const ENEMY_STREET_FIGHTER: EnemyCharacter = {
  id: "enemy-001",
  name: "ストリート・ファイター",
  description: "バランス型の敵キャラクター。攻撃、挑発、自慢をバランスよく使用する。",
  deck: {
    collocations: [
      // バランス型のデッキ構成
      // #攻撃系: 8個
      getRequiredCollocationById("a01"),
      getRequiredCollocationById("a02"),
      getRequiredCollocationById("a04"),
      getRequiredCollocationById("b02"),
      getRequiredCollocationById("b03"),
      getRequiredCollocationById("c01"),
      getRequiredCollocationById("d05"),
      getRequiredCollocationById("d06"),

      // #自慢系: 5個
      getRequiredCollocationById("b01"),
      getRequiredCollocationById("b06"),
      getRequiredCollocationById("c02"),
      getRequiredCollocationById("d02"),
      getRequiredCollocationById("d03"),

      // #カウンター系: 4個
      getRequiredCollocationById("a05"),
      getRequiredCollocationById("a06"),
      getRequiredCollocationById("b07"),
      getRequiredCollocationById("c06"),

      // #夢中系: 3個
      getRequiredCollocationById("a03"),
      getRequiredCollocationById("b04"),
      getRequiredCollocationById("d01"),
    ],
  },
};

// 敵キャラクターのリスト(将来の拡張用)
export const ENEMY_CHARACTERS: EnemyCharacter[] = [ENEMY_STREET_FIGHTER];

// IDで敵キャラクターを取得
export function getEnemyById(id: string): EnemyCharacter | undefined {
  return ENEMY_CHARACTERS.find((e) => e.id === id);
}

// デフォルトの敵キャラクター(MVP版)
export function getDefaultEnemy(): EnemyCharacter {
  return ENEMY_STREET_FIGHTER;
}
