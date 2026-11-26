import { useState } from 'react';
import { setLocale, useLocale } from '../i18n/locale';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function switchLanguage() {
    if (loading) return;
    setLoading(true);
    setFailed(false);
    try { await setLocale(locale === 'zh' ? 'en' : 'zh'); }
    catch { setFailed(true); }
    finally { setLoading(false); }
  }

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2 text-xs font-bold">
      {failed && <span role="alert">{locale === 'zh' ? '英文内容加载失败，请重试。' : 'Could not load the language. Try again.'}</span>}
      <button
        type="button"
        onClick={() => void switchLanguage()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
        }}
        disabled={loading}
        lang={locale === 'zh' ? 'en' : 'zh-CN'}
        aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
        aria-busy={loading}
        className="min-h-11 rounded-xl border-2 border-line bg-white px-3 py-2 text-brand-dark hover:border-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:opacity-60"
      >
        {loading ? '…' : locale === 'zh' ? 'English' : '中文'}
      </button>
    </div>
  );
}
