/**
 * AntCharacter - Controls the ant SVG image animations using GSAP
 * Uses the user-provided SVG image as a single asset (no puppet rig).
 * Animations move/rotate/scale the whole container for reliable visual quality.
 */
export class AntCharacter {
  constructor(gsap) {
    this.gsap = gsap;
    this.container = document.getElementById('ant-container');
    this.idleTween = null;
  }

  /** Ensure the image inside the container is the original SVG */
  async ready() {
    // Replace puppet rig markup with the original SVG image if needed
    if (!this.container.querySelector('#ant-character')) {
      this.container.innerHTML = `
        <img id="ant-character" src="/src/ant/image (1).svg" alt="GAPIT Ant Character"
             style="width:100%;height:100%;object-fit:contain;">
      `;
    }

    // Wait for image to load
    const img = this.container.querySelector('#ant-character');
    if (img && !img.complete) {
      await new Promise((resolve, reject) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', reject, { once: true });
      });
    }
  }

  /**
   * Ant walks in from bottom
   * @returns {gsap.core.Timeline}
   */
  appear() {
    const tl = this.gsap.timeline();

    tl.to(this.container, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
    });

    // Add subtle bounce at end
    tl.to(this.container, {
      y: -15,
      duration: 0.3,
      ease: 'power2.out',
    });
    tl.to(this.container, {
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
      onComplete: () => this.idle(),
    });

    return tl;
  }

  /** Start idle floating animation */
  idle() {
    this._stopIdle();
    this.idleTween = this.gsap.to(this.container, {
      y: -8,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /**
   * Point toward a target (simplified: lean toward the target side)
   * @param {object} targetMeta - { centerX, centerY } in viewport coords
   * @returns {gsap.core.Timeline}
   */
  pointTo(targetMeta) {
    this._stopIdle();
    const tl = this.gsap.timeline();

    if (!targetMeta) return tl;

    const containerRect = this.container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const direction = targetMeta.centerX < containerCenterX ? -1 : 1;

    tl.to(this.container, {
      rotation: direction * 6,
      x: direction * 12,
      duration: 0.25,
      ease: 'power2.out',
    });

    return tl;
  }

  /**
   * Dispatch to the correct action animation
   */
  playAction(action) {
    const name = action?.animation || action;
    switch (name) {
      case 'wave': case 'greeting': return this.wave();
      case 'focus': return this.focus();
      case 'approve': return this.approve();
      case 'celebrate': return this.celebrate();
      case 'dance': return this.dance();
      case 'eat': return this.eat();
      case 'sleep': return this.sleep();
      default: return this.wave();
    }
  }

  celebrateUnlock() {
    return this.celebrate();
  }

  // ============ Action Animations ============

  dance() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    for (let i = 0; i < 4; i++) {
      tl.to(this.container, { rotation: 15, scaleX: 1.05, y: -20, duration: 0.25, ease: 'power2.out' });
      tl.to(this.container, { rotation: -15, scaleX: 0.95, y: 0, duration: 0.25, ease: 'power2.out' });
    }
    tl.to(this.container, { rotation: 0, scaleX: 1, y: 0, duration: 0.3, ease: 'power2.out' });

    return tl;
  }

  eat() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    tl.to(this.container, { rotation: 10, y: 15, scale: 0.95, duration: 0.3, ease: 'power2.inOut' });
    for (let i = 0; i < 3; i++) {
      tl.to(this.container, { scaleY: 0.93, duration: 0.15, ease: 'power2.in' });
      tl.to(this.container, { scaleY: 1, duration: 0.15, ease: 'power2.out' });
    }
    tl.to(this.container, { rotation: -5, y: -10, scale: 1.05, duration: 0.4, ease: 'power2.out' });
    tl.to(this.container, { rotation: 0, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });

    return tl;
  }

  sleep() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    tl.to(this.container, { rotation: -8, y: 20, scale: 0.92, duration: 0.8, ease: 'power2.inOut' });
    for (let i = 0; i < 3; i++) {
      tl.to(this.container, { scale: 0.94, duration: 0.8, ease: 'sine.inOut' });
      tl.to(this.container, { scale: 0.9, duration: 0.8, ease: 'sine.inOut' });
    }
    tl.to(this.container, { rotation: 0, y: -20, scale: 1.1, duration: 0.3, ease: 'power3.out' });
    tl.to(this.container, { y: 0, scale: 1, duration: 0.3, ease: 'bounce.out' });

    return tl;
  }

  wave() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    tl.to(this.container, { rotation: -5, y: -5, duration: 0.2, ease: 'power2.out' });
    for (let i = 0; i < 3; i++) {
      tl.to(this.container, { rotation: 8, x: 10, duration: 0.2, ease: 'sine.inOut' });
      tl.to(this.container, { rotation: -8, x: -10, duration: 0.2, ease: 'sine.inOut' });
    }
    tl.to(this.container, { rotation: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });

    return tl;
  }

  focus() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    tl.to(this.container, { y: -3, rotation: 5, duration: 0.15, ease: 'power2.out' });
    tl.to(this.container, { x: 15, y: 2, duration: 0.2, ease: 'power2.out' });
    tl.to(this.container, { y: 0, rotation: 2, duration: 0.2, ease: 'power2.inOut' });
    tl.to(this.container, { x: 0, rotation: 0, duration: 0.2, ease: 'power2.out' });

    return tl;
  }

  approve() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    // Nod
    tl.to(this.container, { y: 8, duration: 0.15, ease: 'power2.inOut' });
    tl.to(this.container, { y: -4, duration: 0.12, ease: 'power2.out' });
    tl.to(this.container, { y: 5, duration: 0.12, ease: 'power2.inOut' });
    tl.to(this.container, { y: -2, duration: 0.1, ease: 'power2.out' });
    tl.to(this.container, { x: 10, rotation: 5, duration: 0.16, ease: 'power2.out' });
    tl.to(this.container, { x: 0, y: 0, rotation: 0, duration: 0.2, ease: 'power2.out' });

    return tl;
  }

  celebrate() {
    this._stopIdle();
    const tl = this.gsap.timeline({ onComplete: () => this._returnToIdle() });

    tl.to(this.container, { y: -40, scale: 1.15, duration: 0.4, ease: 'power3.out' });
    tl.to(this.container, { rotation: 360, duration: 0.6, ease: 'power2.inOut' });
    tl.to(this.container, { y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'bounce.out' });

    return tl;
  }

  // ============ Internal ============

  _returnToIdle() {
    this.gsap.to(this.container, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => this.idle(),
    });
  }

  _stopIdle() {
    if (this.idleTween) {
      this.idleTween.kill();
      this.idleTween = null;
    }
  }
}
