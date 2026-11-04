import type { ReactNode } from 'react';

interface ScreenProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** 有底部导航的页面留出安全距离 */
  withNav?: boolean;
}

export function Screen({ title, subtitle, children, withNav = true }: ScreenProps) {
  return (
    <main
      className={`mx-auto w-full max-w-[880px] px-4 pt-6 ${withNav ? 'pb-28 md:pb-10' : 'pb-10'}`}
    >
      {title && (
        <header className="mb-5">
          <h1 className="text-2xl font-black tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </header>
      )}
      {children}
    </main>
  );
}
