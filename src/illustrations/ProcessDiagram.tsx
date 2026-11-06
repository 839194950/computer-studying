import { Ripple, Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const PROCESS_PARTS = ['proc', 'thread', 'shared', 'switch'];

function ProcBox({ x, title, fill, focus }: { x: number; title: string; fill: string; focus?: string[] }) {
  return (
    <>
      <Part id="proc" focus={focus}>
        <Box x={x} y={18} w={146} h={104} fill={fill} rx={12} strokeWidth={2.8} />
        <Label x={x + 12} y={34} size={9} anchor="start">
          {title}
        </Label>
      </Part>
      <Part id="shared" focus={focus}>
        <Box x={x + 8} y={42} w={62} h={22} fill={MINT_SOFT} rx={5} strokeWidth={2} />
        <Label x={x + 39} y={57} size={7}>
          堆 · 全局
        </Label>
        <Box x={x + 8} y={70} w={62} h={22} fill={PAPER} rx={5} strokeWidth={2} />
        <Label x={x + 39} y={85} size={7}>
          代码段
        </Label>
        <Label x={x + 39} y={108} size={7} fill="#8B85A6">
          地址空间私有
        </Label>
      </Part>
      <Part id="thread" focus={focus}>
        <Box x={x + 78} y={42} w={58} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={x + 107} y={57} size={7}>
          线程 1
        </Label>
        <Box x={x + 78} y={70} w={58} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={x + 107} y={85} size={7}>
          线程 2
        </Label>
        <Label x={x + 107} y={108} size={7} fill="#8B85A6">
          各自独立栈
        </Label>
      </Part>
    </>
  );
}

/**
 * 进程与线程：两间互不相通的房子，每间房子里住着几个人。
 * 房子之间搬东西要走 IPC，屋里的人共用厨房和客厅（堆、文件）。
 */
export function ProcessDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <ProcBox x={6} title="进程 A" fill={BRAND_SOFT} focus={focus} />
      <ProcBox x={160} title="进程 B" fill={SUN_SOFT} focus={focus} />

      <line x1={155} y1={20} x2={155} y2={120} stroke="#8E84B3" strokeWidth={1.6} strokeDasharray="5 5" opacity="0.4" />
      <Label x={155} y={140} size={8} fill="#8B85A6">
        地址空间隔离
      </Label>

      <Part id="switch" focus={focus}>
        <circle cx={155} cy={160} r={11} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Ripple cx={155} cy={160} r={11} />
        <Label x={155} y={164} size={7}>
          CPU
        </Label>
        <Arrow d="M146 152 C 130 144, 110 142, 96 140" dashed />
        <Arrow d="M164 152 C 180 144, 200 142, 214 140" dashed />
        <Label x={52} y={174} size={7} fill="#8B85A6">
          时间片用完就换
        </Label>
      </Part>
    </svg>
  );
}
