import { t } from '../i18n/locale';
import { useId } from 'react';
import { Ripple, Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const PROCESS_PARTS = ['proc', 'thread', 'shared', 'switch'];

function ProcBox({ x, title, fill, focus }: { x: number; title: string; fill: string; focus?: string[] }) {
  return (
    <>
      <Part id="proc" focus={focus}>
        <Box x={x} y={18} w={146} h={104} fill={fill} rx={12} strokeWidth={2.8} />
        <Label x={x + 12} y={34} size={9} anchor="start">
          {title}
        </Label>
      </Part>
      <Part id="shared" focus={focus}>
        <Box x={x + 8} y={42} w={62} h={22} fill={MINT_SOFT} rx={5} strokeWidth={2} />
        <Label x={x + 39} y={57} size={7}>
          {t("堆 · 全局")}</Label>
        <Box x={x + 8} y={70} w={62} h={22} fill={PAPER} rx={5} strokeWidth={2} />
        <Label x={x + 39} y={85} size={7}>
          {t("代码段")}</Label>
        <Label x={x + 39} y={108} size={7} fill="#8B85A6">
          {t("同进程线程共享")}</Label>
      </Part>
      <Part id="thread" focus={focus}>
        <Box x={x + 78} y={42} w={58} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={x + 107} y={57} size={7}>
          {t("线程 1")}</Label>
        <Box x={x + 78} y={70} w={58} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={x + 107} y={85} size={7}>
          {t("线程 2")}</Label>
        <Label x={x + 107} y={108} size={7} fill="#8B85A6">
          {t("各有栈，仍可共享")}</Label>
      </Part>
    </>
  );
}

/**
 * 进程与线程：默认隔离的地址空间中，各线程共用进程资源。
 * 进程可通过 IPC 或共享映射通信；线程栈仍位于共享地址空间。
 */
export function ProcessDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("进程与线程：地址空间、共享与调度")}</title>
      <desc id={descriptionId}>{t("两个进程通常拥有各自虚拟地址空间，也可建立共享映射。同进程线程共享地址空间，各有执行上下文与栈；栈不是线程间的保护边界。调度会受时间片、阻塞、唤醒及优先级等影响，切换有成本。")}</desc>
      <DiagramDefs />

      <ProcBox x={6} title={t("进程 A")} fill={BRAND_SOFT} focus={focus} />
      <ProcBox x={160} title={t("进程 B")} fill={SUN_SOFT} focus={focus} />

      <line x1={155} y1={20} x2={155} y2={120} stroke="#8E84B3" strokeWidth={1.6} strokeDasharray="5 5" opacity="0.4" />
      <Label x={155} y={140} size={8} fill="#8B85A6">
        {t("默认隔离，可共享映射")}</Label>

      <Part id="switch" focus={focus}>
        <circle cx={155} cy={160} r={11} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Ripple cx={155} cy={160} r={11} />
        <Label x={155} y={164} size={7}>
          CPU
        </Label>
        <Arrow d="M146 152 C 130 144, 110 142, 96 140" dashed />
        <Arrow d="M164 152 C 180 144, 200 142, 214 140" dashed />
        <Label x={52} y={174} size={7} fill="#8B85A6">
          {t("阻塞或抢占等可切换")}</Label>
      </Part>
    </svg>
  );
}
