export function Pointer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden="true">
      <rect x="6" y="14" width="62" height="34" rx="10" fill="#FFD23F" stroke="#241A3D" strokeWidth="3.5" />
      <text x="37" y="38" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" fontWeight="700" fill="#241A3D">
        p
      </text>

      <path d="M68 31 C 100 31, 118 60, 148 78" stroke="#241A3D" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M138 70 L152 82 L134 86" stroke="#241A3D" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />

      <rect x="12" y="76" width="42" height="34" rx="9" fill="#FFFFFF" stroke="#241A3D" strokeWidth="3" />
      <rect x="62" y="76" width="42" height="34" rx="9" fill="#FFFFFF" stroke="#241A3D" strokeWidth="3" />
      <rect x="112" y="76" width="42" height="34" rx="9" fill="#D9FFF0" stroke="#241A3D" strokeWidth="3" />
      <text x="133" y="99" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700" fill="#127A52">
        42
      </text>
      <rect x="162" y="76" width="42" height="34" rx="9" fill="#FFFFFF" stroke="#241A3D" strokeWidth="3" />
    </svg>
  );
}
