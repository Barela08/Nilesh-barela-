import os

# 1. /about
os.makedirs('src/app/about', exist_ok=True)
about_content = """import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Target, Eye, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'About HackifyPro | Technology & Digital Solutions',
  description: 'Learn about HackifyPro, our mission to build powerful digital solutions for modern businesses, and our core motto: SECURE | LEARN | INNOVATE.',
  alternates: {
    canonical: 'https://nileshbarela.site/about',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676] mb-4">
            <span>ABOUT HACKIFYPRO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Building Powerful Digital Solutions for Modern Businesses
          </h1>
          <p className="text-base text-[#9AA3B8] mt-4 leading-relaxed font-body">
            HackifyPro is a technology and software development company based in Maharashtra, India. We engineer high-performance web applications, custom Android applications, modern websites, and business automation platforms.
          </p>
        </div>

        {/* Motto Section */}
        <div className="my-14 p-8 sm:p-12 rounded-3xl bg-[#0F1624] border border-[#1E293B] text-center max-w-4xl mx-auto">
          <div className="text-xs font-mono text-[#9AA3B8] uppercase tracking-wider mb-2">Our Operating Philosophy</div>
          <div className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-white mb-4">
            <span className="text-[#00E676]">SECURE</span> &nbsp;|&nbsp; 
            <span className="text-[#38BDF8]">LEARN</span> &nbsp;|&nbsp; 
            <span className="text-[#A78BFA]">INNOVATE</span>
          </div>
          <p className="text-sm text-[#9AA3B8] max-w-2xl mx-auto leading-relaxed">
            Every software product we build is rooted in security and data protection, powered by continuous technical learning, and engineered to innovate everyday business workflows.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">Our Mission</h2>
            <p className="text-sm text-[#9AA3B8] leading-relaxed">
              To eliminate operational friction for growing companies by engineering reliable, secure, and accessible custom software—giving businesses full code ownership and eliminating expensive recurring SaaS bottlenecks.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">Our Vision</h2>
            <p className="text-sm text-[#9AA3B8] leading-relaxed">
              To be Maharashtra&#8217;s premier software engineering and digital innovation partner, setting the benchmark for performance, clean architecture, and practical cybersecurity awareness.
            </p>
          </div>
        </div>

        {/* Commercial & Education Identity */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F1624] to-[#080B12] border border-[#1E293B] max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-heading font-extrabold text-white mb-4">
            A Dual Identity: Commercial Engineering & Technology Education
          </h2>
          <p className="text-sm text-[#9AA3B8] leading-relaxed mb-6">
            While HackifyPro&#8217;s primary commercial objective is delivering software development, custom applications, and IT solutions to businesses, technology education and cybersecurity awareness remain an integral part of our brand identity. We share real-world tutorials, ethical hacking education, and developer resources to empower the next generation of engineers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] text-[#E8EDF5]">
              <span className="text-[#00E676] font-bold block mb-1">Commercial Software Services</span>
              Custom websites, Android mobile applications, Hospital Management Systems, and CRM automation suites.
            </div>
            <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] text-[#E8EDF5]">
              <span className="text-[#38BDF8] font-bold block mb-1">Technology Education</span>
              Practical cybersecurity guidance, programming tutorials, student career roadmaps, and ethical hacking awareness.
            </div>
          </div>
        </div>

        {/* Founder CTA Banner */}
        <div className="text-center p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B] max-w-3xl mx-auto">
          <h3 className="text-xl font-heading font-bold text-white mb-2">Founded by Nilesh Barela</h3>
          <p className="text-sm text-[#9AA3B8] mb-4">
            Discover the story, skills, and technical interests of our founder.
          </p>
          <Link
            href="/nilesh-barela"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#00E676] hover:underline"
          >
            <span>Explore Founder Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/about/page.tsx', 'w', encoding='utf-8') as f:
    f.write(about_content)
print("Generated /about page.")

# 2. /portfolio
os.makedirs('src/app/portfolio', exist_ok=True)
portfolio_content = """import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { portfolioProjects } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio & Software Projects | HackifyPro',
  description: 'Explore real-world software solutions, web applications, and digital platforms engineered by HackifyPro.',
  alternates: {
    canonical: 'https://nileshbarela.site/portfolio',
  },
};

export default function PortfolioPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Verified Deliverables
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Our Software Engineering Portfolio
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Every project represents a real business challenge solved through clean code, scalable architecture, and user-centric design.
          </p>
        </div>

        <div className="space-y-12">
          {portfolioProjects.map((p, idx) => (
            <div 
              key={p.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B]">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#080B12] text-[#00E676] border border-[#1E293B]">
                    {p.category}
                  </span>
                  <span className="text-xs font-mono text-[#9AA3B8]">{p.market}</span>
                </div>

                <h2 className="text-2xl font-heading font-extrabold text-white">
                  {p.title}
                </h2>

                <p className="text-sm text-[#9AA3B8] leading-relaxed">
                  {p.summary}
                </p>

                <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs">
                  <strong className="text-[#38BDF8] block mb-1 font-mono">Problem Solved:</strong>
                  <span className="text-[#9AA3B8]">{p.problemSolved}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {p.mainFeatures.map((feat, i) => (
                    <div key={i} className="text-xs text-[#E8EDF5] flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#38BDF8] border border-[#1E293B]">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <Link
                    href={p.demoUrl || '/appointment'}
                    className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Request Demo
                  </Link>
                  <Link
                    href="/appointment"
                    className="text-xs font-mono text-white hover:text-[#00E676] flex items-center"
                  >
                    <span>Discuss Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/portfolio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(portfolio_content)
print("Generated /portfolio page.")

# 3. /contact
os.makedirs('src/app/contact', exist_ok=True)
contact_content = """import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
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
"""
with open('src/app/contact/page.tsx', 'w', encoding='utf-8') as f:
    f.write(contact_content)
print("Generated /contact page.")

# 4. /faq
os.makedirs('src/app/faq', exist_ok=True)
faq_content = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Search, ArrowRight } from 'lucide-react';
import { allFaqs } from '@/data/faq';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  const filteredCategories = allFaqs.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#9AA3B8]">
            Find clear answers about HackifyPro services, development timelines, software solutions, and project engagement.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions (e.g. Nashik, timeline, demo)..."
              className="w-full bg-[#0F1624] border border-[#1E293B] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-3.5" />
          </div>
        </div>

        <div className="space-y-10">
          {filteredCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-[#38BDF8] border-b border-[#1E293B] pb-2">
                {cat.category}
              </h2>

              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={item.question} className="border border-[#1E293B] rounded-xl bg-[#0F1624] overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#00E676] transition-colors"
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-5 pt-0 text-xs sm:text-sm text-[#9AA3B8] leading-relaxed border-t border-[#1E293B]/60">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
          <h3 className="text-lg font-heading font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-xs text-[#9AA3B8] mb-4">We are always available to discuss your specific technical requirements.</p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#00E676] hover:underline"
          >
            <span>Reach Out on Our Contact Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/faq/page.tsx', 'w', encoding='utf-8') as f:
    f.write(faq_content)
print("Generated /faq page.")

# 5. /careers
os.makedirs('src/app/careers', exist_ok=True)
careers_content = """import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Collaboration | HackifyPro',
  description: 'Join HackifyPro in building digital products, learning modern web architectures, and innovating technology for modern businesses.',
  alternates: {
    canonical: 'https://nileshbarela.site/careers',
  },
};

export default function CareersPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Culture & Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Grow Your Tech Career with HackifyPro
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            We are a developer-driven technology team passionate about clean architecture, continuous learning, and real-world software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <Code2 className="w-8 h-8 text-[#00E676] mb-3" />
            <h3 className="text-base font-heading font-bold text-white mb-2">Hands-on Engineering</h3>
            <p className="text-xs text-[#9AA3B8] leading-relaxed">
              Work on production web applications, Android mobile codebases, and real-world client management systems.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <ShieldCheck className="w-8 h-8 text-[#38BDF8] mb-3" />
            <h3 className="text-base font-heading font-bold text-white mb-2">Continuous Learning</h3>
            <p className="text-xs text-[#9AA3B8] leading-relaxed">
              Live by our motto 'LEARN' with access to cybersecurity tutorials, ethical hacking resources, and AI tools.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <Sparkles className="w-8 h-8 text-[#A78BFA] mb-3" />
            <h3 className="text-base font-heading font-bold text-white mb-2">Direct Mentorship</h3>
            <p className="text-xs text-[#9AA3B8] leading-relaxed">
              Collaborate directly with founder Nilesh Barela and senior developers in Maharashtra.
            </p>
          </div>
        </div>

        {/* Current Collaboration Channels */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F1624] border border-[#1E293B] text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Internships & Project Collaborations
          </h2>
          <p className="text-sm text-[#9AA3B8] max-w-2xl mx-auto leading-relaxed">
            We regularly collaborate with passionate student developers, UI/UX designers, and freelance engineers in Maharashtra and across India. If you have skills in React, Next.js, Kotlin, Python, or cybersecurity testing, we would love to hear from you.
          </p>
          <div className="pt-2">
            <a
              href="mailto:hackifypro@gmail.com?subject=Career%20/%20Internship%20Inquiry%20-%20HackifyPro"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <span>Email Your Resume / GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/careers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(careers_content)
print("Generated /careers page.")

# 6. /blog listing
os.makedirs('src/app/blog', exist_ok=True)
blog_hub_content = """import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog & Technology Insights | HackifyPro',
  description: 'Articles on modern web architecture, Android app engineering, custom software ROI, and practical cybersecurity by HackifyPro.',
  alternates: {
    canonical: 'https://nileshbarela.site/blog',
  },
};

export default function BlogListingPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Technical Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            HackifyPro Blog & Guides
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Practical insights on web development, Android applications, cybersecurity essentials, and software strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <article 
              key={post.slug}
              className="p-8 rounded-3xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#080B12] text-[#38BDF8] border border-[#1E293B]">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-[#64748B] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#00E676] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#9AA3B8] mt-3 leading-relaxed">
                  {post.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#9AA3B8]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                <div className="text-xs text-[#9AA3B8] flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>{post.author.name}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-mono font-bold text-[#00E676] hover:underline flex items-center"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/blog/page.tsx', 'w', encoding='utf-8') as f:
    f.write(blog_hub_content)
print("Generated /blog page.")

# 7. /blog/[slug]
os.makedirs('src/app/blog/[slug]', exist_ok=True)
blog_detail_content = """import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { company } from '@/data/company';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | HackifyPro Blog`,
    description: post.summary,
    alternates: {
      canonical: `${company.websiteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `${company.websiteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${company.websiteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${company.websiteUrl}/nilesh-barela`,
    },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      logo: {
        '@type': 'ImageObject',
        url: `${company.websiteUrl}/assets/hackifypro-storefront.png`,
      },
    },
  };

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#9AA3B8] hover:text-[#00E676] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Header */}
        <header className="space-y-4 mb-10 pb-8 border-b border-[#1E293B]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30">
              {post.category}
            </span>
            <span className="text-xs font-mono text-[#9AA3B8] flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {post.readingTime}
            </span>
            <span className="text-xs font-mono text-[#9AA3B8] flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {post.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00E676]">
              <Image
                src={post.author.image}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                <Link href="/nilesh-barela" className="hover:text-[#00E676] underline decoration-dotted">
                  {post.author.name}
                </Link>
              </div>
              <div className="text-xs font-mono text-[#9AA3B8]">{post.author.role}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6 text-base text-[#E8EDF5] leading-relaxed font-body">
          {post.content.map((p, i) => (
            <p key={i} className="text-[#E8EDF5]/90">
              {p}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-[#1E293B] flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#9AA3B8]">Tags:</span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded bg-[#0F1624] text-[#38BDF8] border border-[#1E293B]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-[#00E676]">
            <Image src="/assets/nilesh-barela.jpg" alt="Nilesh Barela" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-heading font-bold text-white">Written by Nilesh Barela</div>
            <p className="text-xs text-[#9AA3B8] mt-1 leading-relaxed">
              Founder of HackifyPro. App developer, AI enthusiast, and cybersecurity learner helping businesses build scalable digital products.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#1E293B]">
            <h3 className="text-xl font-heading font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div key={rel.slug} className="p-5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all">
                  <span className="text-[10px] font-mono text-[#38BDF8] block mb-1">{rel.category}</span>
                  <h4 className="text-sm font-bold text-white hover:text-[#00E676]">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
"""
with open('src/app/blog/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(blog_detail_content)
print("Generated /blog/[slug] page.")
"""
with open('scripts/build_company_pages.py', 'w', encoding='utf-8') as f:
    f.write(company_pages_code)
print("Generated scripts/build_company_pages.py.")
