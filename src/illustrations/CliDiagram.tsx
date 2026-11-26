import { t } from '../i18n/locale';
import { useId } from 'react';
import { anim, Arrow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const CLI_PARTS = ['shell', 'ps', 'pipe', 'signal'];

/**
 * 命令行：shell 解析命令，执行内置操作或启动外部程序；
 * 普通管道连接标准输出与标准输入；kill 用于发送信号。
 */
export function CliDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("命令行与进程观察：shell、管道与信号")}</title>
      <desc id={descriptionId}>{t("shell解析命令，可执行内置操作或启动外部程序。普通管道把前一命令标准输出接到后一命令标准输入，标准错误另行处理。ps提供进程快照，top刷新采样；TERM可处理，KILL和STOP不能捕获、阻塞或忽略。")}</desc>
      <DiagramDefs />

      <Part id="shell" focus={focus}>
        <Box x={6} y={12} w={180} h={124} fill={PAPER} rx={10} strokeWidth={2.8} />
        <Box x={6} y={12} w={180} h={22} fill={BRAND} rx={10} strokeWidth={2.8} />
        <rect x={6} y={26} width={180} height={8} fill={BRAND} />
        <Label x={96} y={27} size={8} fill="#FFFFFF">
          {t("终端 · shell")}</Label>
        <Label x={16} y={56} size={8} anchor="start" mono>
          $ ls -l
        </Label>
        <Label x={16} y={76} size={8} anchor="start" mono>
          $ ps aux | grep node
        </Label>
        <Label x={16} y={96} size={8} anchor="start" mono>
          $ kill -TERM 1234
        </Label>
        <rect x={102} y={89} width={5} height={9} rx={1} fill={BRAND} {...anim('blink', { dur: 1.1 })} />
        <Label x={16} y={118} size={7} anchor="start" fill="#8B85A6">
          {t("shell 解析并执行命令")}</Label>
      </Part>

      <Part id="pipe" focus={focus}>
        <Box x={192} y={12} w={122} h={56} fill={SUN_SOFT} rx={9} strokeWidth={2.4} />
        <Label x={253} y={26} size={8}>
          {t("管道")}</Label>
        <Box x={200} y={32} w={40} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={220} y={46} size={7} mono>
          ps
        </Label>
        <Arrow d="M242 42 H254" color={BRAND} />
        <Label x={248} y={30} size={8} fill="#5B4B9E">
          |
        </Label>
        <Box x={256} y={32} w={50} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={281} y={46} size={7} mono>
          grep
        </Label>
        <Label x={253} y={62} size={6.5} fill="#8A6A16">
          {t("标准输出 → 标准输入")}</Label>
      </Part>

      <Part id="ps" focus={focus}>
        <Box x={192} y={74} w={122} h={62} fill={MINT_SOFT} rx={9} strokeWidth={2.4} />
        <Label x={253} y={88} size={8}>
          ps · top
        </Label>
        <Label x={200} y={102} size={6.5} anchor="start" mono fill="#127A52">
          PID USER STAT
        </Label>
        <Label x={200} y={114} size={6.5} anchor="start" mono>
          1234 app S
        </Label>
        <Label x={200} y={126} size={6.5} anchor="start" mono>
          1240 db R
        </Label>
      </Part>

      <Part id="signal" focus={focus}>
        <Box x={6} y={142} w={308} h={26} fill={BRAND_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={159} size={7.5}>
          {t("kill 发送信号：TERM 可处理，KILL 终止时不运行程序清理逻辑")}</Label>
      </Part>
    </svg>
  );
}
