import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | HackifyPro',
  description: 'How HackifyPro uses cookies and local session storage on our website.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/cookie-policy',
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        
        <div>
          <span className="text-xs font-mono text-[#00E676] uppercase tracking-wider">Policy Notice</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1 mb-2">
            Cookie & Storage Policy
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8]">Effective: 2026 &bull; HackifyPro</p>
        </div>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. What are Cookies?</h2>
          <p>
            Cookies and browser storage mechanisms (such as localStorage and sessionStorage) are small files placed on your device to ensure web functionality, remember navigation states, and prevent duplicate submission loops.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. How HackifyPro Uses Cookies</h2>
          <p>
            We use strictly necessary and performance-oriented storage tokens:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#E8EDF5]">
            <li><strong>Session Authentication:</strong> Secure HTTP cookies for authorized administrative portal access.</li>
            <li><strong>Conversion De-duplication:</strong> Session keys to prevent refresh loops from artificially inflating Google Analytics conversion events.</li>
            <li><strong>Google Analytics:</strong> Standard first-party analytical cookies (_ga) to understand visitor volume and traffic channels.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
