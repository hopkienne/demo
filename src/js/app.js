// Import CSS so Vite bundles it
import '../css/style.css';

// Import modules
import { AudioController } from './audio-controller.js';
import { FramePlayer } from './frame-player.js';
import { PanelController } from './panel-controller.js';
import { ChatbotController } from './chatbot.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const startOverlay = document.getElementById('start-overlay');
    const frameCanvas = document.getElementById('frame-canvas');
    const endFrameImg = document.getElementById('end-frame');

    const updateProgress = (ratio) => {
        progressBar.style.width = `${Math.floor(ratio * 100)}%`;
    };

    const PLAYER_TOTAL_FRAMES = 170;
    const PLAYER_TRIGGER_FRAME = 145;
    const AUDIO_SOURCE = '/audio.mp3';

    const panelCtrl = new PanelController('holo-panel', handlePanelButtonClick);
    const chatbotCtrl = new ChatbotController('chatbot', handleChatbotClose);
    const audioCtrl = new AudioController(AUDIO_SOURCE);
    const framePlayer = new FramePlayer(
      'frame-canvas',
      PLAYER_TOTAL_FRAMES,
      PLAYER_TRIGGER_FRAME,
      onFrameTrigger,
      onFrameEnd,
      updateProgress
    );

    const startExperience = async () => {
      startOverlay.disabled = true;
      framePlayer.reset();
      startOverlay.classList.add('hidden');

      try {
        await audioCtrl.play();
        framePlayer.play(() => audioCtrl.getCurrentTime());
      } catch (error) {
        console.error('Unable to start audio playback after user interaction.', error);
        startOverlay.disabled = false;
        startOverlay.classList.remove('hidden');
      }
    };

    console.log('Starting preload...');
    await Promise.all([
      framePlayer.preload(),
      audioCtrl.preload(),
    ]);

    framePlayer.reset();
    loadingScreen.classList.add('hidden');
    startOverlay.classList.remove('hidden');
    startOverlay.addEventListener('click', startExperience, { once: true });

    function onFrameTrigger() {
      frameCanvas.classList.add('fading-out');

      setTimeout(() => {
        endFrameImg.classList.add('visible');
      }, 600);

      setTimeout(() => {
        panelCtrl.show();
      }, 1400);
    }

    function onFrameEnd() {
      console.log('Animation playback complete, waiting for user input.');
    }

    function handlePanelButtonClick(sectionContext, sectionName) {
      panelCtrl.hide();
      setTimeout(() => {
          chatbotCtrl.show(sectionContext, sectionName);
      }, 300);
    }

    function handleChatbotClose() {
      panelCtrl.show();
    }
});
