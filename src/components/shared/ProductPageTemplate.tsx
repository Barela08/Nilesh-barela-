'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Monitor, 
  PhoneCall,
  Activity,
  Car,
  Utensils,
  Dumbbell,
  Shield
} from 'lucide-react';
import { ProductItem } from '@/data/products';
import { company } from '@/data/company';

interface Props {
  product: ProductItem;
}

export default function ProductPageTemplate({ product }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.overview,
    brand: {
      '@type': 'Brand',
      name: company.name,
    },
    category: 'Business Application Software',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${company.websiteUrl}${product.path}`,
    },
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
        name: 'Products & Solutions',
        item: `${company.websiteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${company.websiteUrl}${product.path}`,
      },
    ],
  };

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-4 pb-16 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Visual Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-[#9AA3B8]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#38BDF8]">{product.title}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8] font-bold">
                {product.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676] flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#00E676] mr-1.5 animate-pulse"></span>
                {product.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            <p className="text-base sm:text-xl font-mono text-[#38BDF8]">
              {product.tagline}
            </p>

            <p className="text-sm sm:text-base text-[#9AA3B8] leading-relaxed">
              {product.overview}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/appointment?service=${product.slug}`}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Live Demonstration</span>
              </Link>
              <Link
                href={`/request-quote?service=${product.slug}`}
                className="px-6 py-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8] text-white font-mono text-xs font-semibold tracking-wide transition-colors"
              >
                Request Deployment Quote
              </Link>
            </div>

            <div className="pt-2 text-xs font-mono text-[#64748B]">
              {product.demoNotes}
            </div>

          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
              System Architecture
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Comprehensive Operational Modules
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              Every department and operational workflow is unified under an intuitive, role-based interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.keyModules.map((m) => (
              <div key={m.name} className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-3">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2">{m.name}</h3>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Operational Workflow */}
      <section className="py-20 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              End-to-End Execution
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              How the System Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.workflow.map((w) => (
              <div key={w.step} className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] relative">
                <div className="text-2xl font-mono font-black text-[#00E676]/40">{w.step}</div>
                <h4 className="text-base font-heading font-bold text-white mt-2 mb-2">{w.title}</h4>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Enterprise Highlights
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Security, Printing & Integration Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <ShieldCheck className="w-6 h-6 text-[#A78BFA] mb-4" />
                <h3 className="text-base font-heading font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 border-b border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Clear Specifications
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
              Product Questions & Answers
            </h2>
          </div>

          <div className="space-y-4">
            {product.faqs.map((faq, idx) => (
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

      {/* Live Demo Booking CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-heading font-extrabold text-white">
            Schedule an Interactive Demonstration
          </h2>
          <p className="text-sm text-[#9AA3B8] leading-relaxed">
            See the live {product.title} in action. We walk through your exact operational workflows and discuss customization options.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/appointment?service=${product.slug}`}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all"
            >
              Book Live Demo Session
            </Link>
            <Link
              href={`/request-quote?service=${product.slug}`}
              className="px-7 py-4 rounded-xl border border-[#1E293B] text-white font-mono text-xs hover:border-[#38BDF8] transition-colors"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
