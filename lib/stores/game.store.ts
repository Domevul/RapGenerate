import { StateCreator } from "zustand";
import type {
  GameScreen,
  Collocation,
  EnemyCharacter,
  SelectedTurnCollocations,
  FillerTapResult,
  TurnResult,
  RemainingCollocations,
} from "../types";
import { getDefaultEnemy } from "../enemy-data";
import { GAME_CONFIG } from "../constants";
import {
  initializeRemainingCollocations,
  updateRemainingCollocations,
} from "../game-logic";
import { getRandomEnemyRap, TUTORIAL_ENEMY_RAP, TUTORIAL_LEVEL2_RAPS } from "../enemy-raps";

export interface GameSlice {
  // State
  currentScreen: GameScreen;
  playerDeck: { collocations: Collocation[] };
  enemyCharacter: EnemyCharacter;
  currentTurn: number;
  maxTurns: number;
  remainingCollocations: RemainingCollocations;
  selectedTurnCollocations: SelectedTurnCollocations;
  fillerTapResults: FillerTapResult[];
  currentEnemyTurnInfo: {
    lyrics: string;
    type: string;
    rhyming: string;
    hintMood: string;
    hintRhyming: string;
  } | null;
  turnResults: TurnResult[];
  totalScore: number;
  isGameStarted: boolean;
  isGameFinished: boolean;

  // Actions
  setScreen: (screen: GameScreen) => void;
  toggleCollocationInDeck: (collocation: Collocation) => void;
  isCollocationInDeck: (collocationId: string) => boolean;
  canAddToDeck: () => boolean;
  startGame: () => void;
  generateEnemyTurn: () => void;
  proceedToPlayerPrepare: () => void;
  selectCollocationForSlot: (
    slot: keyof SelectedTurnCollocations,
    collocation: Collocation
  ) => void;
  clearSlot: (slot: keyof SelectedTurnCollocations) => void;
  canProceedToAttack: () => boolean;
  proceedToAttack: () => void;
  addFillerTapResult: (result: FillerTapResult) => void;
  finishAttackPhase: (result: TurnResult) => void;
  proceedToNextTurn: () => void;
  resetGame: () => void;
}

export const initialGameState = {
  currentScreen: "title" as GameScreen,
  playerDeck: { collocations: [] as Collocation[] },
  enemyCharacter: getDefaultEnemy(),
  currentTurn: 1,
  maxTurns: GAME_CONFIG.MAX_TURNS,
  remainingCollocations: {
    all: [] as Collocation[],
    byRhyming: { A: [] as Collocation[], B: [] as Collocation[], C: [] as Collocation[], D: [] as Collocation[] },
  },
  selectedTurnCollocations: {
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
  } as SelectedTurnCollocations,
  fillerTapResults: [] as FillerTapResult[],
  currentEnemyTurnInfo: null,
  turnResults: [] as TurnResult[],
  totalScore: 0,
  isGameStarted: false,
  isGameFinished: false,
};

export const createGameSlice: StateCreator<
  GameSlice & { tutorialState: any },
  [],
  [],
  GameSlice
> = (set, get) => ({
  ...initialGameState,

  setScreen: (screen) => set({ currentScreen: screen }),

  toggleCollocationInDeck: (collocation) =>
    set((state) => {
      const isInDeck = state.playerDeck.collocations.some(
        (c) => c.id === collocation.id
      );

      if (isInDeck) {
        return {
          playerDeck: {
            collocations: state.playerDeck.collocations.filter(
              (c) => c.id !== collocation.id
            ),
          },
        };
      } else {
        if (state.playerDeck.collocations.length >= GAME_CONFIG.MAX_DECK_SIZE) {
          return state;
        }
        return {
          playerDeck: {
            collocations: [...state.playerDeck.collocations, collocation],
          },
        };
      }
    }),

  isCollocationInDeck: (collocationId) => {
    const state = get();
    return state.playerDeck.collocations.some((c) => c.id === collocationId);
  },

  canAddToDeck: () => {
    const state = get();
    return state.playerDeck.collocations.length < GAME_CONFIG.MAX_DECK_SIZE;
  },

  startGame: () =>
    set((state) => {
      const remaining = initializeRemainingCollocations(
        state.playerDeck.collocations
      );
      return {
        isGameStarted: true,
        currentTurn: 1,
        remainingCollocations: remaining,
        currentScreen: "enemy-turn" as GameScreen,
        turnResults: [],
        totalScore: 0,
        isGameFinished: false,
      };
    }),

  generateEnemyTurn: () =>
    set((state) => {
      // チュートリアルレベル1: 固定の敵ラップ
      if (state.tutorialState.isActive && state.tutorialState.currentLevel === 1) {
        return {
          currentEnemyTurnInfo: {
            lyrics: TUTORIAL_ENEMY_RAP.lyrics,
            type: TUTORIAL_ENEMY_RAP.type,
            rhyming: TUTORIAL_ENEMY_RAP.rhyming,
            hintMood: TUTORIAL_ENEMY_RAP.hintMood,
            hintRhyming: TUTORIAL_ENEMY_RAP.hintRhyming,
          },
        };
      }

      // チュートリアルレベル2: 2ターン分の固定ラップ
      if (state.tutorialState.isActive && state.tutorialState.currentLevel === 2) {
        const rap = state.currentTurn === 1 ? TUTORIAL_LEVEL2_RAPS.turn1 : TUTORIAL_LEVEL2_RAPS.turn2;
        return {
          currentEnemyTurnInfo: {
            lyrics: rap.lyrics,
            type: rap.type,
            rhyming: rap.rhyming,
            hintMood: rap.hintMood,
            hintRhyming: rap.hintRhyming,
          },
        };
      }

      // 通常モード: ターンに応じてオリジナルラップを取得
      const enemyRap = getRandomEnemyRap(state.currentTurn as 1 | 2);
      return {
        currentEnemyTurnInfo: {
          lyrics: enemyRap.lyrics,
          type: enemyRap.type,
          rhyming: enemyRap.rhyming,
          hintMood: enemyRap.hintMood,
          hintRhyming: enemyRap.hintRhyming,
        },
      };
    }),

  proceedToPlayerPrepare: () =>
    set({
      currentScreen: "battle-prepare" as GameScreen,
      selectedTurnCollocations: {
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
      },
      fillerTapResults: [],
    }),

  selectCollocationForSlot: (slot, collocation) =>
    set((state) => {
      const isAlreadySelected = Object.values(
        state.selectedTurnCollocations
      ).some((c) => c?.id === collocation.id);

      if (isAlreadySelected) {
        return state;
      }

      return {
        selectedTurnCollocations: {
          ...state.selectedTurnCollocations,
          [slot]: collocation,
        },
      };
    }),

  clearSlot: (slot) =>
    set((state) => ({
      selectedTurnCollocations: {
        ...state.selectedTurnCollocations,
        [slot]: null,
      },
    })),

  canProceedToAttack: () => {
    const state = get();
    const { slot1, slot2, slot3, slot4 } = state.selectedTurnCollocations;
    return slot1 !== null && slot2 !== null && slot3 !== null && slot4 !== null;
  },

  proceedToAttack: () =>
    set({
      currentScreen: "battle-attack" as GameScreen,
    }),

  addFillerTapResult: (result) =>
    set((state) => ({
      fillerTapResults: [...state.fillerTapResults, result],
    })),

  finishAttackPhase: (result) =>
    set((state) => {
      const usedCollocations = Object.values(state.selectedTurnCollocations);
      const newRemaining = updateRemainingCollocations(
        state.remainingCollocations,
        usedCollocations
      );

      return {
        turnResults: [...state.turnResults, result],
        totalScore: state.totalScore + result.totalScore,
        remainingCollocations: newRemaining,
        currentScreen: "turn-result" as GameScreen,
      };
    }),

  proceedToNextTurn: () =>
    set((state) => {
      const nextTurn = state.currentTurn + 1;

      if (nextTurn > state.maxTurns) {
        return {
          isGameFinished: true,
          currentScreen: "final-result" as GameScreen,
        };
      }

      return {
        currentTurn: nextTurn,
        currentScreen: "enemy-turn" as GameScreen,
      };
    }),

  resetGame: () =>
    set((state) => ({
      ...initialGameState,
      playerDeck: state.playerDeck,
      enemyCharacter: state.enemyCharacter,
    })),
});
