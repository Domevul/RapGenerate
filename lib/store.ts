import { create } from "zustand";
import type {
  GameState,
  GameScreen,
  Collocation,
  EnemyCharacter,
  SelectedTurnCollocations,
  FillerTapResult,
  TurnResult,
} from "./types";
import { getDefaultEnemy } from "./enemy-data";
import { GAME_CONFIG } from "./constants";
import {
  initializeRemainingCollocations,
  updateRemainingCollocations,
  generateEnemyTurnInfo,
  getRandomCollocationFromDeck,
} from "./game-logic";

interface GameStore extends GameState {
  // 画面遷移
  setScreen: (screen: GameScreen) => void;

  // デッキ選択
  toggleCollocationInDeck: (collocation: Collocation) => void;
  isCollocationInDeck: (collocationId: string) => boolean;
  canAddToDeck: () => boolean;

  // ゲーム開始
  startGame: () => void;

  // 敵ターン
  generateEnemyTurn: () => void;
  proceedToPlayerPrepare: () => void;

  // プレイヤーターン - 準備フェーズ
  selectCollocationForSlot: (
    slot: keyof SelectedTurnCollocations,
    collocation: Collocation
  ) => void;
  clearSlot: (slot: keyof SelectedTurnCollocations) => void;
  canProceedToAttack: () => boolean;
  proceedToAttack: () => void;

  // プレイヤーターン - 攻撃フェーズ
  addFillerTapResult: (result: FillerTapResult) => void;
  finishAttackPhase: (result: TurnResult) => void;

  // ターン終了
  proceedToNextTurn: () => void;

  // ゲームリセット
  resetGame: () => void;
}

const initialState: GameState = {
  currentScreen: "title",
  playerDeck: { collocations: [] },
  enemyCharacter: getDefaultEnemy(),
  currentTurn: 1,
  maxTurns: GAME_CONFIG.MAX_TURNS,
  remainingCollocations: {
    all: [],
    byRhyming: { A: [], B: [], C: [], D: [] },
  },
  selectedTurnCollocations: {
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
  },
  fillerTapResults: [],
  currentEnemyTurnInfo: null,
  turnResults: [],
  totalScore: 0,
  isGameStarted: false,
  isGameFinished: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

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
        currentScreen: "enemy-turn",
        turnResults: [],
        totalScore: 0,
        isGameFinished: false,
      };
    }),

  generateEnemyTurn: () =>
    set((state) => {
      const enemyCollocation = getRandomCollocationFromDeck(
        state.enemyCharacter.deck.collocations
      );
      const enemyTurnInfo = generateEnemyTurnInfo(enemyCollocation);
      return {
        currentEnemyTurnInfo: enemyTurnInfo,
      };
    }),

  proceedToPlayerPrepare: () =>
    set({
      currentScreen: "battle-prepare",
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
      currentScreen: "battle-attack",
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
        currentScreen: "turn-result",
      };
    }),

  proceedToNextTurn: () =>
    set((state) => {
      const nextTurn = state.currentTurn + 1;

      if (nextTurn > state.maxTurns) {
        return {
          isGameFinished: true,
          currentScreen: "final-result",
        };
      }

      return {
        currentTurn: nextTurn,
        currentScreen: "enemy-turn",
      };
    }),

  resetGame: () =>
    set((state) => ({
      ...initialState,
      playerDeck: state.playerDeck,
      enemyCharacter: state.enemyCharacter,
    })),
}));
