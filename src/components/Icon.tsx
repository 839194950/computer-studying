/** 统一的线性图标，24x24 视口，全部手写路径，不引图标库。 */
export type IconName =
  | 'home'
  | 'map'
  | 'chart'
  | 'user'
  | 'book'
  | 'flame'
  | 'bolt'
  | 'close'
  | 'check'
  | 'lock'
  | 'star'
  | 'search'
  | 'chip'
  | 'code'
  | 'terminal'
  | 'shield'
  | 'target'
  | 'gift'
  | 'arrow-right'
  | 'arrow-left'
  | 'sound'
  | 'mute'
  | 'play';

const PATHS: Record<IconName, string> = {
  home: 'M4 11.5 12 4.5l8 7M6.5 10v9.5h11V10M10 19.5v-5h4v5',
  map: 'M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2-6-2Zm0 0v13m6-11v13',
  chart: 'M5 19.5V12m7 7.5V5m7 14.5v-6M3.5 19.5h17',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2',
  book: 'M4.5 5.5c2.5-1 5-1 7.5.5 2.5-1.5 5-1.5 7.5-.5v13c-2.5-1-5-1-7.5.5-2.5-1.5-5-1.5-7.5-.5v-13ZM12 6v13',
  flame:
    'M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.4-2.3-5.6-3.6-7.2-.3 1.8-1.2 3-2.4 3.4.4-3.1-1.2-5.8-3.5-7.5.2 3-1.6 4.9-2.8 6.4A7.2 7.2 0 0 0 5.5 14.8C5.5 18.4 8.1 21 12 21Z',
  bolt: 'M13 3 5 13.5h6l-1 7.5 8-10.5h-6l1-7.5Z',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  lock: 'M7 10.5V8a5 5 0 0 1 10 0v2.5M5.5 10.5h13v9.5h-13zM12 14.5v2',
  star: 'm12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z',
  search: 'M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3.5V7m5-3.5V7m-5 10v3.5m5-3.5v3.5M3.5 9.5H7m-3.5 5H7m10-5h3.5m-3.5 5h3.5',
  code: 'm8.5 7.5-5 4.5 5 4.5m7-9 5 4.5-5 4.5M13.5 5l-3 14',
  terminal: 'M3.5 5h17v14h-17zM7 9.5l3 2.5-3 2.5m5 .5h5',
  shield: 'M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-2.5Zm-3 8.5 2.2 2.2L15.5 10',
  target: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0-4a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  gift: 'M4 9.5h16v4H4zM5.5 13.5h13v7h-13zM12 9.5v11M12 9.5c-1.5-3.5-5.5-4-5.5-1.5 0 1.5 2.5 1.5 5.5 1.5Zm0 0c1.5-3.5 5.5-4 5.5-1.5 0 1.5-2.5 1.5-5.5 1.5Z',
  'arrow-right': 'M4.5 12h15m-6-6 6 6-6 6',
  'arrow-left': 'M19.5 12h-15m6-6-6 6 6 6',
  sound: 'M4.5 9.5h3l5-4v13l-5-4h-3zM16 9a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11',
  mute: 'M4.5 9.5h3l5-4v13l-5-4h-3zM16 9.5l5 5m0-5-5 5',
  play: 'M8 5.5v13l10.5-6.5L8 5.5Z',
};

const FILLED: Partial<Record<IconName, boolean>> = { flame: true, bolt: true, star: true, play: true };

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** 强制实心或空心；默认按图标本身的风格 */
  filled?: boolean;
}

export function Icon({ name, size = 20, className, strokeWidth = 2.2, filled }: IconProps) {
  const solid = filled ?? FILLED[name] ?? false;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      className={className}
      aria-hidden="true"
    >
      <path
        d={PATHS[name]}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
