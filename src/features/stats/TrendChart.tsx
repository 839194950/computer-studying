import type { DailySnapshot } from '../../store/useStore';

interface TrendChartProps {
  snapshots: DailySnapshot[];
}

const W = 640;
const H = 160;
const PAD = 16;

/** 近 30 天掌握度折线；少于 2 个点时只画点。 */
export function TrendChart({ snapshots }: TrendChartProps) {
  const data = snapshots.slice(-30);
  if (data.length === 0) {
    return (
      <div className="rounded-sticker border-[3px] border-dashed border-ink/25 px-3 py-6 text-center text-xs font-bold text-muted">
        还没有历史数据，完成今天的一轮就会记下第一个点。
      </div>
    );
  }

  const max = Math.max(10, ...data.map((d) => d.mastery));
  const step = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0;
  const point = (d: DailySnapshot, i: number) => {
    const x = PAD + i * step;
    const y = H - PAD - (d.mastery / max) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  return (
    <div className="rounded-sticker border-[3px] border-ink bg-white p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" role="img" aria-label="近 30 天掌握度趋势">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#ECEAF6" strokeWidth="2" />
        {data.length > 1 && (
          <polyline
            points={data.map(point).join(' ')}
            fill="none"
            stroke="#7B5CFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {data.map((d, i) => {
          const [x, y] = point(d, i).split(',');
          return <circle key={d.date} cx={x} cy={y} r="5" fill="#FFD23F" stroke="#241A3D" strokeWidth="2.5" />;
        })}
      </svg>
    </div>
  );
}
