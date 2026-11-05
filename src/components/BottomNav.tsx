import { Link } from 'react-router-dom';
import { NAV_ITEMS, type NavKey } from './navItems';

/**
 * 移动端底部导航。桌面端由 TopNav 承担，这条栏在 md 以上隐藏。
 * active 由页面显式传入，保证学习页等不带导航的页面不会被误高亮。
 */
export function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav
      aria-label="底部导航"
      className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-ink bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-[880px] items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key} className="flex-1">
              <Link
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] font-bold ${
                  isActive ? 'text-brand' : 'text-muted'
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d={item.icon}
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
