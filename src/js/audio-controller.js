export class AudioController {
  constructor(src, { muted = false } = {}) {
    this.audio = new Audio(src);
    this.audio.preload = 'auto';
    this.audio.playsInline = true;
    this.audio.muted = muted;
  }

  async preload() {
    if (this.audio.readyState >= 4) return;

    await new Promise((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(this.audio.error || new Error('Failed to load audio'));
      };

      const cleanup = () => {
        this.audio.removeEventListener('canplaythrough', onReady);
        this.audio.removeEventListener('loadeddata', onReady);
        this.audio.removeEventListener('error', onError);
      };

      this.audio.addEventListener('canplaythrough', onReady, { once: true });
      this.audio.addEventListener('loadeddata', onReady, { once: true });
      this.audio.addEventListener('error', onError, { once: true });
      this.audio.load();
    });
  }

  async play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  restart() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setCurrentTime(timeInSeconds) {
    const safeTime = Math.max(0, timeInSeconds);
    this.audio.currentTime = safeTime;
  }

  setMuted(muted) {
    this.audio.muted = muted;
  }

  isPaused() {
    return this.audio.paused;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  onEnded(callback) {
    this.audio.addEventListener('ended', callback);
  }
}
