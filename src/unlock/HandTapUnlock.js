/**
 * HandTapUnlock - Hand tap interaction with countdown timer
 */
export class HandTapUnlock {
  constructor(gsap) {
    this.gsap = gsap;
    this.el = document.getElementById('hand-unlock');
    this.handIcon = document.getElementById('hand-icon');
    this.ringProgress = document.querySelector('.ring-progress');
    this.tapText = document.getElementById('tap-text');
    this.resultEl = document.getElementById('unlock-result');
    this.resultIcon = document.getElementById('result-icon');
    this.resultText = document.getElementById('result-text');

    this.duration = 3; // seconds
    this.circumference = 2 * Math.PI * 54; // r=54 from SVG
    this.countdownTween = null;
    this.resolved = false;
    this._resolvePromise = null;
  }

  /**
   * Show hand and wait for tap or timeout
   * @returns {Promise<boolean>} true if tapped in time
   */
  show() {
    return new Promise((resolve) => {
      this._resolvePromise = resolve;
      this.resolved = false;

      this.el.classList.remove('hidden');
      this.ringProgress.style.strokeDasharray = this.circumference;
      this.ringProgress.style.strokeDashoffset = '0';

      // Appear animation
      this.gsap.fromTo(this.el,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          onComplete: () => this._startCountdown(),
        }
      );

      // Click/Touch handler
      this._handleTap = () => {
        if (!this.resolved) {
          this.resolved = true;
          this._onSuccess();
        }
      };
      this.el.addEventListener('click', this._handleTap);
      this.el.addEventListener('touchstart', this._handleTap, { passive: true });
    });
  }

  /** @private */
  _startCountdown() {
    this.countdownTween = this.gsap.to(this.ringProgress, {
      strokeDashoffset: this.circumference,
      duration: this.duration,
      ease: 'linear',
      onComplete: () => {
        if (!this.resolved) {
          this.resolved = true;
          this._onFail();
        }
      },
    });

    // Color transition: orange → red near end
    this.gsap.to(this.ringProgress, {
      stroke: '#ff2200',
      duration: this.duration * 0.7,
      delay: this.duration * 0.3,
      ease: 'power2.in',
    });
  }

  /** @private */
  _onSuccess() {
    this._cleanup();

    // Hide hand
    this.gsap.to(this.el, {
      scale: 1.3,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        this.el.classList.add('hidden');
      },
    });

    // Show success
    this._showResult('🎉', 'Mở khóa thành công!', '#00dd44');

    setTimeout(() => {
      this._hideResult();
      setTimeout(() => this._resolvePromise(true), 400);
    }, 1200);
  }

  /** @private */
  _onFail() {
    this._cleanup();

    // Shake + hide
    const tl = this.gsap.timeline();
    tl.to(this.el, { x: -10, duration: 0.05, repeat: 5, yoyo: true });
    tl.to(this.el, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.el.classList.add('hidden');
      },
    });

    // Show fail
    this._showResult('⏰', 'Hết giờ! Thử lại...', '#ff4444');

    setTimeout(() => {
      this._hideResult();
      setTimeout(() => this._resolvePromise(false), 400);
    }, 1500);
  }

  /** @private */
  _showResult(icon, text, color) {
    this.resultIcon.textContent = icon;
    this.resultText.textContent = text;
    this.resultText.style.color = color;
    this.resultEl.classList.remove('hidden');

    this.gsap.fromTo(this.resultEl,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
    );
  }

  /** @private */
  _hideResult() {
    this.gsap.to(this.resultEl, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.resultEl.classList.add('hidden');
      },
    });
  }

  /** @private */
  _cleanup() {
    if (this.countdownTween) this.countdownTween.kill();
    this.el.removeEventListener('click', this._handleTap);
    this.el.removeEventListener('touchstart', this._handleTap);
  }
}
