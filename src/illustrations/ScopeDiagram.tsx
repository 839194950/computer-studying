import { t } from '../i18n/locale';
import { useId } from 'react';
import { MINT, Ripple, Arrow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const SCOPE_PARTS = ['global', 'local', 'block', 'closure'];

/**
 * 作用域：三层同心框，越往里越窄。
 * JS 词法环境示意：内层同名绑定可遮蔽外层；闭包可保留绑定，不代表值快照。
 */
export function ScopeDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("函数与作用域：词法查找与闭包")}</title>
      <desc id={descriptionId}>{t("JavaScript 示例：从块内向外查找名字，内层同名绑定会遮蔽外层。全局 appName、函数内 count 和块内 let n 示意不同可见范围。离开块后，外部不能直接查找 n；可达闭包仍可通过定义处环境访问 n 的绑定，不是保存值快照。框不是调用栈或对象的内存布局。")}</desc>
      <DiagramDefs />

      <Part id="global" focus={focus}>
        <Box x={4} y={12} w={312} h={158} fill="#FFFFFF" rx={14} strokeWidth={3} />
        <Label x={14} y={28} size={9} anchor="start" fill="#5B4B9E">
          {t("JS 全局")}</Label>
        <Box x={92} y={18} w={68} h={18} fill={SUN_SOFT} rx={5} strokeWidth={2} />
        <Label x={126} y={31} size={8} mono>
          appName
        </Label>
      </Part>

      <Part id="local" focus={focus}>
        <Box x={16} y={48} w={250} h={112} fill={BRAND_SOFT} rx={12} strokeWidth={2.6} />
        <Label x={26} y={66} size={9} anchor="start" fill="#5B4B9E">
          {t("函数作用域")}</Label>
        <Box x={110} y={56} w={52} h={18} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={136} y={69} size={8} mono>
          count
        </Label>
      </Part>

      <Part id="block" focus={focus}>
        <Box x={30} y={94} w={176} h={52} fill={MINT_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={40} y={112} size={9} anchor="start" fill="#127A52">
          {t("块：let/const")}</Label>
        <Box x={150} y={102} w={38} h={18} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={169} y={115} size={8} mono>
          n
        </Label>
        <Label x={40} y={136} size={7.5} anchor="start" fill="#127A52">
          {t("外部不能直接查找")}</Label>
      </Part>

      <Part id="closure" focus={focus}>
        <Box x={210} y={92} w={104} h={56} fill={PINK_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={262} y={110} size={9}>
          {t("闭包")}</Label>
        <Ripple cx={169} cy={111} r={9} color={MINT} />
        <Label x={262} y={124} size={7.5} fill="#8B85A6">
          {t("函数 + n 的绑定")}</Label>
        <Label x={262} y={139} size={7} fill="#C1437E">
          {t("返回后仍可访问")}</Label>
        <Arrow d="M190 112 C 196 108, 200 106, 206 104" color={BRAND} dashed width={2.2} />
      </Part>
    </svg>
  );
}
