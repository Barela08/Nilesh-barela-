'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

/**
 * Initializes Firebase App and Firebase Analytics on the client side
 * using the provided Firebase credentials and Measurement ID G-3EWJFLZ3QZ.
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    initAnalytics()
      .then((analytics: any) => {
        if (analytics) {
          console.log('[Firebase Analytics] Initialized successfully');
        }
      })
      .catch((err: any) => {
        console.debug('[Firebase Analytics] Note:', err);
      });
  }, []);

  return null;
}
