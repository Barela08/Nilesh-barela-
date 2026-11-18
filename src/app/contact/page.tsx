import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { company } from '@/data/company';
import ContactForm from '@/components/forms/EnquiryForm';

export const metadata: Metadata = {
  title: 'Contact HackifyPro | Software Development in Nashik & Maharashtra',
  description: 'Get in touch with HackifyPro for website development, Android applications, and custom software. Reach out via email, phone, WhatsApp or visit our Nashik hub.',
  alternates: {
    canonical: 'https://nileshbarela.site/contact',
  },
};

export default function ContactPage() {
  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact HackifyPro',
    description: 'Contact HackifyPro for software development inquiries.',
    url: `${company.websiteUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: company.name,
      telephone: company.contact.phone,
      email: company.contact.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: company.localSeo.city,
        addressRegion: company.localSeo.state,
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Contact HackifyPro
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Have a project in mind or need technical guidance? Reach out directly via phone, WhatsApp, or submit your project details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">Email Addresses</h3>
              <p className="text-xs text-[#9AA3B8] mt-1 mb-3">Reach out for business proposals and collaborations.</p>
              <div className="space-y-1.5 font-mono text-xs">
                <div>
                  <a href={`mailto:${company.contact.email}`} className="text-[#00E676] hover:underline">
                    {company.contact.email}
                  </a>
                  <span className="text-[#64748B] ml-2">(Official Business)</span>
                </div>
                <div>
                  <a href={`mailto:${company.founder.emails[1]}`} className="text-[#38BDF8] hover:underline">
                    {company.founder.emails[1]}
                  </a>
                  <span className="text-[#64748B] ml-2">(Founder Direct)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">Phone & WhatsApp</h3>
              <p className="text-xs text-[#9AA3B8] mt-1 mb-3">Direct call or quick WhatsApp chat for urgent discussions.</p>
              <div className="space-y-2">
                <div className="font-mono text-sm text-white">
                  <a href={`tel:${company.contact.phoneRaw}`} className="hover:text-[#38BDF8]">
                    {company.contact.phone}
                  </a>
                </div>
                <div>
                  <a
                    href={company.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#00E676]/15 border border-[#00E676]/30 text-xs font-mono font-bold text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12] transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
              <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">Service Area & Hub</h3>
              <p className="text-xs text-[#9AA3B8] mt-1 mb-2">Primary Market: {company.contact.primaryMarket}</p>
              <p className="text-xs text-[#9AA3B8] leading-relaxed">
                Serving Nashik, Pune, Mumbai, Maharashtra, and clients across India and internationally.
              </p>
            </div>

          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Send a Project Message
            </h2>
            <p className="text-xs text-[#9AA3B8] mb-6">
              Fill in your details below and our team will get back to you within 24 business hours.
            </p>
            <ContactForm defaultService="website-development" />
          </div>

        </div>

      </div>
    </div>
  );
}
