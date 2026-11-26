import { t } from '../i18n/locale';
import { useId } from 'react';
import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const WEB_PARTS = ['xss', 'inject', 'csrf', 'defense'];

/**
 * Web 攻击面：这里只示意三类常见风险——
 * 让脚本在别人浏览器里跑（XSS）、让输入变成命令（注入）、借别人的身份发请求（CSRF）。
 */
export function WebAttackDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>{t("Web攻击面：XSS、SQL注入与CSRF")}</title>
      <desc id={descriptionId}>{t("示意三类常见风险：服务器返回的不安全内容可能让脚本在浏览器执行；拼接输入可能改变数据库查询；攻击者可诱导浏览器携带凭据向服务器发请求。XSS也可能来自DOM处理。防护须结合输出上下文、参数化查询和CSRF校验。")}</desc>
      <DiagramDefs />

      <Box x={6} y={20} w={78} h={112} fill={SKY_SOFT} rx={11} strokeWidth={2.6} />
      <Label x={45} y={36} size={9}>
        {t("浏览器")}</Label>
      <Box x={14} y={44} w={62} h={20} fill="#FFFFFF" rx={4} strokeWidth={2} />
      <Label x={45} y={58} size={6.5}>
        {t("你的输入")}</Label>
      <Box x={14} y={70} w={62} h={20} fill="#FFFFFF" rx={4} strokeWidth={2} />
      <Label x={45} y={84} size={6.5}>
        {t("你的登录态")}</Label>
      <Label x={45} y={108} size={6.5} fill="#5B4B9E">
        {t("不安全内容可能")}</Label>
      <Label x={45} y={120} size={6.5} fill="#5B4B9E">
        {t("在页面中执行")}</Label>

      <Box x={236} y={20} w={78} h={112} fill={MINT_SOFT} rx={11} strokeWidth={2.6} />
      <Label x={275} y={36} size={9}>
        {t("服务器")}</Label>
      <Box x={246} y={46} w={58} h={26} fill="#FFFFFF" rx={5} strokeWidth={2} />
      <Label x={275} y={62} size={6.5}>
        {t("业务代码")}</Label>
      <Box x={246} y={82} w={58} h={26} fill={PAPER} rx={5} strokeWidth={2} />
      <Label x={275} y={98} size={6.5} mono>
        {t("数据库")}</Label>

      <Part id="xss" focus={focus}>
        <Arrow d="M232 48 C 190 40, 120 54, 88 54" color="#7B5CFF" />
        <Box x={104} y={22} w={54} h={18} fill={BRAND_SOFT} rx={5} strokeWidth={2} />
        <Label x={131} y={35} size={7}>
          {t("XSS 脚本")}</Label>
        <Label x={131} y={12} size={7} fill="#5B4B9E">
          {t("在别人浏览器里执行")}</Label>
      </Part>

      <Part id="inject" focus={focus}>
        <Arrow d="M88 80 H 242" color="#FF7AB5" />
        <Box x={120} y={66} w={56} h={18} fill={PINK_SOFT} rx={5} strokeWidth={2} />
        <Label x={148} y={79} size={7}>
          {t("SQL 注入")}</Label>
        <Label x={148} y={97} size={7} fill="#C1437E">
          {t("输入拼进了命令")}</Label>
      </Part>

      <Part id="csrf" focus={focus}>
        <Arrow d="M88 108 C 120 118, 190 118, 232 108" color="#FFD23F" />
        <Box x={120} y={116} w={56} h={18} fill={SUN_SOFT} rx={5} strokeWidth={2} />
        <Label x={148} y={129} size={7}>
          {t("CSRF 请求")}</Label>
        <Label x={148} y={146} size={7} fill="#8A6A16">
          {t("诱导浏览器带凭据")}</Label>
      </Part>

      <Part id="defense" focus={focus}>
        <Box x={6} y={152} w={308} h={22} fill={BRAND_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={167} size={7.5}>
          {t("按上下文安全输出 · 参数化查询 · 来源与令牌校验")}</Label>
      </Part>
    </svg>
  );
}
