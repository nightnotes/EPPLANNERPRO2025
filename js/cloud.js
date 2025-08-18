// js/cloud.js — Firestore helper for future inline integration
export const cfg = {"apiKey": "AIzaSyDujrir7S_vNDfnNq0ZkcTMHKYxsN5Ba54", "authDomain": "night-notes-c92e3.firebaseapp.com", "projectId": "night-notes-c92e3", "storageBucket": "night-notes-c92e3.firebasestorage.app", "messagingSenderId": "417664221420", "appId": "1:417664221420:web:bdcad8555d9fe157f225c9", "measurementId": "G-56G2YPDWNC"};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(cfg);
const db  = getFirestore(app);

export const cloud = {
  ref: (key) => doc(db, "night-notes", key),
  async get(key, fallback) {
    const snap = await getDoc(this.ref(key));
    if (snap.exists()) return snap.data().value ?? fallback;
    await setDoc(this.ref(key), { value: fallback });
    return fallback;
  },
  async set(key, value) { await setDoc(this.ref(key), { value }); },
  listen(key, cb) { return onSnapshot(this.ref(key), s => { if(s.exists()) cb(s.data().value ?? null); }); }
};
