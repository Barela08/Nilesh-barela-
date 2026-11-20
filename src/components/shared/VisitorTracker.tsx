'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getOrSetStorage(storage: Storage, key: string, prefix: string): string {
  try {
    let val = storage.getItem(key);
    if (!val) {
      val = `${prefix}_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      storage.setItem(key, val);
    }
    return val;
  } catch {
    return `${prefix}_fallback_${Date.now().toString(36)}`;
  }
}

function detectDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Browser';
}

function detectOS(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  return 'OS';
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not track admin portal itself to keep visitor numbers pure
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const visitorId = getOrSetStorage(localStorage, 'hp_vid', 'vid');
    const sessionId = getOrSetStorage(sessionStorage, 'hp_sid', 'sid');

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || undefined;
    const utmMedium = urlParams.get('utm_medium') || undefined;
    const utmCampaign = urlParams.get('utm_campaign') || undefined;

    const payload = {
      visitorId,
      sessionId,
      type: 'pageview',
      path: pathname,
      title: document.title,
      referrer: document.referrer || undefined,
      device: detectDevice(),
      browser: detectBrowser(),
      os: detectOS(),
      utmSource,
      utmMedium,
      utmCampaign,
    };

    // Send pageview
    fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});

    lastPathRef.current = pathname;

    // Heartbeat every 45s for accurate live visitor tracking
    const heartbeatInterval = setInterval(() => {
      fetch('/api/analytics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          type: 'heartbeat',
        }),
        keepalive: true,
      }).catch(() => {});
    }, 45000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [pathname]);

  return null;
}
