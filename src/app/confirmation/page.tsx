import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import ConversionTracker from '@/components/shared/ConversionTracker';

export const metadata: Metadata = {
  title: 'Action Confirmed | HackifyPro',
  description: 'Your request has been successfully processed.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#080B12] tech-grid-bg text-[#E8EDF5] pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#0F1624] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="w-16 h-16 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full">
          Submission Verified
        </span>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-4 mb-3">
          Action Completed Successfully!
        </h1>

        <p className="text-sm text-[#9AA3B8] leading-relaxed mb-6">
          Your request has been confirmed. Our team will communicate with you shortly regarding the next operational steps.
        </p>

        <Suspense fallback={<div className="text-xs text-[#9AA3B8]">Loading verification...</div>}>
          <ConversionTracker type="signup" title="Sign up for a product/service" />
        </Suspense>

        <div className="mt-8 pt-6 border-t border-[#1E293B]">
          <Link
            href="/"
            className="w-full py-3 rounded-lg bg-[#00E676] text-[#080B12] text-center text-xs font-mono font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
