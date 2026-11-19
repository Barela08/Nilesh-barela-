import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAU37WSKIwU71q1kVNGvzfJ-YqkNznhlPo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nilesh-barela.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nilesh-barela",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nilesh-barela.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "181013463096",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:181013463096:web:f68519ad896546d438a6cd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3EWJFLZ3QZ"
};

// Singleton initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const getDb = (): Firestore => {
  return getFirestore(app);
};

let analyticsInstance: Analytics | null = null;

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window !== "undefined") {
    if (analyticsInstance) return analyticsInstance;
    const supported = await isSupported().catch(() => false);
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  }
  return null;
};
