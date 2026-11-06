import type { DetailSection } from '../../content';
import { Icon } from '../../components/Icon';

/** 详细讲解面板：讲解面默认收起，答错时默认展开。用原生 details，键盘和读屏都友好。 */
export function DetailPanel({
  cardId,
  detail,
  defaultOpen = false,
  className = 'mt-4',
}: {
  cardId: string;
  detail: DetailSection[];
  defaultOpen?: boolean;
  className?: string;
}) {
  if (detail.length === 0) return null;
  return (
    <details
      key={cardId}
      open={defaultOpen}
      className={`group overflow-hidden rounded-2xl border-2 border-line bg-white ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 transition-colors hover:bg-paper [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-sm font-black text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-soft text-sky-dark">
            <Icon name="book" size={16} />
          </span>
          详细讲解
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
          {detail.length} 节
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="transition-transform duration-200 group-open:rotate-180"
          >
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>
      <div className="space-y-4 border-t-2 border-line px-4 py-4">
        {detail.map((section, i) => (
          <section key={section.heading} className="flex gap-3">
            <span className="tabular mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-black text-brand-dark">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-ink">{section.heading}</h3>
              <p className="mt-1 text-[14px] leading-[1.85] text-ink/80">{section.body}</p>
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}
