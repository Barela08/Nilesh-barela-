import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Code2, 
  Bot, 
  Smartphone, 
  Globe, 
  Cpu, 
  Lock, 
  GraduationCap, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Mail, 
  MessageCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { founderData } from '@/data/founder';
import { company } from '@/data/company';
import ContactForm from '@/components/forms/EnquiryForm';

export const metadata: Metadata = {
  title: 'Nilesh Barela – Founder of HackifyPro | App Developer & AI Enthusiast',
  description:
    'Meet Nilesh Barela, founder of HackifyPro, app developer, AI enthusiast and cybersecurity learner from Maharashtra, India.',
  keywords: [
    'Nilesh Barela',
    'Nilesh Barela Founder of HackifyPro',
    'Nilesh Barela App Developer',
    'Nilesh Barela AI Enthusiast',
    'Nilesh Barela Cybersecurity Learner',
    'HackifyPro Founder',
    'Ethical Hacking Educator',
    'Software Developer Maharashtra India',
    'App Developer Nashik'
  ],
  alternates: {
    canonical: `${company.websiteUrl}/nilesh-barela`,
  },
  openGraph: {
    type: 'profile',
    title: 'Nilesh Barela – Founder of HackifyPro | App Developer & AI Enthusiast',
    description:
      'Founder of HackifyPro. App developer, AI enthusiast, and cybersecurity learner from Maharashtra, India.',
    url: `${company.websiteUrl}/nilesh-barela`,
    siteName: 'HackifyPro',
    images: [
      {
        url: `${company.websiteUrl}/assets/nilesh-barela.jpg`,
        width: 800,
        height: 800,
        alt: 'Nilesh Barela – Founder of HackifyPro, App Developer from Maharashtra India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@NileshBarela6',
    creator: '@NileshBarela6',
    title: 'Nilesh Barela – Founder of HackifyPro',
    description:
      'App developer, AI enthusiast & cybersecurity learner. Founder of HackifyPro — empowering modern businesses with digital products.',
    images: [`${company.websiteUrl}/assets/nilesh-barela.jpg`],
  },
};

export default function FounderProfilePage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${company.websiteUrl}/nilesh-barela#person`,
    name: 'Nilesh Barela',
    givenName: 'Nilesh',
    familyName: 'Barela',
    jobTitle: 'Founder of HackifyPro | App Developer | AI Enthusiast | Cybersecurity Learner',
    description: founderData.bio,
    url: `${company.websiteUrl}/nilesh-barela`,
    image: `${company.websiteUrl}/assets/nilesh-barela.jpg`,
    nationality: 'Indian',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    email: founderData.socials.filter(s => s.url.startsWith('mailto:')).map(s => s.handle),
    sameAs: [
      'https://www.linkedin.com/in/nilesh-barels08/',
      'https://www.instagram.com/_https_nilesh08/',
      'https://x.com/NileshBarela6',
    ],
    knowsAbout: [
      'App Development',
      'Web Development',
      'Artificial Intelligence',
      'Machine Learning',
      'Cybersecurity',
      'Ethical Hacking',
      'Programming',
      'Technology Education',
    ],
    founder: {
      '@type': 'Organization',
      '@id': `${company.websiteUrl}/#org`,
      name: 'HackifyPro',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: founderData.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#1E293B]">
        {/* Soft neon gradient orbs matching reference styling */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#00E676]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Bio & Identity */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                <span>FOUNDER &bull; DEVELOPER &bull; AI ENTHUSIAST</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-none">
                Nilesh <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] via-[#38BDF8] to-[#A78BFA]">
                  Barela
                </span>
              </h1>

              <div className="text-sm sm:text-base font-mono text-[#38BDF8] font-medium flex flex-wrap items-center gap-2">
                <span>Founder of HackifyPro</span>
                <span>&bull;</span>
                <span>App Developer</span>
                <span>&bull;</span>
                <span>AI Enthusiast</span>
                <span>&bull;</span>
                <span>Cybersecurity Learner</span>
              </div>

              <div className="text-xs font-mono text-[#9AA3B8] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                <span>Location: Maharashtra, India</span>
              </div>

              <p className="text-base text-[#9AA3B8] leading-relaxed max-w-2xl">
                {founderData.bio}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#connect"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider shadow-glow-green hover:opacity-95 transition-all"
                >
                  Connect with Nilesh
                </a>
                <Link
                  href="/portfolio"
                  className="px-6 py-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-white hover:border-[#38BDF8] font-mono text-xs font-semibold tracking-wide transition-colors"
                >
                  View Projects
                </Link>
                <a
                  href="#about-hackifypro"
                  className="px-5 py-3.5 rounded-xl border border-transparent text-[#9AA3B8] hover:text-white font-mono text-xs transition-colors"
                >
                  About HackifyPro &rarr;
                </a>
              </div>

              {/* Verified Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#1E293B]">
                <div className="p-3 rounded-lg bg-[#0F1624] border border-[#1E293B]/80">
                  <div className="text-[11px] font-mono text-[#9AA3B8]">Domain</div>
                  <div className="text-xs font-semibold text-white mt-0.5">nileshbarela.site</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0F1624] border border-[#1E293B]/80">
                  <div className="text-[11px] font-mono text-[#9AA3B8]">Role</div>
                  <div className="text-xs font-semibold text-[#00E676] mt-0.5">Founder & Lead</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0F1624] border border-[#1E293B]/80 col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-mono text-[#9AA3B8]">Specialization</div>
                  <div className="text-xs font-semibold text-[#38BDF8] mt-0.5">App & Web Systems</div>
                </div>
              </div>

            </div>

            {/* Right: Optimized Founder Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#00E676] to-[#38BDF8] opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"></div>

                <div className="relative w-72 sm:w-80 h-96 sm:h-[420px] rounded-2xl overflow-hidden border-2 border-[#1E293B] bg-[#0F1624] shadow-card">
                  <Image
                    src="/assets/nilesh-barela.jpg"
                    alt="Nilesh Barela – Founder of HackifyPro, App Developer from Maharashtra India"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Bottom overlay badge */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/80 to-transparent p-5 pt-12">
                    <div className="font-heading font-bold text-white text-lg">Nilesh Barela</div>
                    <div className="text-xs font-mono text-[#00E676]">Founder @ HackifyPro</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Nilesh Section */}
      <section className="py-20 border-b border-[#1E293B] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Detailed Background
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              About Nilesh Barela
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              Combining hands-on engineering, continuous learning, and practical technology education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {founderData.aboutSections.map((sec, idx) => (
              <div 
                key={sec.title}
                className={`p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/50 transition-all ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-2 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                  <span>{sec.title}</span>
                </div>
                <p className="text-sm text-[#E8EDF5] leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Technical Interests Section */}
      <section className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
              Domains of Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Technical Interests & Expertise
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              Practical disciplines and technical domains Nilesh explores and applies at HackifyPro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {founderData.technicalInterests.map((interest) => (
              <div 
                key={interest.name}
                className="p-5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 hover:bg-[#141D30] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#9AA3B8] uppercase">
                    {interest.category}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#00E676] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-base font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                  {interest.name}
                </h3>
                <p className="text-xs text-[#9AA3B8] mt-1.5 leading-relaxed">
                  {interest.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* About HackifyPro Section */}
      <section id="about-hackifypro" className="py-20 border-b border-[#1E293B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Founded Company
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              About HackifyPro
            </h2>

            {/* Motto */}
            <div className="mt-4 inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-[#0F1624] border border-[#1E293B] text-sm font-mono">
              <span className="text-[#00E676] font-bold">SECURE</span>
              <span className="text-[#64748B]">|</span>
              <span className="text-[#38BDF8] font-bold">LEARN</span>
              <span className="text-[#64748B]">|</span>
              <span className="text-[#A78BFA] font-bold">INNOVATE</span>
            </div>
            
            <p className="text-sm text-[#9AA3B8] mt-4 leading-relaxed">
              HackifyPro is a technology and software development company focused on developing commercial websites, Android apps, and business software, while providing technology education and cybersecurity awareness resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {founderData.hackifyproServices.map((svc) => (
              <div 
                key={svc.title}
                className="p-5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/40 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#141D30] border border-[#1E293B] flex items-center justify-center text-[#38BDF8] mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-heading font-bold text-white mb-1.5">{svc.title}</h4>
                <p className="text-xs text-[#9AA3B8] leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Connect with Nilesh Section */}
      <section id="connect" className="py-20 border-b border-[#1E293B] bg-[#05070C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
              Public Channels
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Connect with Nilesh
            </h2>
            <p className="text-sm text-[#9AA3B8] mt-2">
              Follow his technical journey, collaborate on software projects, or discuss digital innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {founderData.socials.slice(0, 4).map((s) => (
              <a
                key={s.name}
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] hover:bg-[#141D30] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-medium text-[#9AA3B8]">{s.name}</span>
                    <ExternalLink className="w-4 h-4 text-[#64748B] group-hover:text-[#00E676] transition-colors" />
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-[#00E676] transition-colors break-all">
                    {s.handle}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#9AA3B8] group-hover:text-white font-mono">
                  <span>Open Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* Founder Direct Enquiry Form Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl relative">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                Direct Project Discussion
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-white mt-2">
                Let&#8217;s Build Something Together
              </h2>
              <p className="text-sm text-[#9AA3B8] mt-2">
                Have an idea for a website, Android app, or custom software? Reach out directly to Nilesh and the HackifyPro team.
              </p>
            </div>

            <ContactForm defaultService="custom-software-development" />

            <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#9AA3B8]">
              <span>Official Email: <a href="mailto:hackifypro@gmail.com" className="text-[#00E676] hover:underline">hackifypro@gmail.com</a></span>
              <span>&bull;</span>
              <span>Founder: <a href="mailto:barelanilesh483@gmail.com" className="text-[#38BDF8] hover:underline">barelanilesh483@gmail.com</a></span>
              <span>&bull;</span>
              <span>WhatsApp: <a href="https://wa.me/917414935405" className="text-[#A78BFA] hover:underline">+91 7414935405</a></span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
