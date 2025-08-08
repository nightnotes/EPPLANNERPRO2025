export type ReleaseRow = {
  date: string;
  artist: string;
  who: "Nuno" | "Martijn";
  distribution: "Distrokid" | "Amuse";
};

const AMUSE_ORDER = [
  "Dreamflow", "Poluz", "Doris Lost", "Eternal", "Slaapmutsje", "ZizZa", "Sleepy Taes",
];

const DISTROKID_ORDER = [
  "Muted Mind","Swooshy","Evelyn Winter","Krople","Katty","Sophia Vale","Domindo Nuni",
  "Motionless","Loomy","Eleanor Moon","Luna Nights","Ava Willow","Sleepy Delrow",
  "Lila Serene","Soft Dawn","Nunery Dream","Celestine Viora","Ludo Legato"
];

const WHO_BY_ARTIST: Record<string, "Nuno" | "Martijn"> = {
  "Dreamflow":"Nuno","Poluz":"Nuno","Doris Lost":"Nuno","Eternal":"Nuno","Slaapmutsje":"Nuno","ZizZa":"Nuno","Sleepy Taes":"Nuno",
  "Muted Mind":"Martijn","Swooshy":"Martijn","Evelyn Winter":"Martijn","Krople":"Martijn","Katty":"Martijn","Sophia Vale":"Martijn","Domindo Nuni":"Martijn",
  "Motionless":"Martijn","Loomy":"Martijn","Eleanor Moon":"Martijn","Luna Nights":"Martijn","Ava Willow":"Martijn","Sleepy Delrow":"Martijn",
  "Lila Serene":"Martijn","Soft Dawn":"Martijn","Nunery Dream":"Martijn","Celestine Viora":"Martijn","Ludo Legato":"Martijn"
};

function pad(n: number){ return n.toString().padStart(2,'0'); }
function fmt(d: Date){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function getISOWeek(date: Date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstThursdayDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstThursdayDayNr + 3);
  const weekNumber = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return weekNumber;
}

export function generateSchedule(start: Date = new Date('2025-08-25'), end: Date = new Date('2026-12-31')): ReleaseRow[] {
  const rows: ReleaseRow[] = [];
  let dkIdx = 0, amIdx = 0;
  let prevWeek: number | null = null;
  let double = false;

  const cur = new Date(start);
  while (cur <= end) {
    const w = getISOWeek(cur);
    if (w !== prevWeek) { double = !double; prevWeek = w; }
    const dkArtist = DISTROKID_ORDER[dkIdx % DISTROKID_ORDER.length];
    rows.push({ date: fmt(cur), artist: dkArtist, who: WHO_BY_ARTIST[dkArtist] ?? "Martijn", distribution: "Distrokid" });
    dkIdx++;
    if (double) {
      const amArtist = AMUSE_ORDER[amIdx % AMUSE_ORDER.length];
      rows.push({ date: fmt(cur), artist: amArtist, who: WHO_BY_ARTIST[amArtist] ?? "Nuno", distribution: "Amuse" });
      amIdx++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return rows;
}
