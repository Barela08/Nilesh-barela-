import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | HackifyPro',
  description: 'HackifyPro privacy policy and data collection disclosures.',
  alternates: {
    canonical: 'https://nileshbarela.site/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body">
        
        <div>
          <span className="text-xs font-mono text-[#00E676] uppercase tracking-wider">Legal Document</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1 mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8]">Last Updated: February 2026 &bull; HackifyPro, Maharashtra, India</p>
        </div>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">1. Information We Collect</h2>
          <p>
            HackifyPro (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects information that you voluntarily provide when using our website (https://nileshbarela.site), booking an appointment, submitting a project enquiry, or requesting a software quotation. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#E8EDF5]">
            <li>Full Name and contact details (email address, telephone number, WhatsApp number).</li>
            <li>Company or organization name and service area.</li>
            <li>Project specifications, feature requirements, preferred dates, and budget estimates.</li>
            <li>Technical telemetry such as IP address and browser type for rate-limiting and security fraud prevention.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">2. How We Use Your Information</h2>
          <p>
            Your information is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#E8EDF5]">
            <li>Respond to your technical enquiries and schedule requested discovery sessions.</li>
            <li>Prepare and transmit detailed project proposals, quotations, and contracts.</li>
            <li>Coordinate development milestones and provide continuous customer support.</li>
            <li>Protect our systems against spam, automated abuse, and denial-of-service attempts.</li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal or business data to external marketers or data brokers.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">3. Analytics & Conversion Tracking</h2>
          <p>
            We utilize Google Analytics 4 (Measurement ID: G-EG5RTC5GEV) to assess website performance, traffic sources, and user journeys. Conversion actions are tracked anonymously using transaction IDs without sending personally identifiable information (PII) to analytics providers.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">4. Data Retention & Security</h2>
          <p>
            We enforce industry-standard security safeguards including HTTPS encryption, parameterized database queries, and restricted access controls. Inquiries and appointment submissions are retained only as long as necessary for business communication and legal compliance.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[#9AA3B8] leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-white">5. Contact Information</h2>
          <p>
            For privacy inquiries or to request data modification or deletion, please email us directly at <a href="mailto:hackifypro@gmail.com" className="text-[#00E676] underline">hackifypro@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
