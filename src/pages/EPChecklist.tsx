
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { generateSchedule, ReleaseRow } from "../utils/schedule";
import { getUser } from "../utils/auth";

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
  const [last, setLast] = useState<ReleaseRow | null>(() => {
    try { const v = localStorage.getItem(LAST_KEY); return v ? JSON.parse(v) as ReleaseRow : null; } catch { return null; }
  });

  // base rows for whole period
  const rows = useMemo(() => generateSchedule(new Date("2025-08-25"), new Date("2026-12-31")), []);

  // filter to current user and next 45 days window
  const windowEnd = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 45); return d;
  }, []);
  const myRows = useMemo(() => {
    const inWindow = rows.filter(r => {
      const [dd,mm,yy] = r.date.split("-").map(Number);
      const d = new Date(yy, mm-1, dd);
      return d <= windowEnd;
    });
    return inWindow.filter(r => r.who === user);
  }, [rows, user, windowEnd]);

  const next = useMemo(() => {
    return myRows.find(r => !states[idFor(r)]?.done) || null;
  }, [myRows, states]);

  const total = myRows.length;
  const doneCount = myRows.filter(r => states[idFor(r)]?.done).length;
  const pct = total ? Math.round((doneCount/total)*100) : 0;

  useEffect(() => {
    function onStorage() { setStates(loadStates()); }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function persist(r: ReleaseRow, s: TaskState) {
    const map = { ...states, [idFor(r)]: s };
    setStates(map); saveStates(map);
  }

  function toggle(r: ReleaseRow, key: keyof TaskState) {
    const cur = states[idFor(r)] || {};
    const newVal = !cur[key];
    let nextState: TaskState = { ...cur, [key]: newVal };

    // Klaar kan alleen aan als splits + buma beide aan staan
    if (key === "done" && newVal === true && !(nextState.splits && nextState.buma)) {
      return;
    }
    // Als splits/buma uitgaat, forceer done=false
    if ((key === "splits" || key === "buma") && !newVal) {
      nextState.done = false;
    }

    // Als 'done' net op true gaat -> opslaan als 'last'
    if (key === "done" && newVal === true) {
      localStorage.setItem(LAST_KEY, JSON.stringify(r));
      setLast(r);
    }

    persist(r, nextState);
  }

  function restoreLast() {
    if (!last) return;
    const id = idFor(last);
    const cur = states[id] || {};
    const newState = { ...cur, done: false };
    persist(last, newState);
    setLast(null);
    localStorage.removeItem(LAST_KEY);
  }

  return (
    <div>
      <Navbar />
      <div className="section pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Sidebar quick links */}
          <aside className="md:col-span-3">
            <div className="card p-4 sticky top-20">
              <div className="text-sm text-nn_muted mb-2">Snel naar</div>
              <div className="flex flex-col gap-2">
                <a className="tab tab-active text-center" href="https://distrokid.com/new/" target="_blank" rel="noreferrer">DistroKid</a>
                <a className="tab tab-active text-center" href="https://artist.amuse.io/studio" target="_blank" rel="noreferrer">Amuse</a>
                <a className="tab tab-active text-center" href="https://mijn.bumastemra.nl/" target="_blank" rel="noreferrer">Buma/Stemra</a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">EP Checklist</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-nn_muted">{doneCount}/{total}</span>
                <progress max={100} value={pct} aria-label="voortgang"></progress>
              </div>
            </div>

            <div className="card p-5 fade-in">
              <div className="text-sm text-nn_muted mb-3">Volgende taak voor <b>{user}</b></div>
              {!next ? (
                <div className="text-nn_muted">Geen openstaande taken 🎉</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3 items-center">
                  <div className="lg:col-span-4 font-medium">{next.date} — <b>{next.artist}</b></div>
                  <div className="lg:col-span-2">{next.who}</div>
                  <div className="lg:col-span-2">{next.distribution}</div>
                  <div className="lg:col-span-4">
                    <div className="next-task-actions flex items-center justify-end gap-2 sm:gap-3">
                      <button className={"round-toggle " + ((states[idFor(next)]?.splits) ? "on" : "")} onClick={()=>toggle(next, 'splits')} aria-pressed={!!states[idFor(next)]?.splits}>Splits</button>
                      <button className={"round-toggle " + ((states[idFor(next)]?.buma) ? "on" : "")} onClick={()=>toggle(next, 'buma')} aria-pressed={!!states[idFor(next)]?.buma}>Buma/Stemra</button>
                      <button className={"round-toggle " + ((states[idFor(next)]?.done) ? "on" : "")} disabled={!(states[idFor(next)]?.splits && states[idFor(next)]?.buma)} onClick={()=>toggle(next, 'done')} aria-pressed={!!states[idFor(next)]?.done}>Klaar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card p-5 fade-in">
              <div className="font-semibold mb-2">Laatst afgerond</div>
              {!last ? (
                <div className="text-nn_muted">Nog niks afgerond.</div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{last.date} — <b>{last.artist}</b> ({last.distribution})</span>
                  <button className="px-3 py-1 rounded-full bg-nn_accent text-white hover:opacity-90 text-sm" onClick={restoreLast}>Herstel</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
