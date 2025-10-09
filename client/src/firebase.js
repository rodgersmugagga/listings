// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "listingsapplication.firebaseapp.com",
  projectId: "listingsapplication",
  storageBucket: "listingsapplication.firebasestorage.app",
  messagingSenderId: "526186826755",
  appId: "1:526186826755:web:6f8d00fffd8b680ea1d236"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
