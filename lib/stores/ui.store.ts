import { StateCreator } from "zustand";
import type { UISupportSettings, GameScreen } from "../types";

export interface UISlice {
  uiSupport: UISupportSettings;
  errorType: "resource-depleted" | "unknown" | null;
  updateUISupportSettings: (settings: Partial<UISupportSettings>) => void;
  setError: (errorType: "resource-depleted" | "unknown" | null) => void;
}

export const initialUISupportSettings: UISupportSettings = {
  hintsEnabled: true,
  deckDisplayEnabled: true,
  chainPredictionEnabled: true,
  typeMatchingEnabled: true,
  comboTimeLimit: 8,
  tapJudgement: "normal",
  bgmVolume: 70,
  seVolume: 80,
};

export const createUISlice: StateCreator<
  UISlice & { currentScreen: GameScreen; setScreen: (screen: GameScreen) => void },
  [],
  [],
  UISlice
> = (set, get) => ({
  uiSupport: initialUISupportSettings,
  errorType: null,

  updateUISupportSettings: (settings) =>
    set((state) => ({
      uiSupport: {
        ...state.uiSupport,
        ...settings,
      },
    })),

  setError: (errorType) =>
    set({
      errorType,
      currentScreen: errorType ? ("error" as GameScreen) : get().currentScreen,
    }),
});
