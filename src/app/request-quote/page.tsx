import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';

export const metadata: Metadata = {
  title: 'Request a Quote & Project Proposal | HackifyPro',
  description: 'Request an itemized technical proposal and quotation for website development, Android app development, or custom enterprise software from HackifyPro.',
  alternates: {
    canonical: 'https://nileshbarela.site/request-quote',
  },
};

export default function RequestQuotePage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24 tech-grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676] mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>FORMAL PROJECT ESTIMATE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Request a Technical Quotation
          </h1>
          <p className="text-sm sm:text-base text-[#9AA3B8] mt-3 leading-relaxed">
            Provide your specifications below. We will analyze the requirements and return an itemized scope of work, architecture plan, and cost breakdown within 24 business hours.
          </p>
        </div>

        <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <Suspense fallback={<div className="text-xs text-[#9AA3B8]">Loading form...</div>}>
            <QuoteForm />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
