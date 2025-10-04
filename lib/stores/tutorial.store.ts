import { StateCreator } from "zustand";
import type { TutorialState, TutorialLevel, TutorialStep } from "../types";

export interface TutorialSlice {
  tutorialState: TutorialState;
  setTutorialLevel: (level: TutorialLevel) => void;
  setTutorialStep: (step: TutorialStep | null) => void;
  completeTutorialLevel: (level: TutorialLevel) => void;
  skipTutorial: () => void;
  setTutorialActive: (active: boolean) => void;
}

export const initialTutorialState: TutorialState = {
  isActive: false,
  currentLevel: 1,
  completedLevels: [],
  currentStep: null,
  skipped: false,
  restrictions: {
    1: {
      strategySelection: false,
      deckBuilder: false,
      turnCount: 1,
      timeLimit: null,
      showHints: true,
      highlightRecommended: true,
    },
    2: {
      strategySelection: true,
      deckBuilder: false,
      turnCount: 2,
      timeLimit: 10000,
      showHints: true,
      highlightRecommended: true,
    },
    3: {
      strategySelection: true,
      deckBuilder: true,
      turnCount: 2,
      timeLimit: 8000,
      showHints: true,
      highlightRecommended: false,
    },
  },
};

export const createTutorialSlice: StateCreator<
  TutorialSlice,
  [],
  [],
  TutorialSlice
> = (set) => ({
  tutorialState: initialTutorialState,

  setTutorialLevel: (level) =>
    set((state) => ({
      tutorialState: {
        ...state.tutorialState,
        currentLevel: level,
      },
    })),

  setTutorialStep: (step) =>
    set((state) => ({
      tutorialState: {
        ...state.tutorialState,
        currentStep: step,
      },
    })),

  completeTutorialLevel: (level) =>
    set((state) => ({
      tutorialState: {
        ...state.tutorialState,
        completedLevels: [...state.tutorialState.completedLevels, level],
      },
    })),

  skipTutorial: () =>
    set((state) => ({
      tutorialState: {
        ...state.tutorialState,
        isActive: false,
        skipped: true,
      },
    })),

  setTutorialActive: (active) =>
    set((state) => ({
      tutorialState: {
        ...state.tutorialState,
        isActive: active,
      },
    })),
});
