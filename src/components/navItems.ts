export type NavKey = 'home' | 'map' | 'stats' | 'me';

export interface NavItem {
  key: NavKey;
  to: string;
  label: string;
  /** 24x24 视口内的描边路径 */
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', to: '/', label: '学习', icon: 'M4 12 L12 4 L20 12 M6 10 V20 H18 V10' },
  { key: 'map', to: '/map', label: '地图', icon: 'M4 6 h16 M4 12 h16 M4 18 h10' },
  { key: 'stats', to: '/stats', label: '图谱', icon: 'M5 19 V11 M12 19 V5 M19 19 V14' },
  { key: 'me', to: '/settings', label: '我', icon: 'M12 7 a4 4 0 1 0 0.1 0 M5 20 c1.5-4 11.5-4 14 0' },
];

/**
 * 学习页是沉浸模式（做完就退出），不给导航留入口。
 * 其余页面按路径反推当前 tab，顶部栏与底部栏共用这一份判断。
 */
export function activeNavKey(pathname: string): NavKey | null {
  if (pathname === '/study') return null;
  return NAV_ITEMS.find((item) => item.to === pathname)?.key ?? null;
}
