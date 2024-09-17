// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCM3w15Ny9Qy4u--uxvIh0rWxx6q8JFf78",
    authDomain: "tematica-dev.firebaseapp.com",
    projectId: "tematica-dev",
    storageBucket: "tematica-dev.appspot.com",
    messagingSenderId: "186900186549",
    appId: "1:186900186549:web:bb95154bbe40a5442085fc",
    measurementId: "G-LQCHJP18PN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
