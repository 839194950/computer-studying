import { t } from '../i18n/locale';
import { useId } from 'react';
import { anim, Arrow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const POINTER_PARTS = ['value', 'address', 'deref', 'null'];

/**
 * 指针：变量里装的是门牌号。
 * 左边指针盒只存地址，顺着箭头走过去才是真正的值——这就是「解引用」。
 */
export function PointerDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("指针与引用：地址、解引用与有效对象")}</title>
      <desc id={descriptionId}>{t("C++对象指针示例：p指向示例地址0x7ff4的整数42，*p访问目标对象；地址不是物理布局保证。nullptr表示空指针，不能解引用。非空也不保证生命周期或边界有效；引用同样可能悬空。")}</desc>
      <DiagramDefs />

      <Part id="value" focus={focus}>
        <Label x={248} y={16} size={9}>
          {t("示例地址")}</Label>
      </Part>

      <Part id="address" focus={focus}>
        <Box x={10} y={30} w={40} h={26} fill={SUN_SOFT} rx={6} strokeWidth={2.4} />
        <Label x={30} y={47} size={10} mono>
          p
        </Label>
        <Box x={58} y={30} w={88} h={26} fill={BRAND_SOFT} rx={6} strokeWidth={2.4} />
        <Label x={102} y={47} size={10} mono>
          0x7ff4
        </Label>
        <Label x={102} y={72} size={8} fill="#8B85A6">
          {t("C++对象指针示例")}</Label>
      </Part>

      <Part id="deref" focus={focus}>
        <Arrow d="M148 43 C 172 43, 180 62, 186 76" color={BRAND} />
        <Label x={168} y={92} size={7.5} anchor="middle" fill="#5B4B9E">
          {t("*p 解引用")}</Label>
      </Part>

      <Part id="value" focus={focus}>
        <Box x={196} y={20} w={70} h={34} fill={PAPER} rx={8} strokeWidth={2.4} />
        <Label x={204} y={32} size={7} anchor="start" fill="#8B85A6" mono>
          0x7ff0
        </Label>
        <Label x={250} y={46} size={12} mono>
          7
        </Label>
      </Part>
      <Part id="deref" focus={focus}>
        <Box x={196} y={60} w={70} h={34} fill={MINT_SOFT} rx={8} strokeWidth={2.4} />
        <Label x={204} y={72} size={7} anchor="start" fill="#127A52" mono>
          0x7ff4
        </Label>
        <Label x={250} y={86} size={12} mono>
          42
        </Label>
      </Part>
      <Part id="value" focus={focus}>
        <Box x={196} y={100} w={70} h={34} fill={PAPER} rx={8} strokeWidth={2.4} />
        <Label x={204} y={112} size={7} anchor="start" fill="#8B85A6" mono>
          0x7ff8
        </Label>
        <Label x={250} y={126} size={12} mono>
          9
        </Label>
      </Part>

      <Part id="null" focus={focus}>
        <Box x={10} y={100} w={150} h={54} fill={PINK_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={30} y={120} size={10} anchor="start" mono>
          nullptr
        </Label>
        <Label x={30} y={136} size={8} anchor="start" fill="#8B85A6">
          {t("空指针不可解引用")}</Label>
        <path d="M120 112 L140 140 M140 112 L120 140" stroke="#FF7AB5" strokeWidth={3.5} strokeLinecap="round" {...anim('shake')} />
      </Part>
    </svg>
  );
}
