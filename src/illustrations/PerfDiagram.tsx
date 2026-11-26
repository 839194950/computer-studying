import { t } from '../i18n/locale';
import { useId } from 'react';
import {
  anim,
  Box,
  BRAND,
  BRAND_SOFT,
  DiagramDefs,
  Flow,
  Label,
  MINT,
  MINT_SOFT,
  Part,
  PINK,
  Ripple,
  SKY,
  SUN,
  SUN_SOFT,
  type DiagramProps,
} from './base';

export const PERF_PARTS = ['latency', 'pipeline', 'switch', 'parallel'];

const LATENCY = [
  { name: '寄存器', w: 10, color: MINT, text: '近端' },
  { name: '主存', w: 38, color: SUN, text: '访存' },
  { name: '存储', w: 72, color: PINK, text: '设备 IO' },
];

const STAGES = ['取', '译', '执', '写'];
const ROW_COLORS = [BRAND, SKY, MINT, SUN];

export function PerfDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("性能与并发：延迟、流水线、切换与并行")}</title>
      <desc id={descriptionId}>{t("四象限示意：访问延迟取决于设备、操作、缓存与负载，条长不是比例尺；四级流水线的同一时刻，四种颜色的指令各占一个阶段；线程切换保存和恢复上下文，不一定更换地址空间；多核并行仅为一种示例，线程多不保证更快。")}</desc>
      <DiagramDefs />

      <Part id="latency" focus={focus}>
        <Label x={10} y={16} size={9} anchor="start">
          {t("访问延迟可能差很多")}</Label>
        {LATENCY.map((row, i) => (
          <g key={row.name}>
            <Label x={10} y={36 + i * 20} size={8} anchor="start" fill="#8B85A6">
              {row.name}
            </Label>
            <rect x={46} y={29 + i * 20} width={row.w} height={9} rx={4.5} fill={row.color} {...anim('grow', { delay: i * 0.25 })} />
            <Label x={50 + row.w} y={36.5 + i * 20} size={7} anchor="start" fill="#8B85A6" mono>
              {row.text}
            </Label>
          </g>
        ))}
        <Label x={10} y={92} size={7} anchor="start" fill="#8B85A6">
          {t("条长非比例尺，具体延迟需测量")}</Label>
      </Part>

      <Part id="pipeline" focus={focus}>
        <Label x={170} y={16} size={9} anchor="start">
          {t("流水线让指令重叠")}</Label>
        {STAGES.map((name, c) => (
          <g key={name}>
            <Box x={170 + c * 36} y={24} w={32} h={18} fill={BRAND_SOFT} rx={6} />
            <Label x={186 + c * 36} y={36.5} size={8.5}>
              {name}
            </Label>
          </g>
        ))}
        {ROW_COLORS.map((color, index) => (
          <rect key={color} x={172 + (3 - index) * 36} y={48 + index * 10} width={28} height={8} rx={4} fill={color} opacity={0.85} />
        ))}
        <Label x={170} y={95} size={7} anchor="start" fill="#8B85A6">
          {t("四级示意：四条指令各占一段")}</Label>
      </Part>

      <Part id="switch" focus={focus}>
        <Label x={10} y={110} size={9} anchor="start">
          {t("切换要保存现场")}</Label>
        <Box x={10} y={124} w={44} h={24} fill={SUN_SOFT} rx={7} />
        <Label x={32} y={140} size={8}>
          {t("线程 A")}</Label>
        <circle cx={82} cy={136} r={12} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Label x={82} y={139} size={7.5}>
          CPU
        </Label>
        <Ripple cx={82} cy={136} r={12} />
        <Box x={110} y={124} w={44} h={24} fill={MINT_SOFT} rx={7} />
        <Label x={132} y={140} size={8}>
          {t("线程 B")}</Label>
        <path d="M32 122 C 44 111, 120 111, 132 122" stroke="#8E84B3" strokeWidth={1.4} strokeDasharray="3 3" className="dg-march" />
        <Flow d="M32 122 C 44 111, 120 111, 132 122" color={BRAND} dur={2.6} dash={8} />
        <Label x={10} y={166} size={7} anchor="start" fill="#8B85A6">
          {t("保存与恢复现场，不一定换地址空间")}</Label>
      </Part>

      <Part id="parallel" focus={focus}>
        <Label x={170} y={114} size={9} anchor="start">
          {t("多核并行是一种示例")}</Label>
        {[0, 1, 2, 3].map((i) => {
          const busy = i < 2;
          return (
            <g key={i}>
              <Box x={170 + i * 36} y={124} w={30} h={24} fill={busy ? MINT : '#FFFFFF'} rx={6} />
              <Label x={185 + i * 36} y={140} size={7.5} fill={busy ? '#FFFFFF' : '#8B85A6'}>
                {t("核")}{i + 1}
              </Label>
              <rect x={170 + i * 36} y={153} width={30} height={4} rx={2} fill="#ECE9F5" />
              {busy && (
                <rect x={170 + i * 36} y={153} width={30} height={4} rx={2} fill={MINT} {...anim('grow', { delay: i * 0.4, dur: 2.4 })} />
              )}
            </g>
          );
        })}
        <Label x={170} y={168} size={7} anchor="start" fill="#8B85A6">
          {t("两核在跑，两核空着：线程多≠更快")}</Label>
      </Part>
    </svg>
  );
}
