import { useSyncExternalStore } from 'react';

export type Locale = 'zh' | 'en';
export const LANGUAGE_KEY = 'memory-chip-language';
let locale: Locale = 'zh';
let english: Record<string, string> | undefined;
const listeners = new Set<() => void>();

export function getLocale(): Locale { return locale; }

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, () => 'zh' as const);
}

/** Language is a browser preference, separate from the versioned learning save. */
export async function setLocale(next: Locale): Promise<void> {
  if (next === 'en' && !english) english = (await import('./en')).default;
  locale = next;
  try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Still switch for this visit. */ }
  listeners.forEach((listener) => listener());
}

export async function restoreLocale(): Promise<void> {
  let saved: string | null = null;
  try { saved = localStorage.getItem(LANGUAGE_KEY); } catch { /* Default to Chinese. */ }
  if (saved === 'en') await setLocale('en');
}

export function translate(source: string, language: Locale): string {
  return language === 'en' ? (english?.[source] ?? source) : source;
}

/** Numbered placeholders allow English to reorder whole sentences. */
export function t(source: string, values: readonly (string | number)[] = []): string {
  return translate(source, locale).replace(/\{(\d+)\}/g, (match, index: string) => {
    const value = values[Number(index)];
    return value === undefined ? match : typeof value === 'string' ? translate(value, locale) : String(value);
  });
}

export function localize<T>(value: T, language: Locale): T {
  if (language === 'zh') return value;
  if (typeof value === 'string') return translate(value, language) as T;
  if (Array.isArray(value)) return value.map((item) => localize(item, language)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item, language)])) as T;
  }
  return value;
}
