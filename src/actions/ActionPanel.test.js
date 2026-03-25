import { describe, expect, it } from 'vitest';
import { ACTIONS } from './actionDefinitions.js';

describe('ACTIONS', () => {
  it('defines four ordered guided-reveal actions', () => {
    expect(ACTIONS.map((item) => item.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('uses the premium action animation set', () => {
    expect(ACTIONS.map((item) => item.animation)).toEqual([
      'wave',
      'focus',
      'approve',
      'celebrate',
    ]);
  });
});
