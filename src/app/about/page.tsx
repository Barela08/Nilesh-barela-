import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, ArrowRight } from 'lucide-react';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'About HackifyPro | Technology & Digital Solutions',
  description: 'Learn about HackifyPro, our mission to build powerful digital solutions for modern businesses, and our core motto: SECURE | LEARN | INNOVATE.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/about',
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
          <div className="w-20 h-20 relative mx-auto mb-5">
            <Image
              src="/assets/hackifypro-icon.png"
              alt="HackifyPro Emblem"
              width={80}
              height={80}
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,230,118,0.35)]"
            />
          </div>
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
