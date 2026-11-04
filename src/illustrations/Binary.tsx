export function Binary({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={16 + i * 50}
            y="26"
            width="38"
            height="68"
            rx="10"
            fill={i % 2 === 0 ? '#7B5CFF' : '#FFFFFF'}
            stroke="#241A3D"
            strokeWidth="3.5"
          />
          <circle cx={35 + i * 50} cy={i % 2 === 0 ? 44 : 76} r="8" fill={i % 2 === 0 ? '#FFD23F' : '#2ECC8F'} stroke="#241A3D" strokeWidth="3" />
          <text
            x={35 + i * 50}
            y="74"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="14"
            fontWeight="700"
            fill={i % 2 === 0 ? '#FFFFFF' : '#8B85A6'}
          >
            {i % 2 === 0 ? '1' : '0'}
          </text>
        </g>
      ))}
    </svg>
  );
}
