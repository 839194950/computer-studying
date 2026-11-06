import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  label?: string;
  stroke?: number;
  /** 进度色，默认绿色 */
  color?: string;
  track?: string;
  /** 自定义中间内容；不传就显示数值 + label */
  children?: ReactNode;
}

/** 环形进度。环本身从 0 平滑画到目标值，中间的数字直接显示终值。 */
export function ProgressRing({
  value,
  size = 96,
  label = '记牢了',
  stroke = 12,
  color = '#2FCB7E',
  track = '#EEEBF7',
  children,
}: ProgressRingProps) {
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = Math.max(0, Math.min(100, safe));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        {clamped > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <>
            <span className="tabular text-xl font-black leading-none text-ink">{Math.round(clamped)}</span>
            <span className="mt-1 text-[10px] font-bold text-muted">{label}</span>
          </>
        )}
      </div>
    </div>
  );
}
