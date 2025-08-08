
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

const WHO_BY_ARTIST: Record<string, "Nuno"|"Martijn"> = {
  "Dreamflow":"Nuno","Poluz":"Martijn","Doris Lost":"Nuno","Eternal":"Martijn","Slaapmutsje":"Nuno","ZizZa":"Martijn","Sleepy Taes":"Nuno",
  "Muted Mind":"Nuno","Swooshy":"Nuno","Evelyn Winter":"Martijn","Krople":"Martijn","Katty":"Martijn","Sophia Vale":"Martijn","Domindo Nuni":"Martijn",
  "Motionless":"Martijn","Loomy":"Nuno","Eleanor Moon":"Nuno","Luna Nights":"Martijn","Ava Willow":"Martijn","Sleepy Delrow":"Nuno","Lila Serene":"Nuno",
  "Soft Dawn":"Nuno","Nunery Dream":"Nuno","Celestine Viora":"Nuno","Ludo Legato":"Martijn"
};

function fmt(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
function getISOWeek(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // @ts-ignore
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
  return Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}

export function generateSchedule(start: Date, end: Date, options?: { startDoubleWeek?: boolean }): ReleaseRow[] {
  let double = options?.startDoubleWeek ?? true;
  let prevWeek = getISOWeek(start);
  let dkIdx = 0;
  let amIdx = 0;
  const rows: ReleaseRow[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const w = getISOWeek(d);
    if (w !== prevWeek) { double = !double; prevWeek = w; }
    const dkArtist = DISTROKID_ORDER[dkIdx % DISTROKID_ORDER.length];
    rows.push({ date: fmt(d), artist: dkArtist, who: WHO_BY_ARTIST[dkArtist] ?? "Martijn", distribution: "Distrokid" });
    dkIdx++;
    if (double) {
      const amArtist = AMUSE_ORDER[amIdx % AMUSE_ORDER.length];
      rows.push({ date: fmt(d), artist: amArtist, who: WHO_BY_ARTIST[amArtist] ?? "Nuno", distribution: "Amuse" });
      amIdx++;
    }
  }
  return rows;
}
