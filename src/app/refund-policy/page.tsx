import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | HackifyPro',
  description: 'HackifyPro policy regarding software development deposits, milestone payments, and cancellations.',
  alternates: {
    canonical: 'https://nileshbarela.site/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        
        <div>
          <span className="text-xs font-mono text-[#00E676] uppercase tracking-wider">Policy Notice</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1 mb-2">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8]">Effective: 2026 &bull; HackifyPro</p>
        </div>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Custom Software & Engineering Services</h2>
          <p>
            Because software development involves dedicated engineering labor, architectural planning, and custom coding, payments made for completed milestones are non-refundable once approved and delivered according to agreed specifications.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. Advance Deposits & Project Cancellation</h2>
          <p>
            If a client requests project cancellation before engineering work commences, the initial advance deposit may be refunded minus any incurred third-party costs (such as domain registrations, third-party API fees, or server provisioning). Once engineering sprints have commenced, advance payments are credited toward the labor performed up to the cancellation notice date.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Defect Remediation Warranty</h2>
          <p>
            All custom software delivered by HackifyPro comes with a 30-day post-launch warranty period during which any defects or bugs not conforming to the original project specifications are remediated at zero additional cost.
          </p>
        </section>

      </div>
    </div>
  );
}
