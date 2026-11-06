import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { newProgress, review, type CardProgress } from '../lib/srs';
import { bumpStreak, masteryPercent, resolveStreak, type Streak } from '../lib/stats';
import { addDays, dayKey, startOfDay } from '../lib/time';
import { attemptSave, registerWriter } from './persistence';

export interface DailySnapshot {
  date: string;
  mastery: number;
  reviewed: number;
}

export interface SessionState {
  date: string;
  reviewed: string[];
  wrongs: Record<string, number>;
  completed: boolean;
}

export interface AppState {
  progress: Record<string, CardProgress>;
  streak: Streak;
  snapshots: DailySnapshot[];
  session: SessionState;
  settings: { newCardsPerDay: number; reducedMotion: boolean };
  version: number;
}

export const EMPTY_STATE: AppState = {
  progress: {},
  streak: { current: 0, longest: 0, lastActiveDate: null },
  snapshots: [],
  session: { date: '', reviewed: [], wrongs: {}, completed: false },
  settings: { newCardsPerDay: 10, reducedMotion: false },
  version: 1,
};

function emptySession(now: number): SessionState {
  return { date: dayKey(now), reviewed: [], wrongs: {}, completed: false };
}

export function createAppState(now: number): AppState {
  return {
    progress: {},
    streak: { current: 0, longest: 0, lastActiveDate: null },
    snapshots: [],
    session: emptySession(now),
    settings: { newCardsPerDay: 10, reducedMotion: false },
    version: 1,
  };
}

/** 跨天时把当日会话换成新的；其余状态不动。 */
function ensureToday(s: AppState, now: number): AppState {
  const today = dayKey(now);
  if (s.session.date === today) return s;
  return { ...s, session: emptySession(now) };
}

export function applyAnswer(
  state: AppState,
  cardId: string,
  correct: boolean,
  now: number,
): AppState {
  const s = ensureToday(state, now);
  const current = s.progress[cardId] ?? newProgress(cardId, now);
  const reviewed = review(current, correct, now);

  const wrongsToday = correct ? (s.session.wrongs[cardId] ?? 0) : (s.session.wrongs[cardId] ?? 0) + 1;
  // 同一张卡当天连错两次就"放过它"：排到明天，而不是立刻重新到期。
  const next =
    !correct && wrongsToday >= 2
      ? { ...reviewed, dueAt: startOfDay(addDays(now, 1)) }
      : reviewed;

  return {
    ...s,
    progress: { ...s.progress, [cardId]: next },
    session: {
      ...s.session,
      reviewed: s.session.reviewed.includes(cardId)
        ? s.session.reviewed
        : [...s.session.reviewed, cardId],
      wrongs: correct ? s.session.wrongs : { ...s.session.wrongs, [cardId]: wrongsToday },
    },
  };
}

/** 当天首次完成任务时记连胜 + 写快照；重复调用是幂等的。 */
export function applyFinish(state: AppState, totalCards: number, now: number): AppState {
  const s = ensureToday(state, now);
  if (s.session.completed) return s;

  const snapshot: DailySnapshot = {
    date: s.session.date,
    mastery: masteryPercent(s.progress, totalCards),
    reviewed: s.session.reviewed.length,
  };
  const snapshots = [...s.snapshots.filter((x) => x.date !== snapshot.date), snapshot].slice(-365);

  return {
    ...s,
    session: { ...s.session, completed: true },
    streak: bumpStreak(s.streak, now),
    snapshots,
  };
}

export function exportState(s: AppState): string {
  return JSON.stringify(s, null, 2);
}

export function parseState(raw: string): { ok: true; state: AppState } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: '文件不是合法的 JSON' };
  }
  if (!data || typeof data !== 'object') return { ok: false, error: '文件内容格式不对' };
  const d = data as Partial<AppState>;
  if (d.version !== 1) return { ok: false, error: '数据版本不匹配，无法导入' };
  if (!d.progress || typeof d.progress !== 'object' || Array.isArray(d.progress)) {
    return { ok: false, error: '缺少学习进度数据' };
  }
  const brokenEntry = Object.values(d.progress as Record<string, unknown>).some((entry) => {
    const p = entry as Partial<CardProgress> | null;
    return (
      !p ||
      typeof p !== 'object' ||
      typeof p.cardId !== 'string' ||
      typeof p.dueAt !== 'number' ||
      !Number.isFinite(p.dueAt) ||
      ![1, 2, 3, 4, 5].includes(p.box as number)
    );
  });
  if (brokenEntry) return { ok: false, error: '进度数据里有损坏的卡片记录' };
  if (!d.settings || typeof d.settings.newCardsPerDay !== 'number') {
    return { ok: false, error: '缺少设置数据' };
  }
  if (!d.streak || typeof d.streak.current !== 'number') return { ok: false, error: '缺少连胜数据' };

  return {
    ok: true,
    state: {
      ...EMPTY_STATE,
      ...d,
      snapshots: Array.isArray(d.snapshots) ? d.snapshots : [],
      session: d.session ?? emptySession(Date.now()),
      settings: { ...EMPTY_STATE.settings, ...d.settings },
      version: 1,
    },
  };
}

/**
 * 真正的写盘：IndexedDB 优先，浏览器不支持时回落 localStorage。
 * 抛出的错误交给 attemptSave 记录，界面才能提示「进度没能保存」。
 */
export async function persistToDisk(name: string, value: string): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    localStorage.setItem(name, value);
    return;
  }
  await idbSet(name, value);
}

registerWriter(persistToDisk);

const idbStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    if (typeof indexedDB === 'undefined') return localStorage.getItem(name);
    return (await idbGet(name)) ?? null;
  },
  // 失败不往外抛：persist 会把 reject 变成未处理异常，界面也拿不到信号。
  setItem: (name: string, value: string) => attemptSave(name, value, persistToDisk),
  removeItem: async (name: string) => {
    if (typeof indexedDB === 'undefined') {
      localStorage.removeItem(name);
      return;
    }
    await idbDel(name);
  },
}));

interface Actions {
  answer: (cardId: string, correct: boolean) => void;
  finishSession: (totalCards: number) => void;
  setSettings: (patch: Partial<AppState['settings']>) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => { ok: true } | { ok: false; error: string };
}

export const useStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      ...createAppState(Date.now()),
      answer: (cardId, correct) => set((s) => applyAnswer(s, cardId, correct, Date.now())),
      finishSession: (totalCards) => set((s) => applyFinish(s, totalCards, Date.now())),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetAll: () => set(() => createAppState(Date.now())),
      exportJson: () => exportState(get()),
      importJson: (raw) => {
        const parsed = parseState(raw);
        if (!parsed.ok) return parsed;
        set(() => parsed.state);
        return { ok: true };
      },
    }),
    {
      name: 'memory-chip',
      storage: idbStorage,
      partialize: (s) => ({
        progress: s.progress,
        streak: resolveStreak(s.streak, Date.now()),
        snapshots: s.snapshots,
        session: s.session,
        settings: s.settings,
        version: s.version,
      }),
    },
  ),
);
