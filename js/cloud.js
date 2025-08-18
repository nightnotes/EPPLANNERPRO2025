// js/cloud.js — Firestore helper
export const cfg = {
  apiKey: "AIzaSyDujrir7S_vNDfnNq0ZkcTMHKYxsN5Ba54",
  authDomain: "night-notes-c92e3.firebaseapp.com",
  projectId: "night-notes-c92e3",
  storageBucket: "night-notes-c92e3.firebasestorage.app",
  messagingSenderId: "417664221420",
  appId: "1:417664221420:web:bdcad8555d9fe157f225c9",
  measurementId: "G-56G2YPDWNC"
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(cfg); const db = getFirestore(app);
export const cloud = {
  ref: (k)=>doc(db,"night-notes",k),
  async get(k,f){ const s=await getDoc(this.ref(k)); if(s.exists()) return s.data().value ?? f; await setDoc(this.ref(k),{value:f}); return f; },
  async set(k,v){ await setDoc(this.ref(k),{value:v}); },
  listen(k,cb){ return onSnapshot(this.ref(k),(s)=>{ if(s.exists()) cb(s.data().value ?? null); }); }
};