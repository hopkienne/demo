import './style.css';
import gsap from 'gsap';
import { GameFlow } from './GameFlow.js';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const qaMode = params.get('qa') === 'auto';
  const autoSelect = params.get('select');
  const game = new GameFlow(gsap);
  window.__GAPIT_ANT_DEMO__ = game;

  const publishQaReport = () => {
    if (!qaMode) return;

    const tiles = Array.from(document.querySelectorAll('.action-tile')).map((tile) => {
      const rect = tile.getBoundingClientRect();
      return {
        id: tile.dataset.actionId,
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        hidden: tile.classList.contains('is-hidden'),
        active: tile.classList.contains('is-active'),
      };
    });
    const antRect = document.querySelector('.ant-rig')?.getBoundingClientRect();
    const beam = document.querySelector('.ant-target-beam');
    const beamRect = beam?.getBoundingClientRect();
    const rows = new Set(tiles.map((tile) => tile.top)).size;
    const report = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      unlockHidden: document.getElementById('hand-unlock')?.classList.contains('hidden') ?? false,
      actionPanelVisible: !(document.getElementById('action-panel')?.classList.contains('hidden') ?? true),
      rows,
      tiles,
      activeTile: document.querySelector('.action-tile.is-active')?.dataset.actionId || null,
      beam: beam ? {
        width: Math.round(beamRect?.width || 0),
        height: Math.round(beamRect?.height || 0),
        opacity: Number(window.getComputedStyle(beam).opacity),
      } : null,
      antRect: antRect ? {
        left: Math.round(antRect.left),
        top: Math.round(antRect.top),
        right: Math.round(antRect.right),
        bottom: Math.round(antRect.bottom),
      } : null,
    };

    let reportNode = document.getElementById('qa-report');
    if (!reportNode) {
      reportNode = document.createElement('script');
      reportNode.id = 'qa-report';
      reportNode.type = 'application/json';
      document.body.appendChild(reportNode);
    }

    reportNode.textContent = JSON.stringify(report);
  };

  if (qaMode) {
    game.waitForUnlock = async () => {
      game.state = 'HOLD_TO_UNLOCK';
    };

    const originalDelay = game._delay.bind(game);
    game._delay = (ms) => originalDelay(Math.min(ms, 30));
  }

  game.start().then(() => {
    if (!qaMode) return;

    setTimeout(() => {
      if (autoSelect) {
        document.querySelector(`[data-action-id="${autoSelect}"]`)?.click();
      }

      setTimeout(() => {
        publishQaReport();
      }, 180);
    }, 120);
  }).catch((error) => {
    console.error('Failed to start ant demo', error);
  });
});
