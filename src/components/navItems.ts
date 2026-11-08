import type { IconName } from './Icon';

export type NavKey = 'home' | 'map' | 'wiki' | 'stats' | 'me';

export interface NavItem {
  key: NavKey;
  to: string;
  label: string;
  icon: IconName;
  /** 选中时图标底色 */
  activeClass: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', to: '/', label: '学习', icon: 'home', activeClass: 'bg-brand text-white' },
  { key: 'map', to: '/map', label: '地图', icon: 'map', activeClass: 'bg-mint text-white' },
  { key: 'wiki', to: '/wiki', label: '百科', icon: 'book', activeClass: 'bg-sky text-white' },
  { key: 'stats', to: '/stats', label: '图谱', icon: 'chart', activeClass: 'bg-flame text-white' },
  { key: 'me', to: '/settings', label: '我', icon: 'user', activeClass: 'bg-pink text-white' },
];

/**
 * 学习页是沉浸模式（做完就退出），不给导航留入口。
 * 其余页面按路径反推当前 tab，顶部栏与底部栏共用这一份判断。
 * 百科有详情子页（/wiki/:id），按前缀匹配。
 */
export function activeNavKey(pathname: string): NavKey | null {
  if (pathname === '/study') return null;
  if (pathname === '/' || pathname === '/labs' || pathname.startsWith('/labs/')) return 'home';
  return NAV_ITEMS.find((item) => item.to !== '/' && (pathname === item.to || pathname.startsWith(`${item.to}/`)))?.key ?? null;
}
