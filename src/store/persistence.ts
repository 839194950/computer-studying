/**
 * 写盘结果的可观测性。
 * zustand 的 persist 会把 IndexedDB / localStorage 的写入错误吞掉，
 * 无痕模式或配额写满时用户以为存上了、其实丢了。这里把失败留住并广播出去。
 */

export interface SaveState {
  ok: boolean;
}

type Writer = (name: string, value: string) => Promise<void>;

let state: SaveState = { ok: true };
let pending: { name: string; value: string } | null = null;
let writer: Writer | null = null;
const listeners = new Set<() => void>();

function setState(next: SaveState): void {
  if (next.ok === state.ok) return;
  state = next;
  listeners.forEach((notify) => notify());
}

export function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function getSaveState(): SaveState {
  return state;
}

/** 真正的写盘函数：storage 适配器启动时注册一次，「重试」复用它。 */
export function registerWriter(next: Writer): void {
  writer = next;
}

/**
 * 尝试写一次。失败不抛错（persist 不需要知道），
 * 但会记住这份数据，供重试时原样重放。
 */
export async function attemptSave(name: string, value: string, write: Writer): Promise<void> {
  try {
    await write(name, value);
    pending = null;
    setState({ ok: true });
  } catch {
    pending = { name, value };
    setState({ ok: false });
  }
}

/** 重试上次失败的那份数据；没有失败记录时什么也不做。 */
export async function retrySave(): Promise<void> {
  if (!pending || !writer) return;
  const { name, value } = pending;
  await attemptSave(name, value, writer);
}
