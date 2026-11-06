import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const COLORS = ['#7B5CFF', '#2FCB7E', '#FFC530', '#FF6B9A', '#33B6F5', '#FF9A1F'];

interface Piece {
  x: number;
  drift: number;
  rotate: number;
  delay: number;
  duration: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
}

/** 纸屑庆祝。挂到 body 上，不受页面布局影响；动画结束后自然落出屏幕。 */
export function Confetti({ count = 56, seed = 1 }: { count?: number; seed?: number }) {
  const pieces = useMemo<Piece[]>(() => {
    // 简单的伪随机，同一个 seed 每次渲染一致
    let s = seed * 9301 + 49297;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      drift: (rand() - 0.5) * 160,
      rotate: (rand() - 0.5) * 900,
      delay: rand() * 0.35,
      duration: 2.2 + rand() * 1.4,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      w: 7 + rand() * 7,
      h: 10 + rand() * 8,
      round: rand() > 0.7,
    }));
  }, [count, seed]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.x}%`,
            width: p.round ? p.w : p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? 999 : 3,
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', x: p.drift, rotate: p.rotate, opacity: [1, 1, 0.9] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.6, 0.45, 1] }}
        />
      ))}
    </div>,
    document.body,
  );
}
