import { t } from '../i18n/locale';
import { useId } from 'react';
import {
  anim,
  Arrow,
  Box,
  BRAND,
  BRAND_SOFT,
  DiagramDefs,
  Label,
  LINE,
  MINT,
  MINT_SOFT,
  PAPER,
  Part,
  PINK,
  Ripple,
  SKY,
  SKY_SOFT,
  SUN,
  SUN_SOFT,
  type DiagramProps,
} from './base';

export const CPU_PARTS = ['cpu', 'cache', 'ram', 'disk'];

/**
 * 计算机组成：CPU 内部三段 + 缓存 + 内存 + 磁盘。
 * 越往右越慢越大；底部的速度条上有一颗小球，越往右跑得越慢，直观表现"差好几个数量级"。
 * 动效都挂在细节上（时钟灯、齿轮、寄存器位、内存条扫描、盘片），主体结构保持静止好读。
 */
export function CpuDiagram({ className, focus }: DiagramProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={id + '-title'} aria-describedby={id + '-desc'}>
      <title id={id + '-title'}>{t("计算机组成与典型存储层级示意图")}</title>
      <desc id={id + '-desc'}>{t("CPU 执行指令，寄存器保存操作数与状态；缓存通常位于 CPU 芯片内，保留部分指令和数据的副本；主内存承载运行内容，SSD 或机械盘保存文件。缓存画在旁边是为了区分职责，不代表实际物理布局。盘片图案仅示意机械盘，SSD 没有机械寻道和旋转等待。寄存器、缓存、主内存、持久存储通常逐级更大、更慢，具体容量与访问延迟依硬件和负载而异。")}</desc>
      <DiagramDefs />
      <defs>
        <linearGradient id="cpu-speed" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={MINT} />
          <stop offset="50%" stopColor={SUN} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
      </defs>

      <Part id="cpu" focus={focus}>
        <Box x={6} y={24} w={84} h={112} fill={BRAND_SOFT} rx={12} />
        <Label x={44} y={17} size={11}>
          CPU
        </Label>
        <circle cx={66} cy={13.5} r={2.6} fill={MINT} />
        <Ripple cx={66} cy={13.5} r={2.6} color={MINT} />

        <Box x={13} y={31} w={70} h={26} fill={SKY_SOFT} rx={8} />
        <Label x={42} y={48} size={9}>
          {t("控制器")}</Label>
        <circle cx={72} cy={44} r={3} fill={SKY} {...anim('blink', { dur: 1 })} />

        <Box x={13} y={63} w={70} h={26} fill={SUN_SOFT} rx={8} />
        <Label x={38} y={80} size={8.5}>
          {t("运算器 ALU")}</Label>
        <g {...anim('spin', { dur: 4 })}>
          <circle cx={72} cy={76} r={5.2} stroke="#E8B400" strokeWidth={3} strokeDasharray="2.4 1.7" />
          <circle cx={72} cy={76} r={2.4} fill="#FFFFFF" stroke="#E8B400" strokeWidth={1.4} />
        </g>

        <Box x={13} y={95} w={70} h={34} fill={MINT_SOFT} rx={8} />
        <Label x={48} y={108} size={8.5}>
          {t("寄存器")}</Label>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={20 + i * 15}
            y={114}
            width={12}
            height={8}
            rx={2.5}
            fill={MINT}
            {...anim('pulse', { dur: 1.4, delay: i * 0.22 })}
          />
        ))}
      </Part>

      <Part id="cache" focus={focus}>
        <Box x={112} y={40} w={42} h={80} fill={SUN_SOFT} rx={10} />
        <Label x={133} y={33} size={10}>
          {t("缓存")}</Label>
        <Box x={118} y={50} w={30} h={22} fill={SUN} rx={6} />
        <Label x={133} y={65} size={8.5}>
          L1
        </Label>
        <Box x={118} y={80} w={30} h={22} fill="#FFFFFF" rx={6} />
        <Label x={133} y={95} size={8.5}>
          L2
        </Label>
        <Label x={133} y={140} size={8}>{t("通常在 CPU 内")}</Label>
      </Part>

      <Part id="ram" focus={focus}>
        <Box x={172} y={40} w={66} h={80} fill={PAPER} rx={10} />
        <Label x={205} y={33} size={10}>
          {t("内存")}</Label>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={178 + i * 14.5} y={50} width={10.5} height={58} rx={3.5} fill="#FFFFFF" stroke={LINE} strokeWidth={1.3} />
            <rect
              x={178 + i * 14.5}
              y={50}
              width={10.5}
              height={58}
              rx={3.5}
              fill={BRAND}
              className="dg-scan"
              style={{ opacity: i === 1 ? 1 : 0, animationDelay: `${i * 0.45}s` }}
            />
          </g>
        ))}
      </Part>

      <Part id="disk" focus={focus}>
        <Box x={256} y={48} w={58} h={72} fill={SKY_SOFT} rx={10} />
        <Label x={285} y={41} size={9.5}>
          {t("磁盘 / SSD")}</Label>
        <circle cx={285} cy={84} r={19} fill="#FFFFFF" stroke="#A6E2F9" strokeWidth={1.6} />
        <g {...anim('spin', { dur: 2.2 })}>
          <circle cx={285} cy={84} r={12.5} stroke="#82D3F5" strokeWidth={1.4} strokeDasharray="5 3" />
          <circle cx={285} cy={71.5} r={1.8} fill={SKY} />
        </g>
        <circle cx={285} cy={84} r={3.6} fill={SKY} />
        <path d="M306 60 L293 77" stroke="#5B4B9E" strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={306} cy={60} r={2.6} fill="#5B4B9E" />
        <Label x={285} y={140} size={8}>{t("机械盘示意")}</Label>
      </Part>

      <Arrow d="M90 80 H109" delay={0} />
      <Arrow d="M154 80 H169" delay={0.5} />
      <Arrow d="M238 80 H253" delay={1} />

      <rect x={64} y={160} width={192} height={5} rx={2.5} fill="url(#cpu-speed)" opacity={0.85} />
      <Label x={56} y={165} size={8} anchor="end" fill="#127A52">
        {t("快")}</Label>
      <Label x={264} y={165} size={8} anchor="start" fill="#C1437E">
        {t("慢")}</Label>
      <circle
        cx={66}
        cy={162.5}
        r={4.2}
        fill="#FFFFFF"
        stroke={BRAND}
        strokeWidth={2}
        {...anim('travel', { dx: 186, dur: 3.6 })}
        style={{ ...anim('travel', { dx: 186, dur: 3.6 }).style, animationTimingFunction: 'cubic-bezier(0.05, 0.9, 0.2, 1)' }}
      />
      <Label x={160} y={177} size={8} fill="#8B85A6">
        {t("存储层级趋势示意，非物理布局或固定延迟")}</Label>
    </svg>
  );
}
