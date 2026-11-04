export function Hash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden="true">
      <path
        d="M24 16 H196 L136 76 V104 L84 104 V76 Z"
        fill="#FFE8F2"
        stroke="#241A3D"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="58" cy="38" r="8" fill="#7B5CFF" stroke="#241A3D" strokeWidth="3" />
      <circle cx="92" cy="30" r="6" fill="#5AD2FF" stroke="#241A3D" strokeWidth="3" />
      <circle cx="126" cy="40" r="7" fill="#FFD23F" stroke="#241A3D" strokeWidth="3" />
      <rect x="94" y="82" width="32" height="12" rx="6" fill="#2ECC8F" stroke="#241A3D" strokeWidth="3" />
      <text x="110" y="118" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#8B85A6">
        a1b2c3…
      </text>
    </svg>
  );
}
