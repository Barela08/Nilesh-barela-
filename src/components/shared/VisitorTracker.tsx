'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function getAnonymousVisitorId(): string {
  if (typeof window === 'undefined') return 'anon_server';
  try {
    let vid = localStorage.getItem('hp_vid');
    if (!vid) {
      // Check cookie
      const match = document.cookie.match(/(?:^|; )hp_vid=([^;]*)/);
      if (match && match[1]) {
        vid = decodeURIComponent(match[1]);
      } else {
        vid = `hp_v_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      }
      localStorage.setItem('hp_vid', vid);
    }
    // Ensure cookie is set for 1 year
    document.cookie = `hp_vid=${encodeURIComponent(vid)}; path=/; max-age=31536000; SameSite=Lax`;
    return vid;
  } catch {
    return `hp_v_fallback_${Date.now().toString(36)}`;
  }
}

export function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') return 'anon_session';
  try {
    const now = Date.now();
    const lastActiveStr = sessionStorage.getItem('hp_last_active');
    const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;
    let sid = sessionStorage.getItem('hp_sid');

    // 30 minutes session inactivity expiration
    if (!sid || (lastActive > 0 && now - lastActive > 30 * 60 * 1000)) {
      sid = `hp_s_${Math.random().toString(36).substring(2, 10)}_${now.toString(36)}`;
      sessionStorage.setItem('hp_sid', sid);
    }

    sessionStorage.setItem('hp_last_active', now.toString());
    return sid;
  } catch {
    return `hp_s_fallback_${Date.now().toString(36)}`;
  }
}

export function trackFormStage(
  formType: 'appointment' | 'enquiry' | 'quote',
  stage: 'viewed' | 'started' | 'abandoned' | 'submitted' | 'failed',
  leadId?: string
) {
  if (typeof window === 'undefined') return;
  const visitorId = getAnonymousVisitorId();
  const sessionId = getAnonymousSessionId();
  const path = window.location.pathname;

  fetch('/api/analytics/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      sessionId,
      type: 'form_stage',
      formType,
      stage,
      path,
      leadId,
    }),
    keepalive: true,
  }).catch(() => {});
}

export function trackInteraction(
  type: 'whatsapp_click' | 'phone_click' | 'email_click' | 'demo_click' | 'appointment_cta' | 'quote_cta',
  targetUrl: string
) {
  if (typeof window === 'undefined') return;
  const visitorId = getAnonymousVisitorId();
  const path = window.location.pathname;

  fetch('/api/analytics/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      type: 'interaction',
      interactionType: type,
      targetUrl,
      path,
    }),
    keepalive: true,
  }).catch(() => {});
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
    if (pathname.startsWith('/admin') || pathname.startsWith('/5659') || pathname.startsWith('/api')) {
      return;
    }

    const visitorId = getAnonymousVisitorId();
    const sessionId = getAnonymousSessionId();

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

    // Global click listener for interaction tracking (WhatsApp, Calls, Demos)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target || !target.href) return;
      const href = target.href;

      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        trackInteraction('whatsapp_click', href);
      } else if (href.startsWith('tel:')) {
        trackInteraction('phone_click', href);
      } else if (href.startsWith('mailto:')) {
        trackInteraction('email_click', href);
      } else if (href.includes('/appointment')) {
        trackInteraction('appointment_cta', href);
      } else if (href.includes('/request-quote')) {
        trackInteraction('quote_cta', href);
      } else if (href.includes('demo') || target.innerText?.toLowerCase().includes('demo')) {
        trackInteraction('demo_click', href);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [pathname]);

  return null;
}
