/**
 * SpeechBubble - Manages speech bubble with typing effect
 */
export class SpeechBubble {
  constructor(gsap) {
    this.gsap = gsap;
    this.el = document.getElementById('speech-bubble');
    this.textEl = document.getElementById('speech-text');

    this.dialogues = [
      'Xin chào! Mình là GAPIT! 🐜',
      'Chào bạn! Rất vui được gặp bạn! ✨',
      'Hey! Mình là trợ lý ảo của GAPIT đây! 👋',
      'Ê! Bạn ơi! Chơi cùng mình nha! 🎉',
      'Yo! GAPIT Ant reporting for duty! 🫡',
    ];
  }

  /**
   * Show speech bubble with random text + typing effect
   * @returns {gsap.core.Timeline}
   */
  show() {
    const text = this.dialogues[Math.floor(Math.random() * this.dialogues.length)];
    this.el.classList.remove('hidden');
    this.textEl.textContent = text;

    const tl = this.gsap.timeline();

    tl.to(this.el, {
      scale: 1,
      opacity: 1,
      duration: 0.28,
      ease: 'power2.out',
    });
    tl.to({}, { duration: 0.55 });

    return tl;
  }

  /**
   * Hide speech bubble
   * @returns {gsap.core.Timeline}
   */
  hide() {
    const tl = this.gsap.timeline();
    tl.to(this.el, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.el.classList.add('hidden');
      },
    });
    return tl;
  }
}
