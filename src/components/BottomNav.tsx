import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { activeNavKey, NAV_ITEMS, type NavKey } from './navItems';

/**
 * 移动端底部导航。桌面端由 TopNav 承担，这条栏在 md 以上隐藏。
 * 默认按路径判断当前页；学习页等沉浸页面不显示。
 */
export function BottomNav({ active: forced }: { active?: NavKey }) {
  const { pathname } = useLocation();
  const active = forced ?? activeNavKey(pathname);
  if (!active) return null;

  return (
    <nav
      aria-label="底部导航"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key} className="flex-1">
              <Link
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-0.5 pb-1.5 pt-2 text-[11px] font-extrabold transition-colors ${
                  isActive ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className="relative flex h-9 w-12 items-center justify-center">
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className={`absolute inset-0 rounded-2xl ${item.activeClass}`}
                      transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                    />
                  )}
                  <Icon name={item.icon} size={22} className="relative" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
