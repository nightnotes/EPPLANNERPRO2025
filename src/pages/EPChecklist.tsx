import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { generateSchedule, ReleaseRow } from "../utils/schedule";
import { getUser } from "../utils/auth";
import { makeKey, getDone, setDone } from "../utils/releaseState";

const END_DATE = '2026-12-31';

type Count = { total: number; done: number; remaining: number };

function useCounts(rows: ReleaseRow[]) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onSync = (e: StorageEvent) => { if (e.key === 'releaseStates') setTick(t => t+1); };
    window.addEventListener('storage', onSync);
    return () => window.removeEventListener('storage', onSync);
  }, []);

  const byWho = (who: "Nuno"|"Martijn"): Count => {
    const mine = rows.filter(r => r.who === who);
    const total = mine.length;
    const done = mine.reduce((acc, r) => acc + (getDone(makeKey(r.date, r.artist)) ? 1 : 0), 0);
    return { total, done, remaining: total - done };
  };
  return { nuno: byWho("Nuno"), martijn: byWho("Martijn"), tick };
}

export default function EPChecklist() {
  const user = getUser();
  const rows = useMemo(() => generateSchedule(new Date('2025-08-25'), new Date(END_DATE)), []);
  const { nuno, martijn } = useCounts(rows);
  const [filter, setFilter] = useState<"all"|"Nuno"|"Martijn">("all");

  const filtered = rows.filter(r => filter === "all" ? true : r.who === filter);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <h1 className="text-2xl font-semibold">EP Checklist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-4">
            <div className="text-sm mb-1">Nuno — {nuno.done}/{nuno.total} (open: {nuno.remaining})</div>
            <progress className="progress w-full" value={nuno.done} max={nuno.total}></progress>
          </div>
          <div className="card p-4">
            <div className="text-sm mb-1">Martijn — {martijn.done}/{martijn.total} (open: {martijn.remaining})</div>
            <progress className="progress w-full" value={martijn.done} max={martijn.total}></progress>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-nn_muted">Filter:</span>
          <button className={`tab ${filter==='all'?'tab-active':''}`} onClick={()=>setFilter('all')}>Alle</button>
          <button className={`tab ${filter==='Nuno'?'tab-active':''}`} onClick={()=>setFilter('Nuno')}>Nuno</button>
          <button className={`tab ${filter==='Martijn'?'tab-active':''}`} onClick={()=>setFilter('Martijn')}>Martijn</button>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Artiest</th>
                <th>Wie</th>
                <th>Distributie</th>
                <th>Klaar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const k = makeKey(r.date, r.artist);
                const done = getDone(k);
                return (
                  <tr key={k}>
                    <td>{r.date}</td>
                    <td>{r.artist}</td>
                    <td>{r.who}</td>
                    <td>{r.distribution}</td>
                    <td>
                      <button
                        className={`h-4 w-4 rounded-full border ${done?'bg-green-500 border-green-600':'bg-red-500 border-red-600'}`}
                        onClick={()=> setDone(k, !done)}
                        title={done?'Klik om terug te zetten':'Klik om klaar te zetten'}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-nn_muted">Ingelogd als {user}. Einddatum telling: {END_DATE}.</div>
      </div>
    </div>
  );
}
