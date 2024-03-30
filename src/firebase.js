import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyCHE8rasxVl-s-3NtjsfhLY2GjcLFwIGs8",
    authDomain: "inventory-system-ac80a.firebaseapp.com",
    projectId: "inventory-system-ac80a",
    storageBucket: "inventory-system-ac80a.appspot.com",
    messagingSenderId: "584892970220",
    appId: "1:584892970220:web:1192a6a237cb60acd7a1c9"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
