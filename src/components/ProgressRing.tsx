interface ProgressRingProps {
  value: number;
  size?: number;
  label?: string;
  stroke?: number;
}

export function ProgressRing({ value, size = 96, label = '记牢了', stroke = 12 }: ProgressRingProps) {
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = Math.max(0, Math.min(100, safe));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ECEAF6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2ECC8F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black leading-none text-ink">{Math.round(clamped)}</span>
        <span className="mt-1 text-[10px] font-bold text-muted">{label}</span>
      </div>
    </div>
  );
}
