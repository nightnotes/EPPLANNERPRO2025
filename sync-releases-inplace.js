
// Realtime sync for Releases (v2): instant connect + stable keys
import { cloud } from "./js/cloud.js";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

function isoFromNLDate(s) {
  const m = /(\d{2})-(\d{2})-(\d{4})/.exec(String(s || "").trim());
  if (!m) return String(s || "").trim();
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function findReleasesTable() {
  const tables = $$("table");
  for (const t of tables) {
    const head = t.tHead || t.querySelector("thead");
    if (!head) continue;
    const labels = $$("th, td", head).map(el => (el.textContent || "").toLowerCase().trim());
    const ok = labels.some(x => x.includes("datum")) && labels.some(x => x.includes("artiest")) && labels.some(x => x.includes("status"));
    if (ok) return t;
  }
  return null;
}

function getRows(table) {
  const body = table.tBodies?.[0] || table.querySelector("tbody") || table;
  return $$("tr", body).filter(r => $$("td", r).length >= 5);
}

function cellText(td) {
  return (td?.textContent || "").trim();
}

function rowKey(row, idx) {
  const tds = $$("td", row);
  const dateISO = isoFromNLDate(cellText(tds[0]));
  const artist = cellText(tds[1]);
  // Primary key on date+artist; fallback to row index for stability
  const base = `${dateISO}|${artist}`;
  return base.length > 1 ? base : `row#${idx}`;
}

function ensureDot(td) {
  let dot = td.querySelector(".dot");
  if (!dot) {
    dot = document.createElement("span");
    dot.className = "dot";
    dot.style.display = "inline-block";
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "999px";
    dot.style.marginInline = "6px";
    dot.style.verticalAlign = "middle";
    td.prepend(dot);
  }
  return dot;
}

function setDotState(td, done) {
  const dot = ensureDot(td);
  dot.style.background = done ? "rgb(34, 197, 94)" : "transparent";
  dot.style.outline = done ? "1px solid rgba(34, 197, 94, .55)" : "1px solid rgba(255,255,255,.2)";
  dot.title = done ? "Af • gesynchroniseerd" : "Nog niet af";
}

function getDotState(td) {
  const dot = ensureDot(td);
  const bg = getComputedStyle(dot).backgroundColor || "";
  return bg.includes("34, 197, 94");
}

function readDomState() {
  const table = findReleasesTable();
  if (!table) return [];
  const rows = getRows(table);
  return rows.map((r, i) => {
    const tds = $$("td", r);
    return { key: rowKey(r, i), done: getDotState(tds[4]) };
  });
}

function applyState(list) {
  const table = findReleasesTable();
  if (!table) return;
  const rows = getRows(table);
  const byKey = new Map((list || []).map(x => [x.key, !!x.done]));
  rows.forEach((r, i) => {
    const key = rowKey(r, i);
    const tds = $$("td", r);
    const desired = byKey.has(key) ? byKey.get(key) : getDotState(tds[4]);
    setDotState(tds[4], !!desired);
  });
}

function pill() {
  let el = $(".cloud-status-pill");
  if (!el) {
    el = document.createElement("div");
    el.className = "cloud-status-pill";
    Object.assign(el.style, {
      position: "fixed", right: "12px", bottom: "12px", zIndex: 9999,
      background: "rgba(15,22,48,.9)", border: "1px solid #27365e",
      borderRadius: "999px", padding: "6px 10px", fontSize: "12px",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
      color: "#a7b1d8"
    });
    el.textContent = "Cloud: verbinden…";
    document.body.appendChild(el);
  }
  return el;
}

let saving = false;
let suppressUntil = 0;

async function seedIfMissing() {
  // Ensure the document exists so initial read doesn't fail
  try {
    // Try a read; if it errors or returns null, write empty array
    let seeded = false;
    await cloud.get("releases", []);
    // cloud.get should have created doc with default if missing (implementation-dependent)
    // For extra safety, immediately write current DOM state if empty:
    const current = readDomState();
    await cloud.set("releases", Array.isArray(current) ? current : []);
    seeded = true;
    return seeded;
  } catch (e) {
    try {
      await cloud.set("releases", []);
      return true;
    } catch (_e) {
      return false;
    }
  }
}

async function loadFromCloud() {
  try {
    const v = await cloud.get("releases", []);
    applyState(Array.isArray(v) ? v : []);
    pill().textContent = "Cloud: verbonden";
  } catch (e) {
    pill().textContent = "Cloud: offline";
  }
}

async function saveToCloud() {
  try {
    saving = true;
    const list = readDomState();
    suppressUntil = Date.now() + 800;
    await cloud.set("releases", list);
    saving = false;
  } catch (e) {
    saving = false;
    pill().textContent = "Cloud: offline";
    console.warn("cloud set failed", e);
  }
}

function attachHandlers() {
  const table = findReleasesTable();
  if (!table) return;
  table.addEventListener("click", (ev) => {
    const td = (ev.target instanceof Element) ? ev.target.closest("td") : null;
    if (!td) return;
    const row = td.closest("tr");
    if (!row) return;
    const tds = $$("td", row);
    const isStatusCell = tds[4] === td || td.querySelector(".dot");
    if (!isStatusCell) return;
    const cur = getDotState(tds[4]);
    setDotState(tds[4], !cur);
    saveToCloud();
  });

  // Re-apply cloud state after renders
  const mo = new MutationObserver(() => {
    applyState(latestStateCache);
  });
  mo.observe(table, { childList: true, subtree: true });
}

// Keep last snapshot to apply after UI rerenders
let latestStateCache = [];

(async function init() {
  pill(); // show immediately
  // Attach listener BEFORE initial load so it flips to "verbonden" on first snapshot
  cloud.listen("releases", (v) => {
    latestStateCache = Array.isArray(v) ? v : [];
    if (saving || Date.now() < suppressUntil) return;
    applyState(latestStateCache);
    pill().textContent = "Cloud: verbonden";
  });
  // Ensure document exists to prevent "offline" feeling
  await seedIfMissing();
  // Retry loop to wait for table render then apply
  let tries = 0;
  while (!findReleasesTable() && tries < 30) {
    await new Promise(r => setTimeout(r, 200));
    tries++;
  }
  await loadFromCloud();
  attachHandlers();
})();
