import type { CSSProperties, ReactNode } from 'react';

/** 所有概念图共用的入参：focus 为空表示整图正常显示。 */
export interface DiagramProps {
  className?: string;
  focus?: string[];
}

export const INK = '#2B2347';
/** 细线、括号、装饰线的颜色：比正文浅，免得抢主体 */
export const LINE = '#8E84B3';
export const PAPER = '#FFF8EE';
export const BRAND = '#7B5CFF';
export const BRAND_SOFT = '#EEE9FF';
export const MINT = '#2ECC8F';
export const MINT_SOFT = '#DDFBEF';
export const SUN = '#FFD23F';
export const SUN_SOFT = '#FFF3D1';
export const PINK = '#FF7AB5';
export const PINK_SOFT = '#FFE8F2';
export const SKY = '#5AD2FF';
export const SKY_SOFT = '#DFF6FF';
export const MUTED = '#8B85A6';

/**
 * 每种底色配一条描边色和一条"唇边"色（盒子底下那道立体厚度）。
 * 不在表里的颜色按比例往深紫里混，保证任何颜色都有一套能看的立体感。
 */
const SHADES: Record<string, [stroke: string, lip: string]> = {
  '#FFFFFF': ['#E2DCF2', '#D6CFEA'],
  [PAPER]: ['#F0E0C4', '#E6D2AE'],
  [BRAND_SOFT]: ['#D5CAFF', '#BEAEFF'],
  [MINT_SOFT]: ['#A6EACD', '#86DDB8'],
  [SUN_SOFT]: ['#F9DD8C', '#F2CB62'],
  [PINK_SOFT]: ['#FFC2DC', '#FFA6CB'],
  [SKY_SOFT]: ['#A6E2F9', '#82D3F5'],
  [BRAND]: ['#5A3DE6', '#4A2FCC'],
  [MINT]: ['#1FA872', '#168C5E'],
  [SUN]: ['#E8B400', '#CC9E00'],
  [PINK]: ['#E04B8A', '#C73A77'],
  [SKY]: ['#1A9FD8', '#1489BD'],
};

function mix(hex: string, target: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = p(hex);
  const b = p(target);
  if (a.some(Number.isNaN) || b.some(Number.isNaN)) return hex;
  return `#${a
    .map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function shadeOf(fill: string): [string, string] {
  const key = fill.toUpperCase();
  const hit = Object.entries(SHADES).find(([k]) => k.toUpperCase() === key);
  if (hit) return hit[1];
  if (!/^#[0-9a-f]{6}$/i.test(fill)) return ['#E2DCF2', '#D6CFEA'];
  return [mix(fill, '#3B2A80', 0.22), mix(fill, '#3B2A80', 0.34)];
}

interface PartProps {
  id: string;
  focus?: string[];
  children: ReactNode;
}

/**
 * 图元分组：没被点到的部分淡出，被点到的部分轻微放大并带一圈柔光。
 * 内层 g 负责入场动画，外层负责聚焦，两者的 opacity/transform 互不覆盖。
 */
export function Part({ id, focus, children }: PartProps) {
  const active = !!focus && focus.length > 0;
  const on = active && focus.includes(id);
  const cls = active ? (on ? 'dg-part dg-on' : 'dg-part dg-dim') : 'dg-part';
  return (
    <g className={cls}>
      <g className="dg-enter">{children}</g>
    </g>
  );
}

interface LabelProps {
  x: number;
  y: number;
  children: ReactNode;
  fill?: string;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  mono?: boolean;
  weight?: number;
}

const SANS = "'Nunito Variable', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";

/** 图上的说明文字，统一字重与字体，避免每张图各写一套。 */
export function Label({
  x,
  y,
  children,
  fill = INK,
  size = 10,
  anchor = 'middle',
  mono = false,
  weight = 800,
}: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      fontSize={size}
      fontWeight={mono ? Math.min(weight, 700) : weight}
      fontFamily={mono ? MONO : SANS}
    >
      {children}
    </text>
  );
}

/**
 * 立体盒子：浅描边 + 底部一道"唇边" + 顶部一抹高光，和界面上的卡片按钮同一套语言。
 * strokeWidth 保留旧参数只为兼容，实际描边统一偏细。
 */
export function Box({
  x,
  y,
  w,
  h,
  fill = '#FFFFFF',
  rx = 10,
  strokeWidth = 3,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  rx?: number;
  strokeWidth?: number;
  dashed?: boolean;
}) {
  const [stroke, lip] = shadeOf(fill);
  const r = Math.min(rx, h / 2, w / 2);
  const sw = Math.max(1.2, Math.min(1.8, strokeWidth * 0.6));
  if (dashed) {
    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill={fill}
        fillOpacity={0.75}
        stroke={lip}
        strokeWidth={sw}
        strokeDasharray="4 3"
        className="dg-march"
      />
    );
  }
  const depth = h >= 40 ? 3 : h >= 18 ? 2.2 : 1.4;
  return (
    <g>
      <rect x={x} y={y + depth} width={w} height={h} rx={r} fill={lip} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={sw} />
      {h >= 16 && w >= 16 && (
        <rect
          x={x + 2}
          y={y + 1.6}
          width={w - 4}
          height={Math.min(h * 0.38, 14)}
          rx={Math.max(0, r - 2)}
          fill="#FFFFFF"
          opacity={0.38}
        />
      )}
    </g>
  );
}

const MARKER_COLORS = [INK, LINE, BRAND, MINT, SUN, PINK, SKY, '#C1437E', '#D9A21B'];

/** 箭头 marker 与渐变定义，每张图引一次。 */
export function DiagramDefs() {
  return (
    <defs>
      {MARKER_COLORS.map((color) => (
        <marker
          key={color}
          id={`arrow-${color.replace('#', '')}`}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M1.5 1.2 L8.5 5 L1.5 8.8 Z" fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round" />
        </marker>
      ))}
      <radialGradient id="dg-glow">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/**
 * 带箭头的连线：底线压淡，上面跑一颗光点表示流向。
 * pathLength=100 让光点动画与路径实际长度无关。
 */
export function Arrow({
  d,
  color = LINE,
  dashed = false,
  width = 2.6,
  flow = true,
  delay = 0,
}: {
  d: string;
  color?: string;
  dashed?: boolean;
  width?: number;
  flow?: boolean;
  delay?: number;
}) {
  const known = MARKER_COLORS.includes(color);
  const marker = known ? color : LINE;
  const sw = Math.max(1.4, width * 0.72);
  const dot = color === LINE || color === INK ? BRAND : color;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={dashed ? 0.75 : 0.5}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '4 4' : undefined}
        className={dashed ? 'dg-march' : undefined}
        markerEnd={`url(#arrow-${marker.replace('#', '')})`}
      />
      {flow && !dashed && (
        <path
          d={d}
          pathLength={100}
          fill="none"
          stroke={dot}
          strokeWidth={sw + 1.4}
          strokeLinecap="round"
          strokeDasharray="5 95"
          className="dg-flow"
          style={{ animationDelay: `${delay}s` }}
        />
      )}
    </g>
  );
}

export type AnimName = 'pulse' | 'float' | 'spin' | 'blink' | 'travel' | 'ripple' | 'grow' | 'pop' | 'shake' | 'flow';

/**
 * 给任意 SVG 元素挂一个循环动画。动画只走 CSS，所以"降低动效"会一并关掉。
 * travel 用 dx/dy 指定位移；静止状态就是元素本来的位置。
 */
export function anim(
  name: AnimName,
  opts: { dur?: number; delay?: number; dx?: number; dy?: number } = {},
): { className: string; style: CSSProperties } {
  const style: Record<string, string> = {};
  if (opts.dur !== undefined) style.animationDuration = `${opts.dur}s`;
  if (opts.delay !== undefined) style.animationDelay = `${opts.delay}s`;
  if (opts.dx !== undefined) style['--dx'] = `${opts.dx}px`;
  if (opts.dy !== undefined) style['--dy'] = `${opts.dy}px`;
  return { className: `dg-${name}`, style: style as CSSProperties };
}

/** 沿路径跑的小光点，用来表现数据/请求在流动；不带箭头。 */
export function Flow({
  d,
  color = BRAND,
  width = 3,
  dur = 2.4,
  delay = 0,
  dash = 6,
}: {
  d: string;
  color?: string;
  width?: number;
  dur?: number;
  delay?: number;
  dash?: number;
}) {
  return (
    <path
      d={d}
      pathLength={100}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${dash} ${100 - dash}`}
      {...anim('flow', { dur, delay })}
    />
  );
}

/** 一圈向外扩散的波纹，标注"这里正在发生事情"。 */
export function Ripple({ cx, cy, r, color = BRAND, delay = 0, dur = 2.2 }: { cx: number; cy: number; r: number; color?: string; delay?: number; dur?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.6} {...anim('ripple', { delay, dur })} />;
}
