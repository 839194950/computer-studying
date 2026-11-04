import { Link } from 'react-router-dom';

export type NavKey = 'home' | 'map' | 'stats' | 'me';

const ITEMS: { key: NavKey; to: string; label: string; icon: string }[] = [
  { key: 'home', to: '/', label: '学习', icon: 'M4 12 L12 4 L20 12 M6 10 V20 H18 V10' },
  { key: 'map', to: '/map', label: '地图', icon: 'M4 6 h16 M4 12 h16 M4 18 h10' },
  { key: 'stats', to: '/stats', label: '图谱', icon: 'M5 19 V11 M12 19 V5 M19 19 V14' },
  { key: 'me', to: '/settings', label: '我', icon: 'M12 7 a4 4 0 1 0 0.1 0 M5 20 c1.5-4 11.5-4 14 0' },
];

export function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-ink bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-[880px] items-stretch">
        {ITEMS.map((item) => {
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
