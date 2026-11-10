import { act, cleanup, renderHook } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { useLocalDay } from './useLocalDay';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

it.each([
  [2026, 0, 31, 2026, 1, 1],
  [2026, 11, 31, 2027, 0, 1],
])('本地日期跨月/年：%i-%i-%i只在下一零点刷新', (year, month, date, nextYear, nextMonth, nextDate) => {
  const before = new Date(year, month, date, 23, 59, 59).getTime();
  const next = new Date(nextYear, nextMonth, nextDate).getTime();
  vi.setSystemTime(before);
  const { result } = renderHook(useLocalDay);
  act(() => { vi.advanceTimersByTime(999); });
  expect(result.current).toBe(before);
  act(() => { vi.advanceTimersByTime(1); });
  expect(result.current).toBe(next);
  expect(vi.getTimerCount()).toBe(1);
});

it.each([[2026, 2, 8], [2026, 10, 1]])('按本地日历安排下一零点，兼容23/25小时日：%i-%i-%i', (year, month, date) => {
  const before = new Date(year, month, date).getTime();
  const next = new Date(year, month, date + 1).getTime();
  vi.setSystemTime(before);
  const { result } = renderHook(useLocalDay);
  act(() => { vi.advanceTimersByTime(next - before - 1); });
  expect(result.current).toBe(before);
  act(() => { vi.advanceTimersByTime(1); });
  expect(result.current).toBe(next);
});

it('恢复可见时重新安排零点，隐藏事件不刷新，卸载清除计时器和监听', () => {
  const before = new Date(2026, 10, 9, 23, 59, 59).getTime();
  vi.setSystemTime(before);
  const { result, unmount } = renderHook(useLocalDay, {
    wrapper: ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>,
  });
  expect(vi.getTimerCount()).toBe(1);
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  act(() => {
    vi.setSystemTime(new Date(2026, 10, 11, 23, 59, 59));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(result.current).toBe(before);
  visibility.mockReturnValue('visible');
  act(() => { document.dispatchEvent(new Event('visibilitychange')); });
  expect(result.current).toBe(new Date(2026, 10, 11, 23, 59, 59).getTime());
  act(() => { vi.advanceTimersByTime(1000); });
  expect(result.current).toBe(new Date(2026, 10, 12).getTime());
  unmount();
  act(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(vi.getTimerCount()).toBe(0);
});

it('焦点恢复后时钟回拨也刷新，并按新本地时间安排零点', () => {
  vi.setSystemTime(new Date(2026, 10, 10, 8));
  const { result } = renderHook(useLocalDay);
  act(() => {
    vi.setSystemTime(new Date(2026, 10, 9, 23, 59, 59));
    window.dispatchEvent(new Event('focus'));
  });
  expect(result.current).toBe(new Date(2026, 10, 9, 23, 59, 59).getTime());
  act(() => { vi.advanceTimersByTime(1000); });
  expect(result.current).toBe(new Date(2026, 10, 10).getTime());
});

it('普通重新渲染仍读取当前时刻，不将同日时间固定在首次挂载', () => {
  vi.setSystemTime(new Date(2026, 10, 10, 8));
  const { result, rerender } = renderHook(useLocalDay);
  vi.setSystemTime(new Date(2026, 10, 10, 9));
  rerender();
  expect(result.current).toBe(new Date(2026, 10, 10, 9).getTime());
});
