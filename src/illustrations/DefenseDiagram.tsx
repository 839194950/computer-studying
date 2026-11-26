import { t } from '../i18n/locale';
import { useId } from 'react';
import { PINK, anim, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const DEFENSE_PARTS = ['input', 'least', 'encrypt', 'log'];

/**
 * 纵深防御：多种措施相互补充，也须考虑共同失效的条件。
 * 外面是日志与监控（能看见），往里依次是最小权限、输入校验，最中心是数据本身。
 */
export function DefenseDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("防护与日志：校验、权限、数据保护与监控")}</title>
      <desc id={descriptionId}>{t("输入校验与上下文安全输出、最小权限、数据加密和专用密码哈希、日志监控相互补充。日志需避免秘密泄漏并保护完整性；多层措施仍可能因共同缺陷同时失效，不能保证某层被绕过后其余层一定有效。")}</desc>
      <DiagramDefs />

      <Part id="log" focus={focus}>
        <Box x={4} y={10} w={312} h={158} fill={PAPER} rx={16} strokeWidth={3} />
        <Label x={16} y={26} size={8} anchor="start" fill="#5B4B9E">
          {t("日志与监控 · 帮助发现异常")}</Label>
      </Part>

      <Part id="least" focus={focus}>
        <Box x={26} y={34} w={268} h={114} fill={SUN_SOFT} rx={14} strokeWidth={2.8} />
        <Label x={38} y={50} size={8} anchor="start" fill="#8A6A16">
          {t("最小权限 · 只给任务所需")}</Label>
      </Part>

      <Part id="input" focus={focus}>
        <Box x={50} y={58} w={220} h={82} fill={BRAND_SOFT} rx={12} strokeWidth={2.8} />
        <Label x={62} y={74} size={8} anchor="start" fill="#5B4B9E">
          {t("输入校验与上下文安全输出")}</Label>
      </Part>

      <Part id="encrypt" focus={focus}>
        <Box x={74} y={86} w={172} h={44} fill={MINT_SOFT} rx={10} strokeWidth={2.8} />
        <Label x={160} y={104} size={8.5}>
          {t("加密与专用密码哈希")}</Label>
        <Label x={160} y={118} size={7} fill="#127A52">
          {t("降低泄漏后果，仍需保护密钥")}</Label>
      </Part>

      <Part id="input" focus={focus}>
        <Label x={160} y={162} size={7.5} fill="#8B85A6">
          {t("多层措施相互补充；共同缺陷也可能让多层一起失效")}</Label>
      </Part>
      {/* 攻击从外面往里钻，到输入校验那层就被拦下 */}
      <circle cx={10} cy={118} r={3.5} fill={PINK} {...anim('travel', { dx: 50, dur: 2.6 })} />
    </svg>
  );
}
