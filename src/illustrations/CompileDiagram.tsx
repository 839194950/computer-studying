import { MINT, Ripple, anim, Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const COMPILE_PARTS = ['source', 'compile', 'link', 'runtime'];

/**
 * 从源码到运行：四段流水线。
 * 每一段都产出确定形态的中间物（.c → .o → 可执行文件 → 进程），
 * 让人看到"代码变成程序"不是一步，而是四次形态转换。
 */
export function CompileDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="source" focus={focus}>
        <Box x={6} y={38} w={66} h={72} fill={PAPER} />
        <Label x={39} y={30} size={10}>
          源代码
        </Label>
        <Label x={39} y={56} size={8} mono fill="#5B4B9E">
          main.c
        </Label>
        <rect x={14} y={64} width={44} height={4} rx={2} fill="#241A3D" opacity="0.22" />
        <rect x={14} y={74} width={34} height={4} rx={2} fill="#241A3D" opacity="0.22" />
        <rect x={14} y={84} width={40} height={4} rx={2} fill="#241A3D" opacity="0.22" />
        <Label x={39} y={124} size={8} fill="#8B85A6">
          人写的东西
        </Label>
      </Part>

      <Part id="compile" focus={focus}>
        <Box x={86} y={38} w={68} h={72} fill={BRAND_SOFT} />
        <Label x={120} y={30} size={10}>
          编译
        </Label>
        <Label x={120} y={56} size={8}>
          词法 · 语法
        </Label>
        <Label x={120} y={70} size={8}>
          语义 · 优化
        </Label>
        <rect x={94} y={82} width={52} height={18} rx={5} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Label x={120} y={95} size={8} mono>
          main.o
        </Label>
        <Label x={120} y={124} size={8} fill="#8B85A6">
          一份机器码
        </Label>
      </Part>

      <Part id="link" focus={focus}>
        <Box x={168} y={38} w={68} h={72} fill={SUN_SOFT} />
        <Label x={202} y={30} size={10}>
          链接
        </Label>
        <rect x={176} y={50} width={22} height={14} rx={4} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <rect x={176} y={68} width={22} height={14} rx={4} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Label x={187} y={60} size={7} mono>
          .o
        </Label>
        <Label x={187} y={78} size={7} mono>
          .a
        </Label>
        <path d="M200 58 H208 M200 76 H208" stroke="#8E84B3" strokeWidth={1.6} strokeLinecap="round" />
        <rect x={210} y={58} width={18} height={24} rx={5} fill="#7B5CFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Label x={202} y={124} size={8} fill="#8B85A6">
          拼成一个文件
        </Label>
      </Part>

      <Part id="runtime" focus={focus}>
        <Box x={250} y={38} w={64} h={72} fill={MINT_SOFT} />
        <Label x={282} y={30} size={10}>
          运行
        </Label>
        <Box x={258} y={50} w={48} h={40} fill={SKY_SOFT} rx={8} strokeWidth={2.4} />
        <circle cx={282} cy={66} r={7} fill="#2ECC8F" stroke="#8E84B3" strokeWidth={1.6} {...anim('pulse')} />
        <Ripple cx={282} cy={66} r={7} color={MINT} />
        <rect x={266} y={78} width={32} height={4} rx={2} fill="#241A3D" opacity="0.22" />
        <Label x={282} y={124} size={8} fill="#8B85A6">
          内存里跑起来
        </Label>
      </Part>

      <Arrow d="M74 74 H84" />
      <Arrow d="M156 74 H166" />
      <Arrow d="M238 74 H248" />
      <Label x={160} y={166} size={9} fill="#8B85A6">
        每一步都把代码换一种形态
      </Label>
    </svg>
  );
}
