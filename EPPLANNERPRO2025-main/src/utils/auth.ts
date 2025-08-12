
export const USERS = ["Nuno", "Martijn"] as const;
export type User = typeof USERS[number];
const PASSWORD = "123!";
const KEY = "epplanner:user";
export function login(user: User, password: string): boolean {
  if (password !== PASSWORD) return false;
  localStorage.setItem(KEY, user);
  return true;
}
export function getUser(): User | null {
  const v = localStorage.getItem(KEY);
  return (USERS as readonly string[]).includes(v || "") ? (v as any) : null;
}
export function logout() { localStorage.removeItem(KEY); }
