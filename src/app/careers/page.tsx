import React from 'react';
import type { Metadata } from 'next';
import { ArrowRight, Code2, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Collaboration | HackifyPro',
  description: 'Join HackifyPro in building digital products, learning modern web architectures, and innovating technology for modern businesses.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/careers',
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
