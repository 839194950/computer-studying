import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScreenProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** 有底部导航的页面留出安全距离 */
  withNav?: boolean;
  /** 页面标题旁边的右侧内容，比如统计数字 */
  aside?: ReactNode;
  className?: string;
}

/**
 * 页面骨架。每次进入页面时内容轻轻上浮淡入。
 * 只动 main 自身，不包住 fixed 元素（transform 会改变 fixed 的定位参照）。
 */
export function Screen({ title, subtitle, children, withNav = true, aside, className = '' }: ScreenProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-[920px] px-4 pt-5 md:pt-8 ${
        withNav ? 'pb-32 md:pb-12' : 'pb-12'
      } ${className}`}
    >
      {title && (
        <header className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-black tracking-tight text-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-sm font-semibold text-muted">{subtitle}</p>}
          </div>
          {aside}
        </header>
      )}
      {children}
    </motion.main>
  );
}
