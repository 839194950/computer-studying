import { Arrow, Box, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const AUTH_PARTS = ['authn', 'session', 'authz', 'idoref'];

/**
 * 认证、会话、授权三件事要分清：
 * 认证回答「你是谁」，会话记住这件事，授权回答「你能动这个资源吗」。
 * 越权（IDOR）就是跳过了最后一步，直接拿别人的编号去取。
 */
export function AuthDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="authn" focus={focus}>
        <Box x={4} y={28} w={64} h={58} fill={SKY_SOFT} rx={9} strokeWidth={2.6} />
        <Label x={36} y={44} size={8}>
          认证
        </Label>
        <Label x={36} y={58} size={6.5} fill="#5B4B9E">
          你是谁
        </Label>
        <Label x={36} y={72} size={6.5} fill="#5B4B9E">
          密码 + 二次验证
        </Label>
      </Part>

      <Part id="session" focus={focus}>
        <Arrow d="M70 57 H82" />
        <Box x={84} y={28} w={64} h={58} fill={SUN_SOFT} rx={9} strokeWidth={2.6} />
        <Label x={116} y={44} size={8}>
          会话
        </Label>
        <Label x={116} y={58} size={6.5} fill="#8A6A16">
          记住你已登录
        </Label>
        <Label x={116} y={72} size={6.5} mono fill="#8A6A16">
          Cookie / Token
        </Label>
      </Part>

      <Part id="authz" focus={focus}>
        <Arrow d="M150 57 H162" />
        <Box x={164} y={28} w={64} h={58} fill={MINT_SOFT} rx={9} strokeWidth={2.6} />
        <Label x={196} y={44} size={8}>
          授权
        </Label>
        <Label x={196} y={58} size={6.5} fill="#127A52">
          你能做什么
        </Label>
        <Label x={196} y={72} size={6.5} fill="#127A52">
          查角色与归属
        </Label>
      </Part>

      <Arrow d="M230 57 H242" />

      <Box x={244} y={28} w={70} h={58} fill={PAPER} rx={9} strokeWidth={2.6} />
      <Label x={279} y={44} size={8}>
        资源
      </Label>
      <Label x={279} y={58} size={6.5} mono fill="#8B85A6">
        /orders/1234
      </Label>
      <Label x={279} y={72} size={6.5} fill="#8B85A6">
        属于用户 A
      </Label>

      <Part id="idoref" focus={focus}>
        <Arrow d="M232 116 C 254 112, 264 104, 272 90" color="#FF7AB5" dashed width={2.6} />
        <Box x={96} y={96} w={134} h={40} fill={PINK_SOFT} rx={8} strokeWidth={2.4} />
        <Label x={163} y={112} size={8}>
          越权 · 把 1234 改成 1235
        </Label>
        <Label x={163} y={127} size={6.5} fill="#C1437E">
          只查了「登录了吗」，没查「是你的吗」
        </Label>
      </Part>

      <Part id="authz" focus={focus}>
        <Label x={160} y={162} size={7.5} fill="#8B85A6">
          每个请求都要重新判断：这个登录用户，能不能动这条数据
        </Label>
      </Part>
    </svg>
  );
}
