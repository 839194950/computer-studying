import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const TLS_PARTS = ['handshake', 'cert', 'ca', 'encrypt'];

/**
 * TLS：先握手协商出密钥，再全程加密。
 * 证书解决的是「对面这个公钥真的是它的吗」，证书本身又靠 CA 的签名担保。
 */
export function TlsDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="ca" focus={focus}>
        <Box x={96} y={12} w={54} h={22} fill={SUN_SOFT} rx={6} strokeWidth={2.2} />
        <Label x={123} y={27} size={8}>
          根 CA
        </Label>
      </Part>

      <Part id="cert" focus={focus}>
        <Arrow d="M152 23 H170" color="#D9A21B" width={2.2} />
        <Box x={172} y={12} w={92} h={22} fill={MINT_SOFT} rx={6} strokeWidth={2.2} />
        <Label x={218} y={27} size={7.5}>
          证书 · 公钥 + 签名
        </Label>
        <path d="M264 30 C 280 40, 282 52, 281 64" fill="none" stroke="#241A3D" strokeWidth={1.8} strokeDasharray="4 4" />
        <Label x={306} y={56} size={6.5} anchor="end" fill="#8B85A6">
          证明「这公钥是它的」
        </Label>
      </Part>

      <Box x={6} y={64} w={66} h={86} fill={SKY_SOFT} rx={10} strokeWidth={2.6} />
      <Label x={39} y={80} size={8}>
        浏览器
      </Label>
      <Label x={39} y={96} size={6.5} fill="#5B4B9E">
        生成随机数
      </Label>
      <Label x={39} y={110} size={6.5} fill="#5B4B9E">
        验证证书
      </Label>
      <Label x={39} y={124} size={6.5} fill="#5B4B9E">
        算出会话密钥
      </Label>

      <Box x={248} y={64} w={66} h={86} fill={PINK_SOFT} rx={10} strokeWidth={2.6} />
      <Label x={281} y={80} size={8}>
        服务器
      </Label>
      <Label x={281} y={96} size={6.5} fill="#C1437E">
        出示证书
      </Label>
      <Label x={281} y={110} size={6.5} fill="#C1437E">
        用私钥证明
      </Label>
      <Label x={281} y={124} size={6.5} fill="#C1437E">
        算出同一密钥
      </Label>

      <Part id="handshake" focus={focus}>
        <Arrow d="M74 88 H246" color="#7B5CFF" width={2} />
        <Label x={160} y={84} size={7} fill="#5B4B9E">
          ① 客户端打招呼，给出随机数
        </Label>
        <Arrow d="M246 106 H74" color="#2ECC8F" width={2} />
        <Label x={160} y={102} size={7} fill="#127A52">
          ② 服务器回随机数 + 证书
        </Label>
        <Arrow d="M74 124 H246" color="#7B5CFF" width={2} />
        <Label x={160} y={120} size={7} fill="#5B4B9E">
          ③ 双方各自算出同一个会话密钥
        </Label>
        <Arrow d="M246 142 H74" color="#2ECC8F" width={2} />
        <Label x={160} y={138} size={7} fill="#127A52">
          ④ 之后全部用对称加密传输
        </Label>
      </Part>

      <Part id="encrypt" focus={focus}>
        <Box x={6} y={156} w={308} h={20} fill={BRAND_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={170} size={7.5}>
          HTTPS = HTTP + TLS：握手用非对称，传数据用对称，兼顾安全与速度
        </Label>
      </Part>
    </svg>
  );
}
