// g:\zalo_mini_app\demo-sp\src\js\frame-player.js

export class FramePlayer {
  constructor(canvasId, totalFrames, triggerFrame, onTriggerReach, onEndReach, onProgress) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.totalFrames = totalFrames;
    this.triggerFrame = triggerFrame;
    this.frames = [];
    this.currentFrame = 1;
    this.isPlaying = false;
    this.fps = 24;
    this.animationFrameId = null;
    this.timeProvider = null;
    this.hasTriggered = false;
    this.hasEnded = false;

    // Callbacks
    this.onTriggerReach = onTriggerReach;
    this.onEndReach = onEndReach;
    this.onProgress = onProgress;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    // Set actual size in memory (scaled to account for extra pixel density)
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;

    // Set display size (css pixels)
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';

    // Optimize scaling for upscaled images
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    if (this.frames[this.currentFrame]) {
      this.drawFrame(this.currentFrame);
    }
  }

  getFramePath(index) {
    let logicalIndex = index;
    if (index === 170) {
      logicalIndex = 181;
    }
    const paddedIndex = logicalIndex.toString().padStart(3, '0');
    // Important for Vite: this URL must point relative to the public directory
    // so during deployment it matches the domain root
    return `/frame_sharp_strong/ezgif-frame-${paddedIndex}.jpg`;
  }

  async preload() {
    let loadedCount = 0;

    return new Promise((resolve) => {
      for (let i = 1; i <= this.totalFrames; i++) {
        const img = new Image();
        img.src = this.getFramePath(i);

        img.onload = () => {
          this.frames[i] = img;
          loadedCount++;
          if (this.onProgress) this.onProgress(loadedCount / this.totalFrames);
          if (loadedCount === this.totalFrames) resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load frame ${i}`);
          this.frames[i] = this.frames[i - 1] || new Image();
          loadedCount++;
          if (loadedCount === this.totalFrames) resolve();
        }
      }
    });
  }

  drawFrame(index) {
    const img = this.frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const iw = img.width;
    const ih = img.height;

    const scale = Math.max(cw / iw, ch / ih);
    // Use Math.round to prevent sub-pixel interpolation which causes severe blur
    const x = Math.round((cw / 2) - (iw / 2) * scale);
    const y = Math.round((ch / 2) - (ih / 2) * scale);
    const drawW = Math.round(iw * scale);
    const drawH = Math.round(ih * scale);

    this.ctx.fillStyle = '#0a0e1a';
    this.ctx.fillRect(0, 0, cw, ch);
    this.ctx.drawImage(img, x, y, drawW, drawH);
  }

  reset() {
    this.pause();
    this.currentFrame = 1;
    this.hasTriggered = false;
    this.hasEnded = false;
    this.drawFrame(this.currentFrame);
  }

  play(timeProvider) {
    this.timeProvider = timeProvider;
    this.isPlaying = true;
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  getFrameForTime(timeInSeconds) {
    const nextFrame = Math.floor(Math.max(0, timeInSeconds) * this.fps) + 1;
    return Math.min(nextFrame, this.totalFrames);
  }

  loop = () => {
    if (!this.isPlaying || !this.timeProvider) return;

    const nextFrame = this.getFrameForTime(this.timeProvider());
    const cappedFrame = Math.min(nextFrame, this.triggerFrame);

    if (cappedFrame !== this.currentFrame) {
      this.currentFrame = cappedFrame;
      this.drawFrame(this.currentFrame);
    }

    if (this.currentFrame >= this.triggerFrame) {
      this.currentFrame = this.triggerFrame;
      this.drawFrame(this.currentFrame);
      this.pause();
      if (!this.hasTriggered) {
        this.hasTriggered = true;
        if (this.onTriggerReach) this.onTriggerReach();
      }
      return;
    }

    if (nextFrame >= this.totalFrames && !this.hasEnded) {
      this.hasEnded = true;
      if (this.onEndReach) this.onEndReach();
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
