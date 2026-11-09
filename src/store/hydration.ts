type HydrationStatus = 'loading' | 'ready' | 'error';

let status: HydrationStatus = 'loading';
const listeners = new Set<() => void>();

export function getHydrationStatus(): HydrationStatus {
  return status;
}

export function subscribeHydration(notify: () => void): () => void {
  listeners.add(notify);
  return () => { listeners.delete(notify); };
}

export function setHydrationStatus(next: HydrationStatus): void {
  status = next;
  listeners.forEach((notify) => notify());
}
