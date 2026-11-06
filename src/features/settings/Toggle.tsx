import { motion } from 'framer-motion';

/** iOS 风格开关。底层仍是 checkbox，读屏与键盘行为不变。 */
export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs font-semibold text-muted">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30 ${
          checked ? 'bg-mint' : 'bg-[#DCD8E8]'
        }`}
      >
        <motion.span
          className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
          initial={false}
          animate={{ left: checked ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 600, damping: 34 }}
        />
      </span>
    </label>
  );
}
