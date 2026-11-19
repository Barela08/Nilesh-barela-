import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Smartphone, 
  Laptop, 
  Cpu, 
  Zap, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Car, 
  Utensils, 
  Dumbbell, 
  Shield, 
  Calendar,
  MessageCircle,
  FileText,
  Layers,
  Code2,
  ExternalLink
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { productsData } from '@/data/products';
import { dbProjects } from '@/lib/db';
import { founderData } from '@/data/founder';
import { company } from '@/data/company';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'HackifyPro | Website, Android App & Custom Software Development Company',
  description:
    'HackifyPro is a premier software development company in Nashik, Maharashtra. We engineer fast business websites, custom Android apps, web apps, and management software (Hospital, Restaurant POS, Car Rental & Gym). Get a free quote today.',
  keywords: [
    'Website Development Company in Nashik',
    'Android App Development in Nashik',
    'Software Development Company in Nashik',
    'Custom Software Development Maharashtra',
    'Hospital Management Software',
    'Restaurant POS Billing Software',
    'Car Rental Management System',
    'Gym Management Software',
    'Nilesh Barela',
    'HackifyPro',
  ],
  alternates: {
    canonical: 'https://www.nileshbarela.site',
  },
  openGraph: {
    title: 'HackifyPro | Website, Android App & Custom Software Development Company',
    description:
      'We build high-performance business websites, Android apps, and specialized ERP software (Hospital, Restaurant, Car Rental, Gym) for businesses in Nashik and across India.',
    url: 'https://www.nileshbarela.site',
    siteName: 'HackifyPro',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.nileshbarela.site/assets/hackifypro-banner.png',
        width: 1200,
        height: 630,
        alt: 'HackifyPro Software Development & IT Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackifyPro | Website, Android App & Custom Software Development Company',
    description:
      'We build high-performance business websites, Android apps, and specialized ERP software (Hospital, Restaurant, Car Rental, Gym) for businesses in Nashik and across India.',
    images: ['https://www.nileshbarela.site/assets/hackifypro-banner.png'],
  },
};

export default function HomePage() {
  const portfolioProjects = dbProjects.getAll();
  const processSteps = [
    { num: '01', title: 'Requirement Analysis', desc: 'Understanding your business workflow, operational goals, target users, and key features.' },
    { num: '02', title: 'Planning & Architecture', desc: 'Defining database models, API specs, security requirements, and development milestones.' },
    { num: '03', title: 'UI/UX Design', desc: 'Crafting responsive, high-contrast, accessible prototypes and user journeys.' },
    { num: '04', title: 'Full-Stack Development', desc: 'Writing clean, modular code with modern frameworks (React, Next.js, Android, Python).' },
    { num: '05', title: 'Testing & Hardening', desc: 'Rigorous cross-device testing, performance audits, and security vulnerability reviews.' },
    { num: '06', title: 'Deployment & Setup', desc: 'Configuring custom domains, SSL, CDN caching, and search console indexing.' },
    { num: '07', title: 'Ongoing Maintenance', desc: 'Proactive updates, automated cloud backups, and responsive technical support.' },
  ];

  const valueProps = [
    { title: 'Custom Software Development', desc: 'Tailored specifically to your business rules, replacing rigid generic software.' },
    { title: 'Business-Focused Solutions', desc: 'Engineering focused on measurable operational efficiency and revenue expansion.' },
    { title: 'Responsive Web Applications', desc: 'Sub-second load times engineered for mobile devices, tablets, and desktops.' },
    { title: 'Modern Technology Stack', desc: 'React, Next.js, TypeScript, Kotlin, Python, and relational SQL databases.' },
    { title: 'Scalable Architecture', desc: 'Cloud-native design built to expand as your users, transactions, and branches grow.' },
    { title: 'Direct Technical Support', desc: 'Direct access to core software engineers who built your product.' },
  ];

  return (
    <div className="bg-[#080B12] text-[#E8EDF5]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden tech-grid-bg border-b border-[#1E293B]">
        {/* Soft neon gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00E676]/15 via-[#38BDF8]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Official Brand Logo */}
            <div className="flex justify-center mb-1">
              <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-[#0F1624]/90 border border-[#1E293B] shadow-2xl backdrop-blur-md hover:border-[#00E676]/40 transition-all">
                <Image
                  src="/assets/hackifypro-shield.png"
                  alt="HackifyPro Shield Logo"
                  width={38}
                  height={46}
                  className="w-9 h-auto filter drop-shadow-[0_0_12px_rgba(0,230,118,0.4)]"
                  priority
                />
                <div className="text-left">
                  <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center leading-none">
                    Hackify<span className="text-[#00E676]">Pro</span>
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#9AA3B8] uppercase block mt-1">
                    Secure &bull; Learn &bull; Innovate
                  </span>
                </div>
              </div>
            </div>

            {/* Core Capability Badge - Instant Clarity */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
              <span className="text-[#00E676] font-bold">WEBSITES</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#38BDF8] font-bold">ANDROID APPS</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#A78BFA] font-bold">CUSTOM BUSINESS SOFTWARE</span>
            </div>

            {/* Headline - Crystal Clear Value Proposition */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1]">
              We Build Websites, <br className="hidden sm:inline" />
              Android Apps &amp; Custom Software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] via-[#38BDF8] to-[#A78BFA]">
                That Grow Your Business.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-xl text-[#9AA3B8] max-w-3xl mx-auto font-body leading-relaxed">
              HackifyPro is a modern technology &amp; software development company in Maharashtra. We build fast, search-optimized business websites, native Android applications, web applications, and complete management software (Hospital, Restaurant, Car Rental, Gym &amp; Driving School) for modern businesses.
            </p>

            {/* 4 Instant Capability Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-2">
              <div className="p-2.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Business Websites</span>
                </div>
                <div className="text-[11px] text-[#9AA3B8] mt-0.5">High-Speed &amp; SEO Ready</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Android Apps</span>
                </div>
                <div className="text-[11px] text-[#9AA3B8] mt-0.5">Native, Play Store Ready</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Laptop className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>ERP &amp; Management</span>
                </div>
                <div className="text-[11px] text-[#9AA3B8] mt-0.5">Hospital, POS, Rental, Gym</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>Direct Support</span>
                </div>
                <div className="text-[11px] text-[#9AA3B8] mt-0.5">Direct Developer Access</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/request-quote"
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-sm font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Get Free Project Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="https://wa.me/917414935405?text=Hi%20HackifyPro%2C%20I%20want%20to%20discuss%20a%20website%20or%20software%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl bg-[#0F1624] border border-[#00E676]/40 hover:border-[#00E676] text-white font-mono text-sm font-semibold tracking-wide transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-[#00E676]" />
                <span>WhatsApp (+91 7414935405)</span>
              </a>

              <Link
                href="/appointment"
                className="px-6 py-4 rounded-xl text-[#9AA3B8] hover:text-white font-mono text-sm transition-colors flex items-center space-x-1.5"
              >
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <span>Book Call &rarr;</span>
              </Link>
            </div>

            {/* Local Context Notice */}
            <div className="pt-4 text-xs font-mono text-[#64748B] flex items-center justify-center space-x-2">
              <span>Primary Hub: Nashik, Maharashtra, India</span>
              <span>&bull;</span>
              <span className="text-[#00E676]">Fast Turnaround &bull; 100% Dedicated Support</span>
            </div>

          </div>

          {/* Technology Workspace & Project Preview Graphic */}
          <div className="mt-16 max-w-5xl mx-auto relative">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F1624] p-3 sm:p-4 shadow-2xl relative overflow-hidden group">
              <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden bg-[#080B12]">
                <Image
                  src="/assets/hackifypro-workspace.png"
                  alt="HackifyPro Technology Development Workspace & Hospital Management System Architecture"
                  fill
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                  priority
                />
                
                {/* Overlay Cards */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#080B12]/90 backdrop-blur-md border border-[#1E293B] rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase">Live Demonstration Ready</span>
                  </div>
                  <div className="text-sm font-heading font-bold text-[#38BDF8]">
                    HackifyPro Hospital Management System (HMS)
                  </div>
                  <div className="text-xs text-[#9AA3B8] mt-1">
                    React + TypeScript + FastAPI + SQLite architecture designed for clinics and hospitals.
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TRUST & VALUE PROPOSITIONS */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Engineered for Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Why Businesses Build with HackifyPro
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              We focus on genuine engineering capability, transparent architecture, and measurable business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((item, idx) => (
              <div 
                key={item.title}
                className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-center text-[#00E676] mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#9AA3B8] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CORE SERVICES SECTION */}
      <section className="py-20 border-b border-[#1E293B] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                Software Engineering
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
                Our Development Services
              </h2>
            </div>
            <Link 
              href="/services" 
              className="mt-4 md:mt-0 text-sm font-mono text-[#00E676] hover:underline flex items-center"
            >
              <span>View All 7 Services</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.slice(0, 6).map((svc) => (
              <Link
                key={svc.slug}
                href={svc.path}
                className="p-7 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] hover:bg-[#141D30] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-center text-[#00E676] mb-5 group-hover:scale-110 transition-transform">
                    {svc.slug === 'website-development' && <Globe className="w-6 h-6" />}
                    {svc.slug === 'android-app-development' && <Smartphone className="w-6 h-6" />}
                    {svc.slug === 'web-application-development' && <Laptop className="w-6 h-6" />}
                    {svc.slug === 'custom-software-development' && <Cpu className="w-6 h-6" />}
                    {svc.slug === 'business-automation' && <Zap className="w-6 h-6" />}
                    {svc.slug === 'software-maintenance' && <Wrench className="w-6 h-6" />}
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-[#9AA3B8] mt-2.5 leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#9AA3B8] group-hover:text-white">
                  <span>Explore Architecture & Process</span>
                  <ArrowRight className="w-4 h-4 text-[#00E676] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BUSINESS SOFTWARE SOLUTIONS SECTION */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Turnkey Management Systems
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Business Software Products
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              Pre-architected, modular management systems designed for rapid deployment with live demonstration capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.map((prod) => (
              <div
                key={prod.slug}
                className="p-7 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] font-bold border border-[#38BDF8]/20">
                      {prod.badge}
                    </span>
                    <span className="text-xs font-mono text-[#00E676] flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#00E676] mr-1.5 animate-pulse"></span>
                      {prod.status === 'Live & Demonstration Ready' ? 'Demo Ready' : 'Deployable'}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white hover:text-[#38BDF8] transition-colors">
                    <Link href={prod.path}>{prod.title}</Link>
                  </h3>

                  <p className="text-xs font-mono text-[#9AA3B8] mt-1">
                    {prod.tagline}
                  </p>

                  <p className="text-sm text-[#9AA3B8] mt-3 line-clamp-3 leading-relaxed">
                    {prod.overview}
                  </p>

                  <div className="mt-5 space-y-1.5">
                    {prod.keyModules.slice(0, 3).map((m) => (
                      <div key={m.name} className="text-xs text-[#E8EDF5] flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                        <span>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                  <Link
                    href={prod.path}
                    className="text-xs font-mono text-[#38BDF8] hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                  <Link
                    href={`/appointment?service=${prod.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-xs font-mono font-bold text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#080B12] transition-all"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PORTFOLIO SHOWCASE */}
      <section className="py-20 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
                Verified Deliverables
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
                Featured Project Case Studies
              </h2>
            </div>
            <Link 
              href="/portfolio" 
              className="mt-4 md:mt-0 text-sm font-mono text-[#00E676] hover:underline flex items-center"
            >
              <span>Explore All Case Studies</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((p) => (
              <div 
                key={p.id}
                className="rounded-2xl bg-[#0F1624] border border-[#1E293B] overflow-hidden hover:border-[#00E676]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-[#080B12] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#080B12]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#00E676]">
                      {p.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                      {p.title}
                    </h3>

                    <p className="text-xs text-[#9AA3B8] mt-2 leading-relaxed">
                      {p.summary}
                    </p>

                    <div className="mt-4 p-3 rounded-lg bg-[#080B12] border border-[#1E293B]/70 text-xs">
                      <span className="font-mono text-[#38BDF8] block font-semibold mb-1">Problem Solved:</span>
                      <span className="text-[#9AA3B8]">{p.problemSolved}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#E8EDF5]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00E676]">{p.status}</span>
                    {p.demoUrl && p.demoUrl.startsWith('http') ? (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#00E676] hover:underline flex items-center"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    ) : p.demoUrl ? (
                      <Link
                        href={p.demoUrl}
                        className="text-xs font-mono text-white hover:text-[#00E676] flex items-center"
                      >
                        <span>Demo & Scope</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    ) : (
                      <Link
                        href="/appointment"
                        className="text-xs font-mono text-white hover:text-[#00E676] flex items-center"
                      >
                        <span>Schedule Demo</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. DEVELOPMENT PROCESS */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Our 7-Step Engineering Process
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              From initial discovery to post-launch optimization, every stage is executed with strict quality controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] relative group hover:border-[#38BDF8]/40 transition-all"
              >
                <div className="text-2xl font-mono font-black text-[#1E293B] group-hover:text-[#38BDF8]/30 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-heading font-bold text-white mt-2 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. MEET THE FOUNDER INTRO */}
      <section className="py-20 border-b border-[#1E293B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-[#0F1624] border border-[#1E293B] p-8 sm:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-56 h-64 rounded-2xl overflow-hidden border-2 border-[#1E293B] bg-[#080B12] shadow-2xl">
                  <Image
                    src="/assets/nilesh-barela.jpg"
                    alt="Nilesh Barela, Founder of HackifyPro"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
                  <span>FOUNDER INTRODUCTION</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  Meet Nilesh Barela
                </h2>

                <div className="text-xs sm:text-sm font-mono text-[#38BDF8]">
                  Founder of HackifyPro &bull; App Developer &bull; AI Enthusiast &bull; Maharashtra, India
                </div>

                <p className="text-sm text-[#9AA3B8] leading-relaxed">
                  &ldquo;{founderData.bio}&rdquo;
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/nilesh-barela"
                    className="px-6 py-3 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-2"
                  >
                    <span>Meet the Founder Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://www.linkedin.com/in/nilesh-barels08/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl border border-[#1E293B] text-xs font-mono text-[#9AA3B8] hover:text-white transition-colors"
                  >
                    LinkedIn Profile &rarr;
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERSION CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#080B12] to-[#05070C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>READY TO ACCELERATE YOUR BUSINESS?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Have an Idea? Let&#8217;s Build It Together.
          </h2>

          <p className="text-base sm:text-lg text-[#9AA3B8] max-w-2xl mx-auto leading-relaxed">
            Discuss your requirements directly with our technical team. Get an itemized scope estimate, clear milestones, and dedicated developer support.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/appointment"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-sm font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/request-quote"
              className="px-8 py-4 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8] text-white font-mono text-sm font-semibold tracking-wide transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-[#38BDF8]" />
              <span>Request a Quote</span>
            </Link>

            <a
              href={company.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] font-mono text-sm font-bold hover:bg-[#00E676] hover:text-[#080B12] transition-all flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
