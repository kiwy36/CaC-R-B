// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzPh9lwUxjVL4VQKaPCK8MYfRDyxkDjlE",
    authDomain: "cac-proyect-6121b.firebaseapp.com",
    projectId: "cac-proyect-6121b",
    storageBucket: "cac-proyect-6121b.appspot.com",
    messagingSenderId: "803579575238",
    appId: "1:803579575238:web:61464bdc007151aad0d0c7",
    measurementId: "G-0CHVBV0FC8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
