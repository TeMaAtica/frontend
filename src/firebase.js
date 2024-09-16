// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBPFOt2Sd-NZjIhJWI0rg4bhhi6uYKNcms",
    authDomain: "temaatica.firebaseapp.com",
    projectId: "temaatica",
    storageBucket: "temaatica.appspot.com",
    messagingSenderId: "115334934168",
    appId: "1:115334934168:web:fe76ab7aa718a02ed92aed",
    measurementId: "G-SKGVFNF0S6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
