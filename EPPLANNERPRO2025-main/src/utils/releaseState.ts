export type TaskKey = string; // `${date}__${artist}`
export type TaskState = { splits?: boolean; buma?: boolean; done?: boolean };

const KEY = 'releaseStates';

export function makeKey(date: string, artist: string): TaskKey {
  return `${date}__${artist}`;
}

export function loadStates(): Record<TaskKey, TaskState> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
export function saveStates(s: Record<TaskKey, TaskState>) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: JSON.stringify(s) } as any));
}
export function setDone(k: TaskKey, v: boolean) {
  const s = loadStates();
  s[k] = { ...(s[k]||{}), done: v };
  saveStates(s);
}
export function getDone(k: TaskKey): boolean {
  return !!loadStates()[k]?.done;
}
