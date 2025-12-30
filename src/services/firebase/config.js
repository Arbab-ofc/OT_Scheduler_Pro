import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB7z2ltvIR8VXAdRFiJ979eGLaeha5DZyU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hospital-755ae.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hospital-755ae",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hospital-755ae.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "412348560010",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:412348560010:web:b4b71d9be42d5771373373"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
