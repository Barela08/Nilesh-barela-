'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export default function DPDPConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hackifypro_dpdp_consent');
      if (!stored) {
        // Small delay so page renders smoothly first
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('hackifypro_dpdp_consent', 'accepted');
      localStorage.setItem('hackifypro_consent_timestamp', new Date().toISOString());
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
        });
      }
    } catch {}
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('hackifypro_dpdp_consent', 'essential_only');
      localStorage.setItem('hackifypro_consent_timestamp', new Date().toISOString());
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        });
      }
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and DPDP Act Consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1624]/95 border border-[#1E293B] shadow-2xl backdrop-blur-md text-[#E8EDF5]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00E676]">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold uppercase tracking-wider">DPDP Act 2023 &amp; Privacy Notice</span>
          </div>
          <button
            onClick={handleEssentialOnly}
            aria-label="Close and keep essential cookies only"
            className="text-[#9AA3B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#9AA3B8] leading-relaxed mb-4">
          Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, HackifyPro collects personal data only with your affirmative consent. We do not use pre-ticked consent boxes or unauthorized background trackers.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E293B]/70">
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] text-xs font-mono font-bold uppercase tracking-wide hover:opacity-95 transition-opacity"
          >
            Accept All
          </button>
          <button
            onClick={handleEssentialOnly}
            className="px-4 py-2 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#E8EDF5] text-xs font-mono hover:border-[#38BDF8] transition-colors"
          >
            Essential Only
          </button>
          <Link
            href="/privacy-policy"
            className="text-xs text-[#9AA3B8] hover:text-[#00E676] underline ml-auto transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </aside>
  );
}