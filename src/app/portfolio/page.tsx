import React from 'react';
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
          {portfolioProjects.map((p) => (
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
