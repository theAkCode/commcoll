// firebase.js (Client-Side)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD0iXRAs4ZBdmGsxQKOnLK5M3CbgHA_Byc",
    authDomain: "commcoll-69e2f.firebaseapp.com",
    projectId: "commcoll-69e2f",
    storageBucket: "commcoll-69e2f.firebasestorage.app",
    messagingSenderId: "685425666027",
    appId: "1:685425666027:web:42cd138fc1175d5e125bae",
    measurementId: "G-51XZKEK1D5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
