import { Link, useLocation } from 'react-router-dom';
import { activeNavKey, NAV_ITEMS } from './navItems';

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
      className="sticky top-0 z-30 hidden border-b-[3px] border-ink bg-paper/95 backdrop-blur md:block"
    >
      <div className="mx-auto flex max-w-[880px] items-center gap-3 px-4 py-2.5">
        <Link
          to="/"
          className="mr-auto text-lg font-black leading-none tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          记忆芯
        </Link>

        <ul className="m-0 flex list-none items-center gap-1.5 p-0">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex items-center gap-1.5 rounded-sticker border-[3px] px-3 py-1.5 text-sm font-bold transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                    isActive
                      ? 'border-ink bg-brand text-white shadow-pop-sm'
                      : 'border-transparent text-ink/70 hover:border-ink/25 hover:text-ink',
                  ].join(' ')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      </div>
    </nav>
  );
}
