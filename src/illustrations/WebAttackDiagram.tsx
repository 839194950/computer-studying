import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const WEB_PARTS = ['xss', 'inject', 'csrf', 'defense'];

/**
 * Web 攻击面：浏览器和服务器之间只有三条路可走——
 * 让脚本在别人浏览器里跑（XSS）、让输入变成命令（注入）、借别人的身份发请求（CSRF）。
 */
export function WebAttackDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Box x={6} y={20} w={78} h={112} fill={SKY_SOFT} rx={11} strokeWidth={2.6} />
      <Label x={45} y={36} size={9}>
        浏览器
      </Label>
      <Box x={14} y={44} w={62} h={20} fill="#FFFFFF" rx={4} strokeWidth={2} />
      <Label x={45} y={58} size={6.5}>
        你的输入
      </Label>
      <Box x={14} y={70} w={62} h={20} fill="#FFFFFF" rx={4} strokeWidth={2} />
      <Label x={45} y={84} size={6.5}>
        你的登录态
      </Label>
      <Label x={45} y={108} size={6.5} fill="#5B4B9E">
        它相信服务器
      </Label>
      <Label x={45} y={120} size={6.5} fill="#5B4B9E">
        返回的每一行
      </Label>

      <Box x={236} y={20} w={78} h={112} fill={MINT_SOFT} rx={11} strokeWidth={2.6} />
      <Label x={275} y={36} size={9}>
        服务器
      </Label>
      <Box x={246} y={46} w={58} h={26} fill="#FFFFFF" rx={5} strokeWidth={2} />
      <Label x={275} y={62} size={6.5}>
        业务代码
      </Label>
      <Box x={246} y={82} w={58} h={26} fill={PAPER} rx={5} strokeWidth={2} />
      <Label x={275} y={98} size={6.5} mono>
        数据库
      </Label>

      <Part id="xss" focus={focus}>
        <Arrow d="M88 54 C 120 54, 190 40, 232 48" color="#7B5CFF" />
        <Box x={104} y={22} w={54} h={18} fill={BRAND_SOFT} rx={5} strokeWidth={2} />
        <Label x={131} y={35} size={7}>
          XSS 脚本
        </Label>
        <Label x={131} y={12} size={7} fill="#5B4B9E">
          在别人浏览器里执行
        </Label>
      </Part>

      <Part id="inject" focus={focus}>
        <Arrow d="M88 80 H 242" color="#FF7AB5" />
        <Box x={120} y={66} w={56} h={18} fill={PINK_SOFT} rx={5} strokeWidth={2} />
        <Label x={148} y={79} size={7}>
          SQL 注入
        </Label>
        <Label x={148} y={112} size={7} fill="#C1437E">
          输入拼进了命令
        </Label>
      </Part>

      <Part id="csrf" focus={focus}>
        <Arrow d="M232 108 C 190 118, 120 118, 88 108" color="#FFD23F" />
        <Box x={120} y={116} w={56} h={18} fill={SUN_SOFT} rx={5} strokeWidth={2} />
        <Label x={148} y={129} size={7}>
          CSRF 请求
        </Label>
        <Label x={148} y={146} size={7} fill="#8A6A16">
          借你已登录的身份
        </Label>
      </Part>

      <Part id="defense" focus={focus}>
        <Box x={6} y={152} w={308} h={22} fill={BRAND_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={167} size={7.5}>
          转义输出防 XSS · 参数化查询防注入 · 校验来源与令牌防 CSRF
        </Label>
      </Part>
    </svg>
  );
}
