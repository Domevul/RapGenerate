import { describe, it, expect } from 'vitest';
import {
  calculateRhythmEvaluation,
  calculateRhymingChainEvaluation,
  calculateTypeCompatibilityEvaluation,
  calculateTurnResult,
  updateRemainingCollocations,
  initializeRemainingCollocations,
} from './game-logic';
import type { FillerTapResult, Collocation, RemainingCollocations } from './types';

describe('game-logic', () => {
  describe('calculateRhythmEvaluation', () => {
    it('Perfect判定のみの場合、満点を返す', () => {
      const fillerResults: FillerTapResult[] = [
        { filler: { id: 'f1', text: 'yo' }, judgement: 'Perfect', timestamp: 100 },
        { filler: { id: 'f2', text: 'check' }, judgement: 'Perfect', timestamp: 200 },
        { filler: { id: 'f3', text: 'uh' }, judgement: 'Perfect', timestamp: 300 },
      ];

      const result = calculateRhythmEvaluation(fillerResults);

      expect(result.perfectCount).toBe(3);
      expect(result.goodCount).toBe(0);
      expect(result.badCount).toBe(0);
      expect(result.missCount).toBe(0);
      expect(result.score).toBeGreaterThan(0);
    });

    it('判定が混在する場合、適切なスコアを計算する', () => {
      const fillerResults: FillerTapResult[] = [
        { filler: { id: 'f1', text: 'yo' }, judgement: 'Perfect', timestamp: 100 },
        { filler: { id: 'f2', text: 'check' }, judgement: 'Good', timestamp: 200 },
        { filler: { id: 'f3', text: 'uh' }, judgement: 'Bad', timestamp: 300 },
      ];

      const result = calculateRhythmEvaluation(fillerResults);

      expect(result.perfectCount).toBe(1);
      expect(result.goodCount).toBe(1);
      expect(result.badCount).toBe(1);
      expect(result.score).toBeGreaterThan(0);
    });

    it('空の配列の場合、スコア0を返す', () => {
      const result = calculateRhythmEvaluation([]);

      expect(result.score).toBe(0);
    });
  });

  describe('calculateRhymingChainEvaluation', () => {
    it('同じ韻が連続する場合、チェーンボーナスを適用する', () => {
      const collocations: (Collocation | null)[] = [
        { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
        { id: 'a2', text: 'test2', type: '#攻撃', rhyming: 'A' },
        { id: 'a3', text: 'test3', type: '#攻撃', rhyming: 'A' },
        { id: 'a4', text: 'test4', type: '#攻撃', rhyming: 'A' },
      ];

      const result = calculateRhymingChainEvaluation(collocations);

      expect(result.chainCount).toBe(4);
      expect(result.multiplier).toBeGreaterThan(1); // チェーンボーナス
      expect(result.score).toBeGreaterThan(0);
    });

    it('韻が揃っていない場合、低いスコアを返す', () => {
      const collocations: (Collocation | null)[] = [
        { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
        { id: 'b1', text: 'test2', type: '#攻撃', rhyming: 'B' },
        { id: 'c1', text: 'test3', type: '#攻撃', rhyming: 'C' },
        { id: 'd1', text: 'test4', type: '#攻撃', rhyming: 'D' },
      ];

      const result = calculateRhymingChainEvaluation(collocations);

      expect(result.chainCount).toBe(1); // チェーンなし
      expect(result.multiplier).toBe(1); // ボーナスなし
    });

    it('nullが含まれている場合は除外して計算する', () => {
      const collocations: (Collocation | null)[] = [
        null,
        { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
        { id: 'a2', text: 'test2', type: '#攻撃', rhyming: 'A' },
        null,
      ];

      const result = calculateRhymingChainEvaluation(collocations);

      expect(result.chainCount).toBe(2);
    });
  });

  describe('calculateTypeCompatibilityEvaluation', () => {
    it('#攻撃に対して#カウンターが有効な場合、高スコアを返す', () => {
      const playerCollocations: (Collocation | null)[] = [
        { id: 'c1', text: 'counter1', type: '#カウンター', rhyming: 'A' },
        { id: 'c2', text: 'counter2', type: '#カウンター', rhyming: 'A' },
        { id: 'c3', text: 'counter3', type: '#カウンター', rhyming: 'A' },
        { id: 'c4', text: 'counter4', type: '#カウンター', rhyming: 'A' },
      ];

      const result = calculateTypeCompatibilityEvaluation(playerCollocations, '#攻撃');

      expect(result.isCompatible).toBe(true);
      expect(result.multiplier).toBeGreaterThan(1);
      expect(result.score).toBeGreaterThan(0);
    });

    it('タイプ相性が悪い場合、低スコアを返す', () => {
      const playerCollocations: (Collocation | null)[] = [
        { id: 'a1', text: 'attack1', type: '#攻撃', rhyming: 'A' },
        { id: 'a2', text: 'attack2', type: '#攻撃', rhyming: 'A' },
        { id: 'a3', text: 'attack3', type: '#攻撃', rhyming: 'A' },
        { id: 'a4', text: 'attack4', type: '#攻撃', rhyming: 'A' },
      ];

      const result = calculateTypeCompatibilityEvaluation(playerCollocations, '#カウンター');

      expect(result.isCompatible).toBe(false);
      expect(result.multiplier).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateTurnResult', () => {
    it('すべての要素を統合して総合スコアを計算する', () => {
      const fillerResults: FillerTapResult[] = [
        { filler: { id: 'f1', text: 'yo' }, judgement: 'Perfect', timestamp: 100 },
        { filler: { id: 'f2', text: 'check' }, judgement: 'Perfect', timestamp: 200 },
        { filler: { id: 'f3', text: 'uh' }, judgement: 'Perfect', timestamp: 300 },
      ];

      const collocations: (Collocation | null)[] = [
        { id: 'a1', text: 'test1', type: '#カウンター', rhyming: 'A' },
        { id: 'a2', text: 'test2', type: '#カウンター', rhyming: 'A' },
        { id: 'a3', text: 'test3', type: '#カウンター', rhyming: 'A' },
        { id: 'a4', text: 'test4', type: '#カウンター', rhyming: 'A' },
      ];

      const result = calculateTurnResult(fillerResults, collocations, '#攻撃');

      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.rhythmEvaluation).toBeDefined();
      expect(result.rhymingEvaluation).toBeDefined();
      expect(result.typeEvaluation).toBeDefined();
    });
  });

  describe('initializeRemainingCollocations', () => {
    it('デッキから残りコロケーションを初期化する', () => {
      const deck: Collocation[] = [
        { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
        { id: 'a2', text: 'test2', type: '#攻撃', rhyming: 'A' },
        { id: 'b1', text: 'test3', type: '#攻撃', rhyming: 'B' },
        { id: 'c1', text: 'test4', type: '#攻撃', rhyming: 'C' },
      ];

      const result = initializeRemainingCollocations(deck);

      expect(result.all).toHaveLength(4);
      expect(result.byRhyming.A).toHaveLength(2);
      expect(result.byRhyming.B).toHaveLength(1);
      expect(result.byRhyming.C).toHaveLength(1);
      expect(result.byRhyming.D).toHaveLength(0);
    });
  });

  describe('updateRemainingCollocations', () => {
    it('使用したコロケーションを削除する', () => {
      const remaining: RemainingCollocations = {
        all: [
          { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
          { id: 'a2', text: 'test2', type: '#攻撃', rhyming: 'A' },
          { id: 'b1', text: 'test3', type: '#攻撃', rhyming: 'B' },
        ],
        byRhyming: {
          A: [
            { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
            { id: 'a2', text: 'test2', type: '#攻撃', rhyming: 'A' },
          ],
          B: [{ id: 'b1', text: 'test3', type: '#攻撃', rhyming: 'B' }],
          C: [],
          D: [],
        },
      };

      const used: (Collocation | null)[] = [
        { id: 'a1', text: 'test1', type: '#攻撃', rhyming: 'A' },
        null,
      ];

      const result = updateRemainingCollocations(remaining, used);

      expect(result.all).toHaveLength(2);
      expect(result.byRhyming.A).toHaveLength(1);
      expect(result.byRhyming.A[0]?.id).toBe('a2');
    });
  });
});
