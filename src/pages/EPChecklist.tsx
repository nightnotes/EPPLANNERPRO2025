import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getUser } from "../utils/auth";
import { generateSchedule, ReleaseRow } from "../utils/schedule";
import { getShared, setShared, startPolling } from "../utils/sharedClient";

type TaskState = { splits?: boolean; buma?: boolean; done?: boolean };
type StateMap = Record<string, TaskState>;

const KEY = "releaseStates";
const LAST_KEY = "lastTask";

function loadStates(): StateMap {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveStates(s: StateMap) { localStorage.setItem(KEY, JSON.stringify(s)); }
function idFor(r: ReleaseRow) { return `${r.date}_${r.artist}`; }

export default function EPChecklist() {
  const user = getUser() || "Nuno";

  const [states, setStates] = useState<StateMap>(() => loadStates());
  const [sharedOk, setSharedOk] = useState<boolean | null>(null);
  const [last, setLast] = useState<ReleaseRow | null>(() => {
    try { const v = localStorage.getItem(LAST_KEY); return v ? JSON.parse(v) as ReleaseRow : null; } catch { return null; }
  });

  // Build rows for next 45 days for current user
  const rows = useMemo(() => generateSchedule(new Date("2025-08-25"), new Date("2026-12-31")), []);
  const windowEnd = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 45); return d; }, []);
  const myRows = useMemo(() => {
    const inWindow = rows.filter(r => {
      const [dd,mm,yy] = r.date.split("-").map(Number);
      const d = new Date(yy, mm-1, dd);
      return d <= windowEnd;
    });
    return inWindow.filter(r => r.who === user);
  }, [rows, user, windowEnd]);

  useEffect(() => {
    let stop: any = null;
    (async () => {
      try {
        const initial = await getShared('releases_state');
        if (initial && typeof initial === 'object') {
          setStates(initial as StateMap);
          setSharedOk(true);
        } else {
          setSharedOk(false);
        }
      } catch {
        setSharedOk(false);
      }
      stop = startPolling('releases_state', (data: any) => {
        if (data && typeof data === 'object') {
          setStates(data as StateMap);
          setSharedOk(true);
        }
      });
    })();
    return () => { if (stop) stop(); };
  }, []);

  async function persist(r: ReleaseRow, s: TaskState) {
    const map = { ...states, [idFor(r)]: s };
    setStates(map);
    saveStates(map);
    try { await setShared('releases_state', map); } catch {}
  }

  async function toggle(r: ReleaseRow, key: keyof TaskState) {
    const cur = states[idFor(r)] || {};
    const newVal = !cur[key];
    let nextState: TaskState = { ...cur, [key]: newVal };

    // done kan alleen aan als splits + buma beide aan staan
    if (key === "done" && newVal === true && !(nextState.splits && nextState.buma)) {
      return;
    }
    // splits/buma uit → done=false
    if ((key === "splits" || key === "buma") && !newVal) {
      nextState.done = false;
    }

    if (key === "done" && newVal === true) {
      localStorage.setItem(LAST_KEY, JSON.stringify(r));
      setLast(r);
    }

    await persist(r, nextState);
  }

  function restoreLast() {
    if (!last) return;
    const id = idFor(last);
    const cur = states[id] || {};
    const newState: TaskState = { ...cur, splits: true, buma: true, done: true };
    persist(last, newState);
    setLast(null);
    localStorage.removeItem(LAST_KEY);
  }

  return (
    <div>
      <Navbar />
      <div className="section pt-6">
        <div className="mb-4">
          {sharedOk === null ? (
            <span className="px-2 py-1 text-xs rounded-full bg-nn_bg2 border border-nn_border">Sync-status controleren…</span>
          ) : sharedOk ? (
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/40">Gedeelde modus actief</span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/40">Offline modus (alleen lokaal)</span>
          )}
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">EP Checklist — {user}</h1>
            {last ? (
              <button className="px-3 py-1 rounded-full bg-nn_accent hover:opacity-90 text-sm" onClick={restoreLast}>Herstel laatste 'done'</button>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-nn_muted">
                <tr>
                  <th className="text-left py-2">Datum</th>
                  <th className="text-left py-2">Artiest</th>
                  <th className="text-left py-2">Dist.</th>
                  <th className="text-left py-2">Splits</th>
                  <th className="text-left py-2">Buma</th>
                  <th className="text-left py-2">Klaar</th>
                </tr>
              </thead>
              <tbody>
                {myRows.map((r) => {
                  const st = states[idFor(r)] || {};
                  return (
                    <tr key={idFor(r)} className="border-t border-nn_border/40">
                      <td className="py-2">{r.date}</td>
                      <td className="py-2">{r.artist}</td>
                      <td className="py-2">{r.distribution}</td>
                      <td className="py-2">
                        <input type="checkbox" checked={!!st.splits} onChange={() => toggle(r, "splits")} />
                      </td>
                      <td className="py-2">
                        <input type="checkbox" checked={!!st.buma} onChange={() => toggle(r, "buma")} />
                      </td>
                      <td className="py-2">
                        <input type="checkbox" checked={!!st.done} onChange={() => toggle(r, "done")} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
