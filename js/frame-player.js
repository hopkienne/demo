// g:\zalo_mini_app\demo-sp\js\frame-player.js

class FramePlayer {
  constructor(canvasId, totalFrames, triggerFrame, onTriggerReach, onEndReach, onProgress) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.totalFrames = totalFrames;
    this.triggerFrame = triggerFrame;
    this.frames = [];
    this.currentFrame = 1;
    this.isPlaying = false;
    this.fps = 24;
    this.frameInterval = 1000 / this.fps;
    this.lastDrawTime = 0;
    
    // Callbacks
    this.onTriggerReach = onTriggerReach; // When reaches frame 145
    this.onEndReach = onEndReach;         // When reaches final frame
    this.onProgress = onProgress;         // For loading progress

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.frames[this.currentFrame]) {
      this.drawFrame(this.currentFrame);
    }
  }

  getFramePath(index) {
    // Generate paths format: ezgif-frame-001.jpg -> ezgif-frame-169.jpg, and 181
    // The requirement: sequential playback skipping gap from 169 to 181
    
    let logicalIndex = index;
    if (index === 170) {
      logicalIndex = 181; // Map the 170th logical frame to frame 181 image
    }
    
    const paddedIndex = logicalIndex.toString().padStart(3, '0');
    return `frame/ezgif-frame-${paddedIndex}.jpg`;
  }

  async preload() {
    let loadedCount = 0;
    
    return new Promise((resolve) => {
      for (let i = 1; i <= this.totalFrames; i++) {
        const img = new Image();
        img.src = this.getFramePath(i);
        
        // When loaded
        img.onload = () => {
          this.frames[i] = img;
          loadedCount++;
          
          if (this.onProgress) {
            this.onProgress(loadedCount / this.totalFrames);
          }
          
          if (loadedCount === this.totalFrames) {
            resolve();
          }
        };

        // Fallback for missing frames (e.g if naming is a bit off)
        img.onerror = () => {
          console.warn(`Failed to load frame ${i}`);
          this.frames[i] = this.frames[i-1] || new Image(); // Fallback to previous frame
          loadedCount++;
          if (loadedCount === this.totalFrames) resolve();
        }
      }
    });
  }

  drawFrame(index) {
    const img = this.frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Draw image covering the whole canvas (object-fit: cover equivalent)
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const iw = img.width;
    const ih = img.height;
    
    const scale = Math.max(cw / iw, ch / ih);
    const x = (cw / 2) - (iw / 2) * scale;
    const y = (ch / 2) - (ih / 2) * scale;
    
    this.ctx.fillStyle = '#0a0e1a'; // Background matching design system
    this.ctx.fillRect(0, 0, cw, ch);
    
    this.ctx.drawImage(img, x, y, iw * scale, ih * scale);
  }

  play() {
    this.isPlaying = true;
    this.lastDrawTime = performance.now();
    this.loop();
  }

  pause() {
    this.isPlaying = false;
  }

  loop(timestamp = 0) {
    if (!this.isPlaying) return;

    const elapsed = timestamp - this.lastDrawTime;

    if (elapsed > this.frameInterval) {
      this.currentFrame++;
      
      // Check if end reached
      if (this.currentFrame >= this.totalFrames) {
        this.currentFrame = this.totalFrames;
        this.drawFrame(this.currentFrame);
        this.pause();
        if (this.onEndReach) this.onEndReach();
        return;
      }

      this.drawFrame(this.currentFrame);
      this.lastDrawTime = timestamp - (elapsed % this.frameInterval);

      // Check for trigger frame
      if (this.currentFrame === this.triggerFrame) {
        if (this.onTriggerReach) this.onTriggerReach();
      }
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}
