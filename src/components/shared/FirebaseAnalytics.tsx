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
      .then((analytics) => {
        if (analytics) {
          console.log('[Firebase Analytics] Initialized successfully with measurementId G-3EWJFLZ3QZ');
        }
      })
      .catch((err) => {
        console.debug('[Firebase Analytics] Note:', err);
      });
  }, []);

  return null;
}
