import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Calendar, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'Book a Consultation & Project Discovery | HackifyPro',
  description: 'Schedule a free 30-minute discovery consultation with Nilesh Barela and the HackifyPro engineering team to discuss your software, web, or mobile app project.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/appointment',
  },
};

export default function AppointmentPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24 tech-grid-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676] mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>DIRECT TECHNICAL CONSULTATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Schedule a Discovery Session
          </h1>
          <p className="text-sm sm:text-base text-[#9AA3B8] mt-3 leading-relaxed">
            Discuss your software architecture, feature priorities, and budget directly with founder Nilesh Barela and our core development team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Summary Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
              <h2 className="text-base font-heading font-bold text-white mb-4">What to Expect:</h2>
              <div className="space-y-3.5 text-xs text-[#9AA3B8]">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
                  <span>Objective evaluation of your technical roadmap and feasibility.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
                  <span>Honest comparison between custom code vs existing tools.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
                  <span>Preliminary architecture diagram and milestone budget estimate.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
                  <span>Live demonstration of our Hospital or Car Rental software if requested.</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#1E293B] font-mono text-xs text-[#64748B]">
                Duration: 30 - 45 Minutes <br />
                Mode: Google Meet / Phone / WhatsApp Call
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080B12] border border-[#1E293B] text-xs font-mono text-[#9AA3B8] space-y-2">
              <div className="text-white font-bold">Confidentiality Assured:</div>
              <p>We respect client non-disclosure and intellectual property. Your concept is safe with our team.</p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-8 bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-2xl">
            <Suspense fallback={<div className="text-xs text-[#9AA3B8]">Loading form...</div>}>
              <AppointmentForm />
            </Suspense>
          </div>

        </div>

      </div>
    </div>
  );
}
