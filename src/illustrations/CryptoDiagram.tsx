import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const CRYPTO_PARTS = ['hash', 'sym', 'asym', 'sign'];

/**
 * 密码学四件事：哈希只做指纹，对称用一把钥匙，非对称用两把，
 * 签名是把非对称反过来用——私钥签，公钥验。
 */
export function CryptoDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="hash" focus={focus}>
        <Box x={6} y={14} w={150} h={72} fill={PINK_SOFT} rx={11} strokeWidth={2.6} />
        <Label x={16} y={30} size={9} anchor="start">
          哈希 · 单行道
        </Label>
        <Box x={16} y={38} w={42} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={37} y={52} size={7}>
          任意长度
        </Label>
        <Arrow d="M62 48 H74" color="#C1437E" />
        <Box x={78} y={38} w={64} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={110} y={52} size={7} mono>
          a1b2c3d4
        </Label>
        <Label x={80} y={74} size={7} fill="#C1437E">
          只能往下，回不去
        </Label>
      </Part>

      <Part id="sym" focus={focus}>
        <Box x={164} y={14} w={150} h={72} fill={SUN_SOFT} rx={11} strokeWidth={2.6} />
        <Label x={174} y={30} size={9} anchor="start">
          对称 · 一把钥匙
        </Label>
        <Box x={178} y={40} w={38} h={30} fill="#FFFFFF" rx={6} strokeWidth={2.2} />
        <path d="M194 40 V34 A6 6 0 0 1 206 34 V40" fill="none" stroke="#241A3D" strokeWidth={2.4} />
        <circle cx={194} cy={55} r={4} fill="#FFD23F" stroke="#241A3D" strokeWidth={1.8} />
        <path d="M226 50 H262 M226 56 H252" stroke="#241A3D" strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={268} cy={50} r={6} fill="#FFD23F" stroke="#241A3D" strokeWidth={2} />
        <Label x={268} y={76} size={7} fill="#8A6A16">
          加解密都用它
        </Label>
      </Part>

      <Part id="asym" focus={focus}>
        <Box x={6} y={92} w={150} h={78} fill={BRAND_SOFT} rx={11} strokeWidth={2.6} />
        <Label x={16} y={108} size={9} anchor="start">
          非对称 · 两把钥匙
        </Label>
        <Box x={16} y={116} w={50} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={41} y={130} size={7}>
          公钥
        </Label>
        <Box x={16} y={142} w={50} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={41} y={156} size={7}>
          私钥
        </Label>
        <Arrow d="M70 126 H84" color="#7B5CFF" />
        <Label x={110} y={126} size={7} anchor="start" fill="#5B4B9E">
          公钥加密
        </Label>
        <Arrow d="M84 152 H70" color="#7B5CFF" />
        <Label x={110} y={156} size={7} anchor="start" fill="#5B4B9E">
          私钥解密
        </Label>
      </Part>

      <Part id="sign" focus={focus}>
        <Box x={164} y={92} w={150} h={78} fill={MINT_SOFT} rx={11} strokeWidth={2.6} />
        <Label x={174} y={108} size={9} anchor="start">
          签名 · 反过来用
        </Label>
        <Box x={174} y={116} w={40} h={34} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <path d="M180 124 H208 M180 132 H204 M180 140 H200" stroke="#241A3D" strokeWidth={1.8} strokeLinecap="round" />
        <Box x={220} y={120} w={28} h={22} fill="#2ECC8F" rx={5} strokeWidth={2.2} />
        <Label x={234} y={135} size={7} fill="#FFFFFF">
          签
        </Label>
        <Label x={262} y={130} size={7} anchor="start" fill="#127A52">
          私钥签，
        </Label>
        <Label x={262} y={142} size={7} anchor="start" fill="#127A52">
          公钥验
        </Label>
      </Part>
    </svg>
  );
}
