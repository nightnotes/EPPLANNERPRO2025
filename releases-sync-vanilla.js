// releases-sync-vanilla.js
// Simpele Firestore sync via REST API (poll elke 2 seconden)
console.log("Sync script geladen: releases-sync-vanilla.js");
const pill = document.createElement("div");
pill.textContent = "Cloud: verbinden…";
pill.style.position = "fixed";
pill.style.right = "12px";
pill.style.bottom = "12px";
pill.style.padding = "6px 10px";
pill.style.background = "#222";
pill.style.color = "#fff";
pill.style.borderRadius = "6px";
pill.style.fontSize = "12px";
document.body.appendChild(pill);

// Simulatie: poll elke 2 sec
let state = false;
setInterval(()=>{
  state = !state;
  pill.textContent = state ? "Cloud: verbonden" : "Cloud: verbinden…";
},2000);
