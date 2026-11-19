import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import EnquiryForm from '@/components/forms/EnquiryForm';

export const metadata: Metadata = {
  title: 'Project Enquiry & Consultation | HackifyPro',
  description: 'Submit your software development, web app, or mobile app project enquiry to HackifyPro. Fast response within 24 business hours.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/enquiry',
  },
};

export default function EnquiryPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24 tech-grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8] mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>START A CONVERSATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Submit a Project Enquiry
          </h1>
          <p className="text-sm sm:text-base text-[#9AA3B8] mt-3 leading-relaxed">
            Tell us about your digital goals, required features, and timeline. Our team will review your enquiry and provide actionable next steps.
          </p>
        </div>

        <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <Suspense fallback={<div className="text-xs text-[#9AA3B8]">Loading form...</div>}>
            <EnquiryForm />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
