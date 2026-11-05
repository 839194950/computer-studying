import type { ReactNode } from 'react';

/** 所有概念图共用的入参：focus 为空表示整图正常显示。 */
export interface DiagramProps {
  className?: string;
  focus?: string[];
}

export const INK = '#241A3D';
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

interface PartProps {
  id: string;
  focus?: string[];
  children: ReactNode;
}

/** 图元分组：没被点到的部分淡出，注意力只落在正在讲的那块。 */
export function Part({ id, focus, children }: PartProps) {
  const dim = !!focus && focus.length > 0 && !focus.includes(id);
  return (
    <g style={{ opacity: dim ? 0.16 : 1, transition: 'opacity 240ms ease-out' }}>{children}</g>
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

/** 图上的说明文字，统一字重与字体，避免每张图各写一套。 */
export function Label({
  x,
  y,
  children,
  fill = INK,
  size = 10,
  anchor = 'middle',
  mono = false,
  weight = 700,
}: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      fontSize={size}
      fontWeight={weight}
      fontFamily={mono ? 'ui-monospace, monospace' : 'system-ui, -apple-system, sans-serif'}
    >
      {children}
    </text>
  );
}

/** 粗描边盒子，图的骨架单元。 */
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
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={fill}
      stroke={INK}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '5 4' : undefined}
    />
  );
}

/** 箭头 marker 定义，每张图引一次，保证连线末端有明确的指向。 */
export function DiagramDefs() {
  return (
    <defs>
      {[INK, BRAND, MINT, SUN, PINK, SKY].map((color) => (
        <marker
          key={color}
          id={`arrow-${color.replace('#', '')}`}
          viewBox="0 0 10 10"
          refX="7.5"
          refY="5"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto-start-reverse"
        >
          <path
            d="M1.5 1.5 L8 5 L1.5 8.5"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      ))}
    </defs>
  );
}

/** 带箭头的连线，用于表达方向与流向。 */
export function Arrow({
  d,
  color = INK,
  dashed = false,
  width = 2.6,
}: {
  d: string;
  color?: string;
  dashed?: boolean;
  width?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={`url(#arrow-${color.replace('#', '')})`}
    />
  );
}
