import { describe, expect, it, vi } from 'vitest';
import { ACTIONS } from './actions/actionDefinitions.js';
import { GameFlow } from './GameFlow.js';
import { GAME_STATES } from './state/gameStates.js';

describe('GAME_STATES', () => {
  it('defines the required scene states', () => {
    expect(GAME_STATES.GUIDED_ACTION_REVEAL).toBe('GUIDED_ACTION_REVEAL');
    expect(GAME_STATES.FREE_ACTION_SELECTION).toBe('FREE_ACTION_SELECTION');
  });
});

function createTimeline() {
  return {
    eventCallback(name, callback) {
      if (name === 'onComplete') {
        callback();
      }
      return this;
    },
  };
}

function createGsapStub() {
  return {
    timeline() {
      return {
        to() {
          return this;
        },
        add(callback) {
          if (callback) callback();
          return this;
        },
        eventCallback(name, callback) {
          if (name === 'onComplete') {
            callback();
          }
          return this;
        },
      };
    },
    to() {
      return { kill() {} };
    },
    fromTo() {
      return { kill() {} };
    },
    set() {},
  };
}

describe('GameFlow', () => {
  it('runs guided reveal before entering free selection', async () => {
    document.body.innerHTML = `
      <div id="particles"></div>
      <div id="scene">
        <div id="ant-container"></div>
        <div id="speech-bubble"><div id="speech-text"></div></div>
        <div id="hand-unlock"><div id="hand-icon"></div><svg><circle class="ring-progress"></circle></svg><div id="tap-text"></div></div>
        <div id="unlock-result"><div id="result-icon"></div><div id="result-text"></div></div>
        <div id="action-panel"><div id="action-title"></div><div id="action-dock"></div></div>
      </div>
    `;

    const flow = new GameFlow(createGsapStub());
    flow._createParticles = vi.fn();
    flow._delay = vi.fn().mockResolvedValue();

    flow.ant = {
      ready: vi.fn().mockResolvedValue(),
      appear: vi.fn(() => createTimeline()),
      celebrateUnlock: vi.fn(() => createTimeline()),
      pointTo: vi.fn().mockResolvedValue(),
      playAction: vi.fn().mockResolvedValue(),
    };

    flow.speech = {
      show: vi.fn(() => createTimeline()),
      hide: vi.fn(() => createTimeline()),
    };

    flow.holdUnlock = {
      show: vi.fn().mockResolvedValue(true),
    };

    const revealAction = vi.fn((id) => ({ id, centerX: 100, centerY: 100 }));
    const pulseAction = vi.fn(() => createTimeline());
    const onSelect = vi.fn();

    flow.actionPanel = {
      show: vi.fn(() => createTimeline()),
      revealAction,
      pulseAction,
      onSelect,
    };

    await flow.start();

    expect(revealAction).toHaveBeenCalledTimes(ACTIONS.length);
    expect(flow.state).toBe(GAME_STATES.FREE_ACTION_SELECTION);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
