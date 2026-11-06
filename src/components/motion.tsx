import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion } from 'framer-motion';

/** 依次上浮出现的区块。delay 以秒计，通常传 index * 0.05。 */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 数字滚动。首次渲染直接显示 from（默认就是终值，不闪），
 * 之后值变化时从旧值滚到新值。
 */
export function CountUp({
  value,
  from,
  duration = 0.8,
  className,
}: {
  value: number;
  from?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from ?? value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const start = shown.current;
    if (start === value) {
      node.textContent = String(value);
      return;
    }
    const controls = animate(start, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shown.current = Math.round(v);
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {from ?? value}
    </span>
  );
}
