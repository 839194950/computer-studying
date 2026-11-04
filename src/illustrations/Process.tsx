export function Process({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden="true">
      <rect x="10" y="18" width="90" height="84" rx="14" fill="#EEE9FF" stroke="#241A3D" strokeWidth="3.5" />
      <rect x="120" y="18" width="90" height="84" rx="14" fill="#E6FFF4" stroke="#241A3D" strokeWidth="3.5" />

      <circle cx="55" cy="48" r="12" fill="#7B5CFF" stroke="#241A3D" strokeWidth="3" />
      <circle cx="165" cy="48" r="12" fill="#2ECC8F" stroke="#241A3D" strokeWidth="3" />
      <rect x="28" y="70" width="54" height="10" rx="5" fill="#241A3D" opacity="0.18" />
      <rect x="138" y="70" width="54" height="10" rx="5" fill="#241A3D" opacity="0.18" />

      <path d="M105 60 h10" stroke="#241A3D" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
      <text x="55" y="97" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#5B4B9E">
        进程 A · 独立内存
      </text>
      <text x="165" y="97" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="#127A52">
        进程 B · 独立内存
      </text>
    </svg>
  );
}
