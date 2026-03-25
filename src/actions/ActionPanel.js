import { ACTIONS } from './actionDefinitions.js';
import { getActionTargetMeta } from './targetLayout.js';

/**
 * ActionPanel - renderable premium action dock
 */
export class ActionPanel {
  constructor(gsap, antCharacter, speechBubble) {
    this.gsap = gsap;
    this.ant = antCharacter;
    this.speech = speechBubble;
    this.panel = document.getElementById('action-panel');
    this.dock = document.getElementById('action-dock') || document.getElementById('action-buttons');
    this.buttons = [];
    this.buttonMap = new Map();
    this.isAnimating = false;
    this.selectHandler = null;

    this.actionDialogues = {
      dance: ['Haha! Nhìn này! 💃', 'Chiêu nhảy bí ẩn! 🕺', 'Cùng quẩy nào! 🎶'],
      eat: ['Ngon quá đi! 😋', 'Nom nom nom! 🍎', 'Ăn xong khỏe lắm! 💪'],
      sleep: ['Zzzz... 😴', 'Ngủ tí rồi dậy... 💤', 'Đừng làm phiền nha... 🤫'],
      wave: ['Hello hello! 👋', 'Chào chào! 🌟', 'Mình ở đây nè! ✨'],
    };

    this._render();
    this._bindEvents();
  }

  /**
   * Show panel with staggered button animation
   * @returns {gsap.core.Timeline}
   */
  show() {
    this.panel.classList.remove('hidden');

    const tl = this.gsap.timeline();
    tl.to(this.panel, { opacity: 1, duration: 0.3 });

    return tl;
  }

  revealSequence() {
    return ACTIONS.map(({ id }) => id);
  }

  revealAction(actionId) {
    const button = this.buttonMap.get(actionId);
    if (!button) return null;

    button.classList.remove('is-hidden');
    this.gsap.to(button, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power3.out',
    });

    return this.getTargetMeta(actionId);
  }

  pulseAction(actionId) {
    const button = this.buttonMap.get(actionId);
    if (!button) return this.gsap.timeline();

    const tl = this.gsap.timeline();
    tl.to(button, {
      boxShadow: '0 0 32px rgba(255, 132, 36, 0.36)',
      duration: 0.16,
    });
    tl.to(button, {
      boxShadow: '0 0 0 rgba(255, 132, 36, 0)',
      duration: 0.24,
    });
    return tl;
  }

  getTargetMeta(actionId) {
    const button = this.buttonMap.get(actionId);
    return button ? getActionTargetMeta(button) : null;
  }

  setActive(actionId) {
    this.buttons.forEach((button) => {
      const isActive = button.dataset.actionId === actionId;
      button.classList.toggle('is-active', isActive);
    });
  }

  onSelect(handler) {
    this.selectHandler = handler;
  }

  _render() {
    const title = document.getElementById('action-title');
    const markup = ACTIONS.map((action) => `
      <button
        class="action-btn action-tile is-hidden"
        type="button"
        data-action-id="${action.id}"
        data-animation="${action.animation}"
        data-pose="${action.pose}"
      >
        <span class="action-marker">${action.marker}</span>
        <span class="action-icon">${action.icon}</span>
        <span class="action-label">${action.label}</span>
      </button>
    `).join('');

    if (title) {
      title.textContent = 'Chọn hành động';
    }
    this.dock.innerHTML = markup;
    this.buttons = Array.from(this.dock.querySelectorAll('.action-tile'));
    this.buttonMap = new Map(this.buttons.map((button) => [button.dataset.actionId, button]));
  }

  /** @private */
  _bindEvents() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.isAnimating) return;
        const action = ACTIONS.find((item) => item.id === btn.dataset.actionId);
        if (!action) return;

        if (this.selectHandler) {
          this.setActive(action.id);
          this.selectHandler(action, this.getTargetMeta(action.id));
          return;
        }

        this._executeAction(action, btn);
      });
    });
  }

  /** @private */
  async _executeAction(action, btn) {
    this.isAnimating = true;

    // Highlight active button
    this.setActive(action.id);

    // Show dialogue
    const dialogues = action.dialogues || this.actionDialogues[action.animation] || ['Ready.'];
    const text = dialogues[Math.floor(Math.random() * dialogues.length)];
    const speechEl = document.getElementById('speech-bubble');
    const speechTextEl = document.getElementById('speech-text');

    speechEl.classList.remove('hidden');
    speechTextEl.textContent = text;
    this.gsap.fromTo(speechEl,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );

    const animTl = this.ant.playAction(action);

    if (!animTl) {
      this.isAnimating = false;
      return;
    }

    // Wait for animation to complete
    animTl.eventCallback('onComplete', () => {
      // Hide dialogue
      this.gsap.to(speechEl, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          speechEl.classList.add('hidden');
        },
      });

      btn.classList.remove('is-active');
      this.isAnimating = false;
    });
  }
}
