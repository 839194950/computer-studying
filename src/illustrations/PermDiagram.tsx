import { Box, BRAND_SOFT, DiagramDefs, Label, Part, type DiagramProps } from './base';

export const PERM_PARTS = ['owner', 'group', 'other', 'root'];

const OWNER = ['r', 'w', 'x'];
const GROUP = ['r', '-', 'x'];
const OTHER = ['r', '-', '-'];

const OWNER_FILL = '#C9F7E4';
const GROUP_FILL = '#FFE9A8';
const OTHER_FILL = '#FFD1E5';

function Bits({ x, bits, fill }: { x: number; bits: string[]; fill: string }) {
  return (
    <>
      {bits.map((bit, i) => (
        <g key={`${x}-${i}`}>
          <Box x={x + i * 26} y={30} w={24} h={30} fill={bit === '-' ? '#FFFFFF' : fill} rx={5} strokeWidth={2.2} />
          <Label x={x + 12 + i * 26} y={50} size={11} mono>
            {bit}
          </Label>
        </g>
      ))}
    </>
  );
}

/**
 * 权限：九个字符分三组，分别回答「我是谁、同组是谁、其他人是谁」。
 * 读法固定为 rwx 三格一组，缺哪个就用短横占位。
 */
export function PermDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Box x={12} y={30} w={24} h={30} fill="#EEE9FF" rx={5} strokeWidth={2.2} dashed />
      <Label x={24} y={50} size={10} mono fill="#8B85A6">
        d
      </Label>
      <Label x={24} y={22} size={7} fill="#8B85A6">
        类型
      </Label>

      <Part id="owner" focus={focus}>
        <Bits x={44} bits={OWNER} fill={OWNER_FILL} />
        <path d="M42 68 V72 H118 V68" fill="none" stroke="#241A3D" strokeWidth={2} strokeLinecap="round" />
        <Label x={80} y={86} size={8}>
          所有者
        </Label>
        <Label x={80} y={98} size={7} fill="#127A52">
          读 写 执行
        </Label>
      </Part>

      <Part id="group" focus={focus}>
        <Bits x={126} bits={GROUP} fill={GROUP_FILL} />
        <path d="M124 68 V72 H200 V68" fill="none" stroke="#241A3D" strokeWidth={2} strokeLinecap="round" />
        <Label x={162} y={86} size={8}>
          同组用户
        </Label>
        <Label x={162} y={98} size={7} fill="#8A6A16">
          读 执行
        </Label>
      </Part>

      <Part id="other" focus={focus}>
        <Bits x={208} bits={OTHER} fill={OTHER_FILL} />
        <path d="M206 68 V72 H282 V68" fill="none" stroke="#241A3D" strokeWidth={2} strokeLinecap="round" />
        <Label x={244} y={86} size={8}>
          其他人
        </Label>
        <Label x={244} y={98} size={7} fill="#C1437E">
          只读
        </Label>
      </Part>

      <Part id="owner" focus={focus}>
        <Label x={160} y={118} size={7.5} fill="#8B85A6">
          r = 4，w = 2，x = 1；所以 rwxr-xr-- 就是 754
        </Label>
      </Part>

      <Part id="root" focus={focus}>
        <Box x={6} y={128} w={308} h={40} fill={BRAND_SOFT} rx={10} strokeWidth={2.4} />
        <Label x={160} y={146} size={8.5}>
          root（uid 0）不受这套检查约束
        </Label>
        <Label x={160} y={160} size={7.5} fill="#8B85A6">
          所以服务进程要用专用低权限账号跑，别拿 root 顶
        </Label>
      </Part>
    </svg>
  );
}
