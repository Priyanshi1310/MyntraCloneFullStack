// Importing functions from firebase/app and firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// importing getAuth
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzY2xFshgzRZRafyJee-Go6d4JttYqKWM",
  authDomain: "myntra-9963f.firebaseapp.com",
  projectId: "myntra-9963f",
  storageBucket: "myntra-9963f.firebasestorage.app",
  messagingSenderId: "119573122773",
  appId: "1:119573122773:web:709da3b7687db2caecdc5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initializing db
const db = getFirestore(app);

// initializing auth
const auth = getAuth(app);

// exporting db and auth
export { db, auth };

// exporting the app
export default app;
