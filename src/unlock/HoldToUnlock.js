export class HoldToUnlock {
  constructor(gsap) {
    this.gsap = gsap;
    this.el = document.getElementById('hand-unlock');
    this.handIcon = document.getElementById('hand-icon');
    this.ringProgress = document.querySelector('.ring-progress');
    this.tapText = document.getElementById('tap-text');
    this.resultEl = document.getElementById('unlock-result');
    this.resultIcon = document.getElementById('result-icon');
    this.resultText = document.getElementById('result-text');

    this.durationMs = 3000;
    this.circumference = 2 * Math.PI * 54;
    this.holdTimer = null;
    this.progressTween = null;
    this.isHolding = false;
    this.resolved = false;
    this._resolvePromise = null;

    this._handlePointerDown = this.startHold.bind(this);
    this._handlePointerUp = this.cancelHold.bind(this);
  }

  show() {
    return new Promise((resolve) => {
      this._resolvePromise = resolve;
      this.resolved = false;
      this.isHolding = false;

      this._resetVisualState();
      this.el.classList.remove('hidden');
      this.tapText.textContent = 'Nhấn giữ để mở khóa';

      this.gsap.fromTo(
        this.el,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'back.out(1.6)',
        }
      );

      this.el.addEventListener('pointerdown', this._handlePointerDown);
      this.el.addEventListener('pointerup', this._handlePointerUp);
      this.el.addEventListener('pointercancel', this._handlePointerUp);
      this.el.addEventListener('pointerleave', this._handlePointerUp);
    });
  }

  startHold() {
    if (this.resolved || this.isHolding) return;

    this.isHolding = true;
    this.el.classList.add('is-pressing');
    this.tapText.textContent = 'Giữ chặt...';

    this._killProgressTween();
    this.progressTween = this.gsap.to(this.ringProgress, {
      strokeDashoffset: this.circumference,
      duration: this.durationMs / 1000,
      ease: 'linear',
    });

    this.holdTimer = setTimeout(() => {
      this.completeHold();
    }, this.durationMs);
  }

  cancelHold() {
    if (this.resolved || !this.isHolding) return;

    this.isHolding = false;
    this.el.classList.remove('is-pressing');
    this.tapText.textContent = 'Nhấn giữ để mở khóa';

    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }

    this._killProgressTween();
    this.gsap.to(this.ringProgress, {
      strokeDashoffset: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  completeHold() {
    if (this.resolved) return;

    this.resolved = true;
    this.isHolding = false;
    this.el.classList.remove('is-pressing');
    this._teardown();

    this.gsap.to(this.el, {
      scale: 1.06,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.out',
      onComplete: () => {
        this.el.classList.add('hidden');
      },
    });

    this._showResult('🎉', 'Mở khóa thành công!', '#00dd44');

    // Auto-hide result after delay
    setTimeout(() => {
      this.gsap.to(this.resultEl, {
        scale: 0, opacity: 0, duration: 0.3,
        onComplete: () => {
          this.resultEl.classList.add('hidden');
          this._resolvePromise(true);
        },
      });
    }, 1000);
  }

  _resetVisualState() {
    this.el.classList.remove('is-pressing');
    this.ringProgress.style.strokeDasharray = this.circumference;
    this.ringProgress.style.strokeDashoffset = '0';
  }

  _showResult(icon, text, color) {
    this.resultIcon.textContent = icon;
    this.resultText.textContent = text;
    this.resultText.style.color = color;
    this.resultEl.classList.remove('hidden');

    this.gsap.fromTo(
      this.resultEl,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.8)' }
    );
  }

  _killProgressTween() {
    if (this.progressTween) {
      this.progressTween.kill();
      this.progressTween = null;
    }
  }

  _teardown() {
    this._killProgressTween();
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }

    this.el.removeEventListener('pointerdown', this._handlePointerDown);
    this.el.removeEventListener('pointerup', this._handlePointerUp);
    this.el.removeEventListener('pointercancel', this._handlePointerUp);
    this.el.removeEventListener('pointerleave', this._handlePointerUp);
  }
}
