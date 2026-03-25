import { AntCharacter } from './ant/AntCharacter.js';
import { SpeechBubble } from './dialogue/SpeechBubble.js';
import { HoldToUnlock } from './unlock/HoldToUnlock.js';
import { ActionPanel } from './actions/ActionPanel.js';
import { ACTIONS } from './actions/actionDefinitions.js';
import { GAME_STATES } from './state/gameStates.js';

/**
 * GameFlow - Master state machine controller
 * States: INTRO → GREETING → HAND_TAP → UNLOCKED → ACTIONS
 */
export class GameFlow {
  constructor(gsap) {
    this.gsap = gsap;
    this.ant = new AntCharacter(gsap);
    this.speech = new SpeechBubble(gsap);
    this.holdUnlock = new HoldToUnlock(gsap);
    this.actionPanel = new ActionPanel(gsap, this.ant, this.speech);

    this.state = 'IDLE';
  }

  /**
   * Start the full game flow sequence
   */
  async start() {
    this._createParticles();
    await this.ant.ready();
    this.state = GAME_STATES.ASSET_READY;
    await this._delay(500);
    await this.playIntro();
    await this.playGreeting();
    await this.waitForUnlock();
    await this.playUnlockSuccess();
    await this.playGuidedReveal();
    this.enableFreeSelection();
  }

  async playIntro() {
    this.state = GAME_STATES.INTRO;
    await this._runAnimation(this.ant.appear());
    await this._delay(300);
  }

  async playGreeting() {
    this.state = GAME_STATES.GREETING;
    await this._runAnimation(this.speech.show());
    await this._runAnimation(this.speech.hide());
    await this._delay(180);
  }

  async waitForUnlock() {
    this.state = GAME_STATES.HOLD_TO_UNLOCK;
    await this.holdUnlock.show();
  }

  async playUnlockSuccess() {
    this.state = GAME_STATES.UNLOCK_SUCCESS;
    await this._runAnimation(this.ant.celebrateUnlock());
    await this._delay(220);
  }

  async playGuidedReveal() {
    this.state = GAME_STATES.GUIDED_ACTION_REVEAL;
    await this._runAnimation(this.actionPanel.show());

    for (const action of ACTIONS) {
      const target = this.actionPanel.revealAction(action.id);
      await this._runAnimation(this.ant.pointTo(target, action.pose));
      await this._runAnimation(this.actionPanel.pulseAction(action.id));
    }
  }

  enableFreeSelection() {
    this.state = GAME_STATES.FREE_ACTION_SELECTION;
    this.actionPanel.onSelect(async (action, target) => {
      this.state = GAME_STATES.ACTION_PLAYING;
      await this._runAnimation(this.ant.pointTo(target, action.pose));
      await this._runAnimation(this.ant.playAction(action));
      this.state = GAME_STATES.FREE_ACTION_SELECTION;
    });
  }

  /**
   * Convert GSAP timeline to Promise
   * @private
   */
  _playTimeline(tl) {
    return new Promise((resolve) => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  _runAnimation(result) {
    if (!result) {
      return Promise.resolve();
    }

    if (typeof result.then === 'function') {
      return result;
    }

    if (typeof result.eventCallback === 'function') {
      return this._playTimeline(result);
    }

    return Promise.resolve();
  }

  /**
   * Simple delay promise
   * @private
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Create floating particles in background
   * @private
   */
  _createParticles() {
    const container = document.getElementById('particles');
    const count = 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);

      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 8 + 6;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;

      this.gsap.to(particle, {
        opacity: Math.random() * 0.4 + 0.1,
        y: -100 - Math.random() * 200,
        x: (Math.random() - 0.5) * 100,
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: 'none',
      });
    }
  }
}
