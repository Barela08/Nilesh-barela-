import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | HackifyPro',
  description: 'Terms and conditions governing the use of HackifyPro software development services and website.',
  alternates: {
    canonical: 'https://nileshbarela.site/terms-and-conditions',
  },
};

export default function TermsPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        
        <div>
          <span className="text-xs font-mono text-[#00E676] uppercase tracking-wider">Legal Document</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8]">Last Updated: February 2026 &bull; Jurisdiction: Maharashtra, India</p>
        </div>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing https://nileshbarela.site or engaging HackifyPro for website development, mobile application engineering, or custom software solutions, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. Scope of Services & Development Contracts</h2>
          <p>
            All custom software development projects are executed under formal, written Statements of Work (SOW) specifying milestone deliverables, payment schedules, and acceptance testing criteria. Verbal estimates provided during preliminary discovery calls are non-binding until documented in a formal proposal.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Intellectual Property Ownership</h2>
          <p>
            Upon settlement of final milestone payments, the client receives full intellectual property ownership and source code rights for bespoke software specifically developed for them, excluding third-party open-source libraries or proprietary pre-built modules licensed to the client.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">4. Governing Law</h2>
          <p>
            These terms shall be governed by and interpreted under the laws of the State of Maharashtra, India. Any disputes arising in connection with services shall be subject to the exclusive jurisdiction of the competent courts in Nashik / Maharashtra.
          </p>
        </section>

      </div>
    </div>
  );
}
