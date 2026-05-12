import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU8vla8xdqyfngAyunsIPcqODCzBeSqVw",
  authDomain: "movion-acfbf.firebaseapp.com",
  projectId: "movion-acfbf",
  storageBucket: "movion-acfbf.firebasestorage.app",
  messagingSenderId: "41345430626",
  appId: "1:41345430626:web:866a5ef35a22271447cd3b",
  measurementId: "G-JBCGMQ6TLH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
