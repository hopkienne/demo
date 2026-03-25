import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AntCharacter } from './AntCharacter.js';

function createGsapStub() {
  return {
    timeline: () => ({ to() { return this; }, add() { return this; }, eventCallback() { return this; } }),
    to: () => ({ kill() {} }),
    set() {},
  };
}

describe('AntCharacter rig integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="ant-container"></div>';
  });

  it('mounts the part-based rig into the ant container', () => {
    new AntCharacter(createGsapStub());

    const rig = document.querySelector('.ant-rig');
    const parts = document.querySelectorAll('[data-part]');

    expect(rig).not.toBeNull();
    expect(parts.length).toBe(9);
  });

  it('renders a targeting beam element for premium pointing cues', () => {
    new AntCharacter(createGsapStub());

    const beam = document.querySelector('.ant-target-beam');
    expect(beam).not.toBeNull();
  });

  it('dispatches premium action clips through playAction', () => {
    const character = new AntCharacter(createGsapStub());
    const focus = vi.fn(() => ({ eventCallback() { return this; } }));
    const approve = vi.fn(() => ({ eventCallback() { return this; } }));
    const celebrate = vi.fn(() => ({ eventCallback() { return this; } }));

    character.focus = focus;
    character.approve = approve;
    character.celebrate = celebrate;

    character.playAction({ animation: 'focus' });
    character.playAction({ animation: 'approve' });
    character.playAction({ animation: 'celebrate' });

    expect(focus).toHaveBeenCalledTimes(1);
    expect(approve).toHaveBeenCalledTimes(1);
    expect(celebrate).toHaveBeenCalledTimes(1);
  });
});
