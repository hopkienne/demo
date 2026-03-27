import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

/** Timestamp (seconds) at which the ant character has settled and buttons should appear */
const TRIGGER_TIME = 1.5;

export interface VideoPlayerHandle {
  restart: () => void;
  setMuted: (m: boolean) => void;
}

interface VideoPlayerProps {
  /** Called once when playback crosses the trigger timestamp */
  onTrigger: () => void;
  /** Called when the video naturally reaches the end */
  onEnded: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ onTrigger, onEnded }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasFiredRef = useRef(false);

    useImperativeHandle(ref, () => ({
      restart() {
        const v = videoRef.current;
        if (!v) return;
        hasFiredRef.current = false;
        v.currentTime = 0;
        v.play().catch(() => {});
      },
      setMuted(m: boolean) {
        if (videoRef.current) videoRef.current.muted = m;
      },
    }));

    /** Watch playback position to fire the trigger once */
    const handleTimeUpdate = useCallback(() => {
      const v = videoRef.current;
      if (!v || hasFiredRef.current) return;
      if (v.currentTime >= TRIGGER_TIME) {
        hasFiredRef.current = true;
        onTrigger();
      }
    }, [onTrigger]);

    /** Auto-play on mount */
    useEffect(() => {
      videoRef.current?.play().catch(() => {});
    }, []);

    return (
      <video
        ref={videoRef}
        src="/video.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
