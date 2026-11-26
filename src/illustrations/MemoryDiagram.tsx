import { t } from '../i18n/locale';
import { useId } from 'react';
import { PINK, Ripple, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, type DiagramProps } from './base';

export const MEMORY_PARTS = ['virtual', 'page', 'fault', 'swap'];

/**
 * 虚拟内存：左边是虚拟页，中间是页表，
 * 右边是物理帧。缺页的原因和处理不只磁盘换入一种。
 */
export function MemoryDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("内存管理：虚拟页、页表与物理帧")}</title>
      <desc id={descriptionId}>{t("示例中页0、1、3分别映射到物理帧2、0、1，页2等待缺页处理。缺页可涉及零填充、写时复制、后备数据读取或非法访问，不一定读盘。回收可丢弃干净文件页；匿名页能否换出取决于系统配置。")}</desc>
      <DiagramDefs />

      <Part id="virtual" focus={focus}>
        <Box x={6} y={16} w={88} h={126} fill={PAPER} rx={10} strokeWidth={2.6} />
        <Label x={50} y={32} size={8}>
          {t("虚拟地址")}</Label>
        <Box x={14} y={40} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={55} size={8} mono>
          {t("页 0")}</Label>
        <Box x={14} y={68} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={83} size={8} mono>
          {t("页 1")}</Label>
        <Box x={14} y={124} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={139} size={8} mono>
          {t("页 3")}</Label>
      </Part>

      <Part id="fault" focus={focus}>
        <Box x={14} y={96} w={72} h={22} fill={PINK_SOFT} rx={5} strokeWidth={2.2} dashed />
        <Ripple cx={78} cy={107} r={4} color={PINK} />
        <circle cx={78} cy={107} r={2.6} fill={PINK} />
        <Label x={50} y={109} size={8} mono>
          {t("页 2")}</Label>
      </Part>

      <Part id="page" focus={focus}>
        <Box x={106} y={16} w={96} h={126} fill={BRAND_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={154} y={32} size={8}>
          {t("页表")}</Label>
        <Box x={112} y={40} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={55} size={7} mono>
          {t("页 0 → 帧 2")}</Label>
        <Box x={112} y={68} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={83} size={7} mono>
          {t("页 1 → 帧 0")}</Label>
        <Box x={112} y={124} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={139} size={7} mono>
          {t("页 3 → 帧 1")}</Label>
      </Part>

      <Part id="fault" focus={focus}>
        <Box x={112} y={96} w={84} h={22} fill={PINK_SOFT} rx={5} strokeWidth={2.2} />
        <Label x={154} y={111} size={7} mono>
          {t("页2 · 待缺页处理")}</Label>
      </Part>

      <Part id="page" focus={focus}>
        <Box x={212} y={16} w={102} h={126} fill={MINT_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={263} y={32} size={8}>
          {t("物理内存")}</Label>
        <Box x={220} y={40} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={55} size={7} mono>
          {t("帧 0 · 页1")}</Label>
        <Box x={220} y={68} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={83} size={7} mono>
          {t("帧 1 · 页3")}</Label>
        <Box x={220} y={96} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={111} size={7} mono>
          {t("帧 2 · 页0")}</Label>
        <Box x={220} y={124} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} dashed />
        <Label x={263} y={139} size={7} mono fill="#8B85A6">
          {t("帧 3 · 空闲")}</Label>
      </Part>

      <Part id="swap" focus={focus}>
        <Box x={6} y={152} w={308} h={22} fill={PINK_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={167} size={7.5}>
          {t("回收可丢弃干净文件页；可换出匿名页也可能写入交换空间")}</Label>
      </Part>
    </svg>
  );
}
