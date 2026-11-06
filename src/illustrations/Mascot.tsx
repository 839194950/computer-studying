import { useContext, useId } from 'react';
import { motion, MotionConfigContext, useReducedMotion } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'confused' | 'sleep';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  /** 不做身体动画（小尺寸 logo 用），眨眼保留；降低动效时全部静止。 */
  still?: boolean;
}

const MOOD_ANIMATION = {
  idle: {
    y: [0, -3, 0], rotate: 0,
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const },
  },
  happy: { y: [0, -6, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.55 } },
  confused: { y: 0, rotate: [0, -5, 0], transition: { duration: 0.6 } },
  sleep: {
    y: [0, -1.5, 0], rotate: 0,
    transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export function Mascot({ mood = 'idle', size = 96, className, still = false }: MascotProps) {
  const id = useId();
  const systemReduced = useReducedMotion();
  const { reducedMotion } = useContext(MotionConfigContext);
  const reduced = reducedMotion === 'always' || !!systemReduced;
  const paint = (name: string) => `url(#${id}-${name})`;
  const eyes = mood === 'sleep'
    ? 'M40 61 Q45 65 50 61 M70 61 Q75 65 80 61'
    : mood === 'happy'
      ? 'M40 62 Q45 54 50 62 M70 62 Q75 54 80 62'
      : mood === 'confused'
        ? 'M42 59 L48 59 M73 56 L77 60'
        : 'M44 57 L44 63 M76 57 L76 63';
  const mouth = mood === 'sleep' ? 'M57 77 L63 77'
    : mood === 'confused' ? 'M55 77 Q60 74 65 76'
      : mood === 'happy' ? 'M52 74 Q60 85 68 74' : 'M54 75 Q60 81 66 75';

  return (
    <motion.svg
      className={className}
      width={size}
      height={(size * 130) / 120}
      viewBox="0 0 120 130"
      fill="none"
      initial={false}
      animate={still || reduced ? { y: 0, rotate: 0, transition: { duration: 0 } } : MOOD_ANIMATION[mood]}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-shell`} x1="22" y1="23" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C6B6EA" /><stop offset="0.35" stopColor="#AA8CD6" />
          <stop offset="0.7" stopColor="#9270C2" /><stop offset="1" stopColor="#715399" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="60" y1="25" x2="60" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A58ACB" /><stop offset="1" stopColor="#533970" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="30" y1="38" x2="91" y2="91" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C4B89" /><stop offset="0.5" stopColor="#8766AA" /><stop offset="1" stopColor="#D0B4EC" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="37" y1="40" x2="85" y2="91" gradientUnits="userSpaceOnUse">
          <stop stopColor="#45334F" /><stop offset="0.5" stopColor="#291D35" /><stop offset="1" stopColor="#1E172B" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F6E9CE" /><stop offset="0.4" stopColor="#D9BF8E" />
          <stop offset="0.72" stopColor="#B59563" /><stop offset="1" stopColor="#E8D1A3" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="39" y1="39" x2="64" y2="73" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEE1FF" stopOpacity="0.22" /><stop offset="1" stopColor="#EEE1FF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`}>
          <stop stopColor="#FFF1C5" /><stop offset="0.45" stopColor="#F8CF7E" /><stop offset="1" stopColor="#C58B42" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#49335E" stopOpacity="0.2" /><stop offset="1" stopColor="#49335E" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-80%" width="200%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <ellipse cx="60" cy="115" rx="39" ry="6" fill={paint('shadow')} />
      <g fill={paint('gold')}>
        {[44, 62, 80].map((y) => (
          <g key={y}>
            <rect x="7" y={y} width="13" height="7" rx="3.2" />
            <rect x="100" y={y} width="13" height="7" rx="3.2" />
          </g>
        ))}
        {[37, 56, 75].map((x) => (
          <g key={x}>
            <rect x={x} y="17" width="8" height="13" rx="3.5" />
            <rect x={x} y="98" width="8" height="13" rx="3.5" />
          </g>
        ))}
      </g>
      <rect x="16" y="25" width="88" height="82" rx="25" fill={paint('edge')} />
      <rect x="16" y="22" width="88" height="82" rx="25" fill={paint('shell')} />
      <path d="M22 46 Q22 27 42 27 H77 Q90 27 96 38" stroke="#F4E9FF" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 96 Q34 100 44 100 H78 Q91 100 97 89" stroke="#654780" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="25" y="36" width="70" height="57" rx="19" fill={paint('rim')} />
      <rect x="27" y="38" width="66" height="53" rx="17" fill={paint('glass')} />
      <path d="M44 39 H76 Q90 39 91 53 Q64 45 29 66 V55 Q29 39 44 39Z" fill={paint('shine')} />
      <path d="M32 48 Q36 41 45 41 H72" stroke="#E7D5F4" strokeOpacity="0.18" strokeLinecap="round" />

      <motion.g
        style={{ transformOrigin: '60px 61px' }}
        animate={reduced || mood === 'sleep' ? { scaleY: 1 } : { scaleY: [1, 1, 0.12, 1] }}
        transition={reduced || mood === 'sleep' ? { duration: 0 } : { duration: 4.6, times: [0, 0.93, 0.96, 1], repeat: Infinity }}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={eyes} stroke="#9EF5D7" strokeWidth="5" opacity="0.45" filter={paint('glow')} />
        <path d={eyes} stroke="#D9FFF0" strokeWidth={mood === 'idle' ? 4 : 2.8} />
      </motion.g>
      <path d={mouth} stroke="#ACEDD6" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="82" cy="30" r="3.3" fill="#84628E" />
      <circle cx="82" cy="30" r="2.3" fill={paint('lamp')} opacity={mood === 'sleep' ? 0.55 : 1} />
      <path d="M48 98 H65" stroke="#E6D6F5" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}
