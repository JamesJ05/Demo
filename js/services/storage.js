/** Firestore-backed store data with localStorage fallback for local setup. */
let db = null;
const storeRef = () => db.doc(FIREBASE_DATA_PATH.join("/"));

function initFirebase() {
  if (!FIREBASE_ENABLED) return;
  if (!window.firebase) throw new Error("Firebase SDK did not load. Check your internet connection.");
  const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
  db = app.firestore();
}

async function load() {
  try {
    view = localStorage.getItem("mp_view") || "t";
  } catch (e) {}

  if (db) {
    const snap = await storeRef().get();
    if (snap.exists) D = snap.data();
    else {
      // Migrate an existing browser's data once when this Firestore document is first created.
      try { D = JSON.parse(localStorage.getItem(K)); } catch (e) { D = null; }
      if (!D || !D.parts) seed();
      await storeRef().set(D);
    }
  } else {
    try { D = JSON.parse(localStorage.getItem(K)); } catch (e) { D = null; }
    if (!D || !D.parts) seed();
  }
  D.ins = D.ins || [];
  D.pre = D.pre || [];
  D.vch = D.vch || [];
  D.sales = D.sales || [];
}

function persist() {
  if (db) {
    // Serialize writes so rapid consecutive actions cannot overwrite newer state.
    writeQueue = writeQueue.then(() => storeRef().set(D)).catch((e) => {
      console.error("Firestore save failed", e);
      showStorageError("Could not save to Firebase. Check your connection and Firestore rules.");
    });
    return;
  }
  try { localStorage.setItem(K, JSON.stringify(D)); }
  catch (e) { alert("Storage full — use smaller photos or remove unused parts."); }
}

let writeQueue = Promise.resolve();
function showStorageError(message) {
  const target = document.getElementById("lg_m");
  if (target) target.textContent = message;
}
