
/*! Releases realtime sync — standalone (no local imports needed)
   - Drop this file in your site root.
   - Include in index.html (before </body>): <script defer src="/releases-sync-standalone.js"></script>
   - Works even if your bundler paths differ.
*/
(function(){
  const firebaseAppSrc = "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  const firebaseStoreSrc = "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  const cfg = {
    apiKey: "AIzaSyDujrir7S_vNDfnNq0ZkcTMHKYxsN5Ba54",
    authDomain: "night-notes-c92e3.firebaseapp.com",
    projectId: "night-notes-c92e3",
    storageBucket: "night-notes-c92e3.firebasestorage.app",
    messagingSenderId: "417664221420",
    appId: "1:417664221420:web:bdcad8555d9fe157f225c9",
    measurementId: "G-56G2YPDWNC"
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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
    const body = table?.tBodies?.[0] || table?.querySelector("tbody") || table;
    return $$("tr", body).filter(r => $$("td", r).length >= 5);
  }

  function cellText(td) { return (td?.textContent || "").trim(); }

  function rowKey(row, idx) {
    const tds = $$("td", row);
    const dateISO = isoFromNLDate(cellText(tds[0]));
    const artist = cellText(tds[1]);
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

  let saving = false;
  let suppressUntil = 0;
  let latestStateCache = [];

  function initRealtime(db) {
    const { doc, getDoc, setDoc, onSnapshot } = window.firebaseFirestore;
    const ref = doc(db, "night-notes", "releases");

    // Listener first: flips to "verbonden" as soon as Firestore streams
    onSnapshot(ref, (snap) => {
      latestStateCache = (snap.exists() ? (snap.data().value || []) : []);
      if (!saving && Date.now() >= suppressUntil) {
        applyState(latestStateCache);
      }
      pill().textContent = "Cloud: verbonden";
    }, (err) => {
      console.warn("onSnapshot error", err);
      pill().textContent = "Cloud: offline";
    });

    // Seed if missing, then initial apply
    (async () => {
      try {
        const s = await getDoc(ref);
        if (!s.exists()) {
          const list = readDomState();
          await setDoc(ref, { value: Array.isArray(list) ? list : [] });
        }
        const now = await getDoc(ref);
        latestStateCache = (now.exists() ? (now.data().value || []) : []);
        applyState(latestStateCache);
        pill().textContent = "Cloud: verbonden";
      } catch (e) {
        console.warn("Initial load failed", e);
        pill().textContent = "Cloud: offline";
      }
    })();

    // Click handler
    document.addEventListener("click", (ev) => {
      const td = (ev.target instanceof Element) ? ev.target.closest("td") : null;
      if (!td) return;
      const table = findReleasesTable();
      if (!table) return;
      if (!table.contains(td)) return;
      const row = td.closest("tr");
      if (!row) return;
      const tds = $$("td", row);
      const isStatusCell = tds[4] === td || td.querySelector(".dot");
      if (!isStatusCell) return;

      const cur = getDotState(tds[4]);
      setDotState(tds[4], !cur);
      // Persist
      (async () => {
        try {
          saving = true;
          const list = readDomState();
          suppressUntil = Date.now() + 800;
          await setDoc(ref, { value: list });
          saving = false;
        } catch (e) {
          saving = false;
          console.warn("save failed", e);
          pill().textContent = "Cloud: offline";
        }
      })();
    });

    // Re-apply after renders
    const mo = new MutationObserver(() => {
      applyState(latestStateCache);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function loadScript(type, src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      s.onload = () => resolve(s);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Boot
  pill();
  // Load Firebase modules and start
  (async () => {
    try {
      const appMod = await import(firebaseAppSrc);
      const storeMod = await import(firebaseStoreSrc);
      window.firebaseFirestore = storeMod;

      const app = appMod.initializeApp(cfg);
      const db = storeMod.getFirestore(app);
      // Wait for the table to be present
      let tries = 0;
      while (!findReleasesTable() && tries < 40) {
        await new Promise(r => setTimeout(r, 200));
        tries++;
      }
      initRealtime(db);
    } catch (e) {
      console.warn("Firebase init failed", e);
      pill().textContent = "Cloud: offline";
    }
  })();
})();
