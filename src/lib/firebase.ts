import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAU37WSKIwU71q1kVNGvzfJ-YqkNznhlPo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nilesh-barela.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nilesh-barela",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nilesh-barela.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "181013463096",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:181013463096:web:f68519ad896546d438a6cd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3EWJFLZ3QZ",
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

let analyticsInstance: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window !== 'undefined') {
    if (analyticsInstance) return analyticsInstance;
    const supported = await isSupported().catch(() => false);
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  }
  return null;
}
