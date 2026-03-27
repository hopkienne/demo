import { useEffect, useState } from 'react';

/** Button definitions — extend with real actions later */
const BUTTONS = [
  {
    id: 'explore',
    label: '🔍 Khám phá',
    gradient: 'from-violet-500 to-indigo-600',
    hoverGradient: 'hover:from-violet-400 hover:to-indigo-500',
  },
  {
    id: 'learn',
    label: '📚 Tìm hiểu',
    gradient: 'from-cyan-500 to-blue-600',
    hoverGradient: 'hover:from-cyan-400 hover:to-blue-500',
  },
  {
    id: 'play',
    label: '🎮 Chơi ngay',
    gradient: 'from-emerald-500 to-teal-600',
    hoverGradient: 'hover:from-emerald-400 hover:to-teal-500',
  },
  {
    id: 'gift',
    label: '🎁 Nhận quà',
    gradient: 'from-amber-500 to-orange-600',
    hoverGradient: 'hover:from-amber-400 hover:to-orange-500',
  },
] as const;

interface ActionButtonsProps {
  visible: boolean;
  onInteract: (buttonId: string) => void;
}

export default function ActionButtons({ visible, onInteract }: ActionButtonsProps) {
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'leaving'>('hidden');

  useEffect(() => {
    if (visible) {
      setPhase('entering');
      // After entry animation completes, switch to stable "visible" phase
      const timer = setTimeout(() => setPhase('visible'), 650);
      return () => clearTimeout(timer);
    } else if (phase === 'visible' || phase === 'entering') {
      setPhase('leaving');
      const timer = setTimeout(() => setPhase('hidden'), 450);
      return () => clearTimeout(timer);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'hidden') return null;

  const isEntering = phase === 'entering';
  const isLeaving = phase === 'leaving';

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16 md:pb-20 pointer-events-none z-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 px-4 sm:px-8 max-w-lg w-full pointer-events-auto">
        {BUTTONS.map((btn, i) => (
          <button
            key={btn.id}
            id={`action-btn-${btn.id}`}
            onClick={() => onInteract(btn.id)}
            className={`
              relative overflow-hidden rounded-2xl px-4 py-3 sm:px-6 sm:py-4
              bg-gradient-to-br ${btn.gradient} ${btn.hoverGradient}
              text-white font-semibold text-sm sm:text-base
              shadow-lg shadow-black/30
              backdrop-blur-sm
              transition-all duration-200
              hover:scale-105 hover:shadow-xl hover:shadow-black/40
              active:scale-95
              cursor-pointer
              ${isEntering ? 'animate-float-up' : ''}
              ${isLeaving ? 'animate-float-down' : ''}
              ${phase === 'visible' ? 'animate-bob' : ''}
              animate-pulse-glow
            `}
            style={{
              animationDelay: isEntering ? `${i * 0.1}s` : isLeaving ? `${(3 - i) * 0.08}s` : undefined,
              animationFillMode: 'both',
            }}
          >
            {/* Glass overlay */}
            <span className="absolute inset-0 rounded-2xl bg-white/10 pointer-events-none" />
            <span className="relative z-10">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
