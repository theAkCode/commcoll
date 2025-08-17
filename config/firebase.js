// firebase.js (Client-Side)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC_OkfQtT5kFhF1ywo5le5SgLNn-QVBTlM",
  authDomain: "commcoll1-e9a4b.firebaseapp.com",
  projectId: "commcoll1-e9a4b",
  storageBucket: "commcoll1-e9a4b.firebasestorage.app",
  messagingSenderId: "501958977070",
  appId: "1:501958977070:web:b8950ce3b78b7aa36961bf",
  measurementId: "G-55BE0CP0Q9"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
