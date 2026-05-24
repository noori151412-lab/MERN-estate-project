// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vantura-estates.firebaseapp.com",
  projectId: "vantura-estates",
  storageBucket: "vantura-estates.firebasestorage.app",
  messagingSenderId: "651990729585",
  appId: "1:651990729585:web:c8bec866b16a261b3d6cd0",
  measurementId: "G-23JJWQRDT4"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);