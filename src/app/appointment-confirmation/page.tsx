import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Calendar, ArrowRight, Phone } from 'lucide-react';
import ConversionTracker from '@/components/shared/ConversionTracker';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'Appointment Scheduled | HackifyPro',
  description: 'Your discovery session has been scheduled with the HackifyPro technical team.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AppointmentConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#080B12] tech-grid-bg text-[#E8EDF5] pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#0F1624] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E676]/10 rounded-full blur-3xl -z-10"></div>

        <div className="w-16 h-16 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full">
          Confirmed Discovery Session
        </span>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-4 mb-3">
          Your Appointment is Confirmed!
        </h1>

        <p className="text-sm text-[#9AA3B8] leading-relaxed mb-6">
          Thank you for scheduling a session with HackifyPro. Nilesh Barela and our engineering team have received your request. We will review your project scope and connect with you at the selected time.
        </p>

        <Suspense fallback={<div className="text-xs text-[#9AA3B8]">Loading verification...</div>}>
          <ConversionTracker type="appointment" title="Schedule an appointment" />
        </Suspense>

        <div className="mt-8 pt-6 border-t border-[#1E293B] space-y-4">
          <div className="text-xs text-[#9AA3B8] flex items-center justify-between">
            <span>Direct Founder Assistance:</span>
            <a href={`tel:${company.contact.phoneRaw}`} className="text-[#00E676] hover:underline flex items-center font-mono">
              <Phone className="w-3.5 h-3.5 mr-1" />
              {company.contact.phone}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/"
              className="w-full py-3 rounded-lg border border-[#1E293B] text-center text-xs font-mono text-white hover:bg-[#141D30] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/portfolio"
              className="w-full py-3 rounded-lg bg-[#00E676] text-[#080B12] text-center text-xs font-mono font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
