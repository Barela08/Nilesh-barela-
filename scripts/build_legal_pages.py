import os

os.makedirs('src/app/privacy-policy', exist_ok=True)
os.makedirs('src/app/terms-and-conditions', exist_ok=True)
os.makedirs('src/app/refund-policy', exist_ok=True)
os.makedirs('src/app/cookie-policy', exist_ok=True)

# 1. Privacy Policy
privacy_code = """import React from 'react';
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
"""
with open('src/app/privacy-policy/page.tsx', 'w', encoding='utf-8') as f:
    f.write(privacy_code)

# 2. Terms and Conditions
terms_code = """import React from 'react';
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
"""
with open('src/app/terms-and-conditions/page.tsx', 'w', encoding='utf-8') as f:
    f.write(terms_code)

# 3. Refund Policy
refund_code = """import React from 'react';
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
"""
with open('src/app/refund-policy/page.tsx', 'w', encoding='utf-8') as f:
    f.write(refund_code)

# 4. Cookie Policy
cookie_code = """import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | HackifyPro',
  description: 'How HackifyPro uses cookies and local session storage on our website.',
  alternates: {
    canonical: 'https://nileshbarela.site/cookie-policy',
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
"""
with open('src/app/cookie-policy/page.tsx', 'w', encoding='utf-8') as f:
    f.write(cookie_code)

print("All 4 legal pages generated successfully.")
