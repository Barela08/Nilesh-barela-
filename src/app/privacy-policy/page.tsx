import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, RefreshCw, Mail, Phone } from 'lucide-react';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'Privacy Policy & DPDP Act 2023 Compliance | HackifyPro',
  description: 'HackifyPro Privacy Policy, Data Protection Notice, and affirmative consent disclosures in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act, India).',
  alternates: {
    canonical: 'https://www.nileshbarela.site/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-body">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676] mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP ACT 2023 COMPLIANT PRIVACY POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight mt-1 mb-2">
            Privacy Policy &amp; Data Protection Notice
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8]">
            Effective Date: November 2026 &bull; Data Fiduciary: HackifyPro, Maharashtra, India
          </p>
        </div>

        {/* DPDP Act 2023 Key Commitment Box */}
        <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#00E676]/30 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-sm font-heading font-bold text-[#00E676]">
            <Lock className="w-4 h-4" />
            <span>Our Commitment Under the Digital Personal Data Protection Act, 2023 (DPDP Act)</span>
          </div>
          <p className="text-xs text-[#9AA3B8] leading-relaxed">
            In full compliance with India&apos;s <strong>Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)</strong>, HackifyPro acts as a responsible <strong>Data Fiduciary</strong>. We adhere strictly to the principles of lawful processing, purpose limitation, data minimization, accuracy, storage limitation, and affirmative explicit consent. We never employ pre-ticked consent checkboxes, dark patterns, or unauthorized background tracking.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
            <span className="text-[#00E676]">1.</span>
            <span>Personal Data We Collect (Section 5 Notice)</span>
          </h2>
          <p>
            HackifyPro collects only the personal data that you voluntarily and affirmatively provide when interacting with our digital touchpoints:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#E8EDF5]">
            <li>
              <strong>Identity &amp; Contact Data:</strong> Full Name, Business Email Address, Contact Telephone Number, and WhatsApp Number.
            </li>
            <li>
              <strong>Business &amp; Project Data:</strong> Organization Name, Project Scope, Feature Specifications, Desired Timelines, and Estimated Budgets submitted through our Quote, Enquiry, or Appointment forms.
            </li>
            <li>
              <strong>Technical &amp; Telemetry Data:</strong> IP Address, Browser User-Agent, and Submission Timestamps strictly for network security, rate limiting, and spam protection.
            </li>
          </ul>
        </section>

        {/* Section 2: Grounds for Processing & Affirmative Consent */}
        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
            <span className="text-[#00E676]">2.</span>
            <span>Consent &amp; Grounds for Processing (Section 6 DPDP Act)</span>
          </h2>
          <p>
            Under Section 6 of the DPDP Act 2023, consent must be <em>free, specific, informed, unconditional, and unambiguous with a clear affirmative action</em>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0F1624] border border-[#1E293B]">
              <div className="text-xs font-mono font-bold text-[#00E676] mb-1">NO PRE-TICKED BOXES</div>
              <p className="text-xs text-[#9AA3B8]">
                Every data collection form requires your conscious, active manual check. We never pre-tick or default any consent box on your behalf.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1624] border border-[#1E293B]">
              <div className="text-xs font-mono font-bold text-[#38BDF8] mb-1">PURPOSE SPECIFICITY</div>
              <p className="text-xs text-[#9AA3B8]">
                Your information is used strictly to prepare quotations, answer service inquiries, coordinate development milestones, and deliver contracts.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Principal Rights */}
        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
            <span className="text-[#00E676]">3.</span>
            <span>Your Rights as a Data Principal (Sections 11–14)</span>
          </h2>
          <p>
            As a Data Principal under the DPDP Act 2023, you have guaranteed statutory rights:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] flex items-start space-x-3">
              <UserCheck className="w-5 h-5 text-[#00E676] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">Right to Access (Section 11):</strong>
                <span className="text-xs text-[#9AA3B8]">
                  You have the right to obtain a summary of personal data being processed by HackifyPro and the identities of any processors involved.
                </span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] flex items-start space-x-3">
              <RefreshCw className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">Right to Correction &amp; Erasure (Section 12):</strong>
                <span className="text-xs text-[#9AA3B8]">
                  You can request the correction of inaccurate personal data, completion of incomplete data, or complete erasure of your data when no longer necessary.
                </span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#A78BFA] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">Right to Withdraw Consent (Section 6(4)):</strong>
                <span className="text-xs text-[#9AA3B8]">
                  You can withdraw your consent at any time as easily as giving it, simply by sending an email to our Grievance Officer.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Google User Data & Third-Party Services */}
        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
            <span className="text-[#00E676]">4.</span>
            <span>Google API Services User Data Policy &amp; Third-Party Disclosure</span>
          </h2>
          <p>
            HackifyPro (<strong className="text-white">https://www.nileshbarela.site</strong>) does not sell, rent, or trade your personal information to third parties. Where our applications or integrations connect with Google APIs or Google Sign-In, we access only the minimum data explicitly authorized by you.
          </p>
          <p>
            HackifyPro&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E676] underline hover:text-[#38BDF8]"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. We do not use Google user data for advertising, and we do not share it with third parties except as necessary to provide or improve the requested service, comply with applicable law, or protect against security threats.
          </p>
        </section>

        {/* Section 5: Data Retention & Security */}
        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
            <span className="text-[#00E676]">5.</span>
            <span>Security Safeguards &amp; Data Retention (Section 8)</span>
          </h2>
          <p>
            HackifyPro enforces technical and organizational measures to prevent personal data breaches, including HTTPS encryption in transit, strict local storage access control, parameterized queries, and immediate deletion of inquiry records upon request or project termination.
          </p>
        </section>

        {/* Section 6: Grievance Redressal Officer */}
        <section className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
          <h2 className="text-lg font-heading font-bold text-white">
            6. Grievance Redressal Officer (Section 13 DPDP Act)
          </h2>
          <p className="text-xs text-[#9AA3B8] leading-relaxed">
            In accordance with the DPDP Act 2023, if you have any questions, wish to exercise any of your statutory rights, or wish to file a grievance regarding personal data processing, you may reach out directly to our designated Grievance Officer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="p-3 bg-[#080B12] rounded-lg border border-[#1E293B]">
              <span className="text-[#64748B] block">Grievance Officer:</span>
              <span className="text-white font-bold">Nilesh Barela</span>
              <span className="text-[#9AA3B8] block text-[11px]">Founder, HackifyPro</span>
            </div>
            <div className="p-3 bg-[#080B12] rounded-lg border border-[#1E293B]">
              <span className="text-[#64748B] block">Primary Email:</span>
              <a href="mailto:hackifypro@gmail.com" className="text-[#00E676] hover:underline font-bold">
                hackifypro@gmail.com
              </a>
              <span className="text-[#9AA3B8] block text-[11px]">Response within 48-72 business hours</span>
            </div>
            <div className="p-3 bg-[#080B12] rounded-lg border border-[#1E293B]">
              <span className="text-[#64748B] block">Direct Phone / WhatsApp:</span>
              <a href="tel:+917414935405" className="text-[#38BDF8] hover:underline">
                +91 74149 35405
              </a>
            </div>
            <div className="p-3 bg-[#080B12] rounded-lg border border-[#1E293B]">
              <span className="text-[#64748B] block">Jurisdiction &amp; Location:</span>
              <span className="text-white">Maharashtra, India</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}