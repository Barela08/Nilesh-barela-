import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDgGzbnzU_sMrZS9tF774ZD0_6jDvBKsEM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "self-driving-car-rental-9f35f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "self-driving-car-rental-9f35f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "self-driving-car-rental-9f35f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "611647646497",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:611647646497:web:857638b3e91219df7b2c60",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3JEWNBVFHR",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);

export function getDb(): Firestore | null {
  try {
    return firestoreDb;
  } catch (err) {
    console.warn('[Firebase] Firestore init failed:', err);
    return null;
  }
}

export async function initAnalytics(): Promise<any | null> {
  if (typeof window !== 'undefined') {
    try {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const supported = await isSupported().catch(() => false);
      if (supported) {
        return getAnalytics(app);
      }
    } catch (err) {
      console.debug('[Firebase Analytics] Not supported or blocked in this environment:', err);
    }
  }
  return null;
}
