interface MuteToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export default function MuteToggle({ muted, onToggle }: MuteToggleProps) {
  return (
    <button
      id="mute-toggle"
      onClick={onToggle}
      className="
        absolute top-4 right-4 z-20
        w-10 h-10 sm:w-12 sm:h-12
        flex items-center justify-center
        rounded-full
        bg-black/40 backdrop-blur-md
        text-white text-lg sm:text-xl
        border border-white/20
        hover:bg-white/20 hover:scale-110
        active:scale-95
        transition-all duration-200
        animate-fade-in
        cursor-pointer
      "
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
