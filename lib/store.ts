import { create } from "zustand";
import { createGameSlice, GameSlice } from "./stores/game.store";
import { createTutorialSlice, TutorialSlice } from "./stores/tutorial.store";
import { createUISlice, UISlice } from "./stores/ui.store";

export type GameStore = GameSlice & TutorialSlice & UISlice;

export const useGameStore = create<GameStore>()((...a) => ({
  ...createGameSlice(...a),
  ...createTutorialSlice(...a),
  ...createUISlice(...a),
}));
