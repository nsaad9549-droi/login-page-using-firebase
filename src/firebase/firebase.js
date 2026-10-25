
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB1k6QLz5DIDz-X5KbXy1XIObcurfVjpzw",
  authDomain: "fir-auth-app-9d7aa.firebaseapp.com",
  projectId: "fir-auth-app-9d7aa",
  storageBucket: "fir-auth-app-9d7aa.firebasestorage.app",
  messagingSenderId: "28528446455",
  appId: "1:28528446455:web:e74a45c716d1afe5433cf2",
  measurementId: "G-1EW1H1E2M9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

