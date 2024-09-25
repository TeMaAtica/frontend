// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { setLogLevel } from "firebase/firestore";

setLogLevel("debug");
const firebaseConfig = {
    apiKey: "AIzaSyAx3jZwSQSabwtnjxzSMnL6B9A_6ZlxGJQ",
    authDomain: "tematica-dev-second.firebaseapp.com",
    projectId: "tematica-dev-second",
    storageBucket: "tematica-dev-second",
    messagingSenderId: "358283871823",
    appId: "1:358283871823:web:eb66edcb90615f557b8c3a",
    measurementId: "G-EQ4WQCCLQX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

// async function getDataFromCollection(collectionName) {
//     try {
//         const querySnapshot = await getDocs(collection(db, collectionName));
//         querySnapshot.forEach((doc) => {
//             console.info(`${doc.id} => `, doc.data());
//         });
//     } catch (error) {
//         console.error("Error fetching data: ", error);
//     }
// }
// getDataFromCollection("oil");

export { db };
