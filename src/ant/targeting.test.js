import { describe, expect, it } from 'vitest';
import { POSE_FAMILIES } from './poseFamilies.js';
import { classifyPoseFamily } from './targeting.js';

describe('classifyPoseFamily', () => {
  it('maps left and right targets into bounded pose sectors', () => {
    expect(classifyPoseFamily({ centerX: 100 }, 400)).toMatch(/left/);
    expect(classifyPoseFamily({ centerX: 300 }, 400)).toMatch(/right/);
  });

  it('defines all four directional pose families', () => {
    expect(Object.keys(POSE_FAMILIES)).toEqual([
      'left-far',
      'left-near',
      'right-near',
      'right-far',
    ]);
  });
});
