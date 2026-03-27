import { useRef, useState, useCallback, useEffect } from 'react';
import VideoPlayer, { type VideoPlayerHandle } from './components/VideoPlayer';
import ActionButtons from './components/ActionButtons';
import MuteToggle from './components/MuteToggle';

/** How long (ms) the buttons stay on screen before auto-hiding */
const INACTIVITY_TIMEOUT = 5000;

type Phase = 'playing' | 'buttons_visible' | 'interacted';

export default function App() {
  const videoRef = useRef<VideoPlayerHandle>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<Phase>('playing');
  const [showButtons, setShowButtons] = useState(false);
  const [muted, setMuted] = useState(true);

  /** Clear the inactivity timer */
  const clearInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** Restart the full loop: hide buttons → restart video */
  const restartLoop = useCallback(() => {
    clearInactivityTimer();
    setShowButtons(false);
    setPhase('playing');

    // Small delay to let exit animation finish before restarting video
    setTimeout(() => {
      videoRef.current?.restart();
    }, 500);
  }, [clearInactivityTimer]);

  /** Called when playback crosses the trigger timestamp (~1.5s) */
  const handleTrigger = useCallback(() => {
    if (phase !== 'playing') return;

    setPhase('buttons_visible');
    setShowButtons(true);

    // Start inactivity countdown
    timeoutRef.current = setTimeout(() => {
      restartLoop();
    }, INACTIVITY_TIMEOUT);
  }, [phase, restartLoop]);

  /** Called when the video reaches the end */
  const handleVideoEnded = useCallback(() => {
    // If buttons are still showing, let the timeout handle restart.
    // If video ended naturally without trigger (shouldn't happen), restart.
    if (phase === 'playing') {
      restartLoop();
    }
  }, [phase, restartLoop]);

  /** Called when user clicks one of the four buttons */
  const handleInteract = useCallback(
    (buttonId: string) => {
      clearInactivityTimer();
      setPhase('interacted');
      setShowButtons(false);

      // Placeholder action — log and show a brief overlay
      console.log(`🐜 Button clicked: ${buttonId}`);
      alert(`Bạn đã chọn: ${buttonId.toUpperCase()}! 🎉`);

      // After interaction, restart the loop for continuous experience
      setTimeout(() => restartLoop(), 500);
    },
    [clearInactivityTimer, restartLoop]
  );

  /** Toggle mute state */
  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      videoRef.current?.setMuted(next);
      return next;
    });
  }, []);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => clearInactivityTimer();
  }, [clearInactivityTimer]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Full-screen video */}
      <VideoPlayer
        ref={videoRef}
        onTrigger={handleTrigger}
        onEnded={handleVideoEnded}
      />

      {/* Subtle dark gradient overlay at bottom for button readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[5]" />

      {/* Action buttons */}
      <ActionButtons visible={showButtons} onInteract={handleInteract} />

      {/* Mute toggle */}
      <MuteToggle muted={muted} onToggle={toggleMute} />
    </div>
  );
}
