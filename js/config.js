/** App configuration. Edit values here, not in the feature files. */
const K = "motoparts_v1"; // localStorage key for all store data

// Paste the web app config from Firebase Console > Project settings > Your apps.
// Leave apiKey empty to keep using localStorage while setting up Firebase.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC96mOUrCvqfMdz8b_uDT21qgd-0OvxtkY",
  authDomain: "motor-parts-store-640a3.firebaseapp.com",
  projectId: "motor-parts-store-640a3",
  storageBucket: "motor-parts-store-640a3.firebasestorage.app",
  messagingSenderId: "903556149635",
  appId: "1:903556149635:web:a077a159b76ac57e6286b6",
  measurementId: "G-4WSLHJ6JM6",
};
// Keep false for local testing with the demo login; set true after creating a Firebase Auth user.
const USE_FIREBASE = false;
const FIREBASE_ENABLED = USE_FIREBASE && Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId);
const FIREBASE_DATA_PATH = ["shops", "motor-shop", "data", "inventory"];

// Chart colours used by the "Profit by Category" donut
const COL = ["#1e3a8a", "#0f766e", "#b45309", "#6d28d9", "#be123c", "#64748b"];

// Local demo login hash for "motorshop|admin|adminhw2". Firebase mode uses Firebase Auth instead.
const AUTH = "a79d5a7a101f387f59c2dbde7d19dedb0cfba80dc712478539f0f23e9e607e13";
