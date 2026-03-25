import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoldToUnlock } from './HoldToUnlock.js';

function createGsapStub() {
  return {
    to(target, config = {}) {
      if (config.onComplete) {
        config.onComplete();
      }
      return {
        kill() {},
      };
    },
    fromTo(target, fromConfig = {}, toConfig = {}) {
      if (toConfig.onComplete) {
        toConfig.onComplete();
      }
      return {
        kill() {},
      };
    },
    timeline() {
      return {
        to() {
          return this;
        },
      };
    },
  };
}

describe('HoldToUnlock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div id="hand-unlock" class="hidden">
        <div id="hand-icon"></div>
        <div id="countdown-ring">
          <svg viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="54"></circle>
            <circle class="ring-progress" cx="60" cy="60" r="54"></circle>
          </svg>
        </div>
        <div id="tap-text"></div>
      </div>
      <div id="unlock-result" class="hidden">
        <div id="result-icon"></div>
        <div id="result-text"></div>
      </div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not resolve success on pointerdown alone', async () => {
    const unlock = new HoldToUnlock(createGsapStub());
    let result = 'pending';

    unlock.show().then((value) => {
      result = value;
    });

    unlock.el.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(1000);
    unlock.el.dispatchEvent(new Event('pointerup'));
    await Promise.resolve();

    expect(result).toBe('pending');
  });

  it('resolves after a continuous 3-second hold', async () => {
    const unlock = new HoldToUnlock(createGsapStub());
    let result = 'pending';

    unlock.show().then((value) => {
      result = value;
    });

    unlock.el.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(3000);
    await Promise.resolve();

    expect(result).toBe(true);
  });
});
