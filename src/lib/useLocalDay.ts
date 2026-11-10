import { useEffect, useReducer } from 'react';
import { addDays } from './time';

export function useLocalDay(): number {
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function schedule() {
      const now = Date.now();
      clearTimeout(timer);
      timer = setTimeout(update, addDays(now, 1) - now);
    }

    function update() {
      refresh();
      schedule();
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') update();
    }

    schedule();
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return Date.now();
}
