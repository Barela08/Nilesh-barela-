'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ServiceItem } from '@/data/services';
import { company } from '@/data/company';

interface Props {
  service: ServiceItem;
}

export default function ServicePageTemplate({ service }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDesc,
    provider: {
      '@type': 'Organization',
      name: company.name,
      url: company.websiteUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: company.localSeo.city,
    },
    serviceType: service.title,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: company.websiteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${company.websiteUrl}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `${company.websiteUrl}${service.path}`,
      },
    ],
  };

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-4 pb-16 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Visual Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-[#9AA3B8]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#00E676]">{service.title}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
              <span className="w-2 h-2 rounded-full bg-[#00E676]"></span>
              <span>SPECIALIZED ENGINEERING SERVICE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              {service.h1}
            </h1>

            <p className="text-base sm:text-lg text-[#9AA3B8] leading-relaxed">
              {service.shortDesc}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/request-quote?service=${service.slug}`}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all"
              >
                Request a Quote
              </Link>
              <Link
                href={`/appointment?service=${service.slug}`}
                className="px-6 py-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8] text-white font-mono text-xs font-semibold tracking-wide transition-colors"
              >
                Book Discovery Session
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Problems & Solution */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Problems Solved */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  Common Obstacles
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
                  Problems We Eliminate
                </h2>
              </div>

              <div className="space-y-3">
                {service.problemsSolved.map((prob, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0F1624] border border-[#1E293B] flex items-start space-x-3">
                    <span className="text-red-400 font-mono text-xs font-bold mt-0.5">✕</span>
                    <p className="text-sm text-[#9AA3B8] leading-relaxed">{prob}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Overview */}
            <div className="p-8 rounded-3xl bg-[#0F1624] border border-[#1E293B] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E676]/10 rounded-full blur-3xl -z-10"></div>
              
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
                Our Technical Approach
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-white mt-1 mb-4">
                Engineered for Results
              </h2>

              <p className="text-sm text-[#E8EDF5] leading-relaxed mb-6">
                {service.solutionOverview}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8] uppercase tracking-wider mb-2">Technologies Used</div>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-md bg-[#141D30] border border-[#1E293B] text-xs font-mono text-[#38BDF8]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Key Capabilities
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Features & Technical Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feat) => (
              <div key={feat.title} className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
              Workflow Execution
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Step-by-Step Delivery Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {service.process.map((p) => (
              <div key={p.step} className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono font-bold text-[#38BDF8]">{p.step}</div>
                <h4 className="text-sm font-heading font-bold text-white mt-2 mb-1.5">{p.title}</h4>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Real-World Impact
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Industry Use Cases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {service.useCases.map((uc) => (
              <div key={uc.title} className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <h3 className="text-base font-heading font-bold text-white mb-2">{uc.title}</h3>
                <div className="text-xs font-mono text-[#38BDF8] mb-2">Target: {uc.target}</div>
                <div className="text-xs text-[#9AA3B8] leading-relaxed">
                  <strong className="text-white">Outcome: </strong> {uc.outcome}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Clear Answers
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#1E293B] rounded-xl bg-[#0F1624] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#00E676] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#9AA3B8] leading-relaxed border-t border-[#1E293B]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Final Service CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-heading font-extrabold text-white">
            Ready to Build Your {service.title}?
          </h2>
          <p className="text-sm text-[#9AA3B8] leading-relaxed">
            Connect with Nilesh Barela and the HackifyPro team to discuss your project specifications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/request-quote?service=${service.slug}`}
              className="px-6 py-3.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Get a Detailed Quote
            </Link>
            <Link
              href={`/appointment?service=${service.slug}`}
              className="px-6 py-3.5 rounded-xl border border-[#1E293B] text-white font-mono text-xs hover:border-[#38BDF8] transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
