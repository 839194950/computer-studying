import { motion } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'confused' | 'sleep';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  /** 不做身体动画（小尺寸 logo 用），眨眼保留 */
  still?: boolean;
}

const MOOD_ANIMATION = {
  idle: {
    y: [0, -3, 0],
    rotate: 0,
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
  },
  happy: { y: [0, -12, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.55 } },
  confused: { y: 0, rotate: [0, -7, 0], transition: { duration: 0.6 } },
  sleep: {
    y: [0, -1.5, 0],
    rotate: 0,
    transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export function Mascot({ mood = 'idle', size = 96, className, still = false }: MascotProps) {
  return (
    <motion.svg
      className={className}
      width={size}
      height={(size * 130) / 120}
      viewBox="0 0 120 130"
      fill="none"
      animate={still ? undefined : MOOD_ANIMATION[mood]}
      aria-hidden="true"
    >
      <line x1="60" y1="26" x2="60" y2="14" stroke="#241A3D" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="7" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />

      <rect x="16" y="26" width="88" height="74" rx="20" fill="#7B5CFF" stroke="#241A3D" strokeWidth="4" />
      <rect x="24" y="32" width="72" height="14" rx="7" fill="#FFFFFF" opacity="0.18" />

      <rect x="4" y="46" width="12" height="8" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="104" y="46" width="12" height="8" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="4" y="72" width="12" height="8" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="104" y="72" width="12" height="8" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="30" y="100" width="12" height="10" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="78" y="100" width="12" height="10" rx="3" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />

      {mood === 'sleep' ? (
        <>
          <path d="M38 56 q7 6 14 0" stroke="#241A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M68 56 q7 6 14 0" stroke="#241A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="45" cy="56" r="11" fill="#FFFFFF" stroke="#241A3D" strokeWidth="3" />
          <circle cx="75" cy="56" r="11" fill="#FFFFFF" stroke="#241A3D" strokeWidth="3" />
          {/* 眨眼：只缩放瞳孔，每 4 秒一次 */}
          <motion.g
            style={{ transformOrigin: '60px 58px' }}
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity }}
          >
            <circle cx="46" cy="58" r="5" fill="#241A3D" />
            <circle cx="76" cy="58" r="5" fill="#241A3D" />
            <circle cx="48" cy="56" r="1.6" fill="#FFFFFF" />
            <circle cx="78" cy="56" r="1.6" fill="#FFFFFF" />
          </motion.g>
        </>
      )}

      {mood === 'confused' ? (
        <path d="M50 82 q10 -6 20 2" stroke="#241A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M50 80 q10 8 20 0" stroke="#241A3D" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      <circle cx="30" cy="76" r="5" fill="#FF7AB5" opacity="0.85" />
      <circle cx="90" cy="76" r="5" fill="#FF7AB5" opacity="0.85" />

      {mood === 'sleep' && (
        <text x="96" y="26" fontFamily="system-ui" fontSize="16" fontWeight="800" fill="#8B85A6">
          zZ
        </text>
      )}
    </motion.svg>
  );
}
