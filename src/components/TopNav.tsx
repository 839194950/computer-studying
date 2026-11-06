import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { StatChips } from './StatChips';
import { activeNavKey, NAV_ITEMS } from './navItems';
import { Mascot } from '../illustrations/Mascot';

/**
 * 桌面端导航。移动端用底部栏（BottomNav），这里只在 md 以上出现。
 * 学习页不显示，避免打断答题流程。
 */
export function TopNav() {
  const { pathname } = useLocation();
  const active = activeNavKey(pathname);
  if (!active) return null;

  return (
    <nav
      aria-label="主导航"
      className="sticky top-0 z-30 hidden border-b-2 border-line bg-white/85 backdrop-blur-md md:block"
    >
      <div className="mx-auto flex max-w-[920px] items-center gap-4 px-4 py-2.5">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl text-lg font-black tracking-tight text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
        >
          <Mascot size={30} mood="idle" still />
          记忆芯
        </Link>
        <ul className="m-0 flex list-none items-center gap-1 p-0">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold transition-colors',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30',
                    isActive ? 'text-brand-dark' : 'text-muted hover:bg-paper hover:text-ink',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.span
                      layoutId="top-nav-pill"
                      className="absolute inset-0 rounded-xl border-2 border-[#DCD3FF] bg-brand-soft"
                      transition={{ type: 'spring', stiffness: 520, damping: 36 }}
                    />
                  )}
                  <Icon name={item.icon} size={18} className="relative" />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="ml-auto">
          <StatChips compact />
        </div>
      </div>
    </nav>
  );
}
