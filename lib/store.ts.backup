import { create } from "zustand";
import type {
  GameState,
  GameScreen,
  Collocation,
  EnemyCharacter,
  SelectedTurnCollocations,
  FillerTapResult,
  TurnResult,
  TutorialState,
  TutorialLevel,
  TutorialStep,
  UISupportSettings,
} from "./types";
import { getDefaultEnemy } from "./enemy-data";
import { GAME_CONFIG } from "./constants";
import {
  initializeRemainingCollocations,
  updateRemainingCollocations,
  generateEnemyTurnInfo,
  getRandomCollocationFromDeck,
} from "./game-logic";
import { getRandomEnemyRap, TUTORIAL_ENEMY_RAP, TUTORIAL_LEVEL2_RAPS } from "./enemy-raps";

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

  // チュートリアル
  tutorialState: TutorialState;
  setTutorialLevel: (level: TutorialLevel) => void;
  setTutorialStep: (step: TutorialStep | null) => void;
  completeTutorialLevel: (level: TutorialLevel) => void;
  skipTutorial: () => void;
  setTutorialActive: (active: boolean) => void;

  // UI支援設定
  uiSupport: UISupportSettings;
  updateUISupportSettings: (settings: Partial<UISupportSettings>) => void;

  // エラー管理
  setError: (errorType: "resource-depleted" | "unknown" | null) => void;
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
  errorType: null,
};

// チュートリアル初期状態
const initialTutorialState: TutorialState = {
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

// UI支援設定の初期状態
const initialUISupportSettings: UISupportSettings = {
  hintsEnabled: true,
  deckDisplayEnabled: true,
  chainPredictionEnabled: true,
  typeMatchingEnabled: true,
  comboTimeLimit: 8,
  tapJudgement: "normal",
  bgmVolume: 70,
  seVolume: 80,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // チュートリアル状態
  tutorialState: initialTutorialState,

  // UI支援設定
  uiSupport: initialUISupportSettings,

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
      tutorialState: state.tutorialState,
      uiSupport: state.uiSupport,
    })),

  // チュートリアルアクション
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

  // UI支援設定アクション
  updateUISupportSettings: (settings) =>
    set((state) => ({
      uiSupport: {
        ...state.uiSupport,
        ...settings,
      },
    })),

  // エラー管理
  setError: (errorType) =>
    set({
      errorType,
      currentScreen: errorType ? "error" : get().currentScreen,
    }),
}));
