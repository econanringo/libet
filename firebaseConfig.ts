import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyClOtsPxl87kzGzb84UxHmulk31V97fRgc",
    authDomain: "sozanliberalarts-libet-23th.firebaseapp.com",
    projectId: "sozanliberalarts-libet-23th",
    storageBucket: "sozanliberalarts-libet-23th.firebasestorage.app",
    messagingSenderId: "440811761954",
    appId: "1:440811761954:web:e0b690bd7267384efa357b",
    measurementId: "G-6VVCLJR67K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
