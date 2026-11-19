import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Smartphone, Laptop, Cpu, Zap, Wrench, Palette, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/data/services';

export const metadata: Metadata = {
  title: 'Software Development & IT Services | HackifyPro',
  description: 'Explore the full suite of software development, mobile application, web engineering, and automation services offered by HackifyPro.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/services',
  },
};

export default function ServicesHubPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Comprehensive Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Our Software Development Services
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            From custom business websites and native Android apps to enterprise web applications and workflow automation, HackifyPro builds scalable digital solutions engineered for reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((svc) => (
            <div 
              key={svc.slug}
              className="p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-center text-[#00E676] mb-5 group-hover:scale-110 transition-transform">
                  {svc.slug === 'website-development' && <Globe className="w-6 h-6" />}
                  {svc.slug === 'android-app-development' && <Smartphone className="w-6 h-6" />}
                  {svc.slug === 'web-application-development' && <Laptop className="w-6 h-6" />}
                  {svc.slug === 'custom-software-development' && <Cpu className="w-6 h-6" />}
                  {svc.slug === 'business-automation' && <Zap className="w-6 h-6" />}
                  {svc.slug === 'software-maintenance' && <Wrench className="w-6 h-6" />}
                  {svc.slug === 'ui-ux-design' && <Palette className="w-6 h-6" />}
                </div>

                <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                  {svc.title}
                </h2>

                <p className="text-sm text-[#9AA3B8] mt-2.5 leading-relaxed">
                  {svc.shortDesc}
                </p>

                <div className="mt-5 space-y-1.5">
                  {svc.features.slice(0, 3).map((f) => (
                    <div key={f.title} className="text-xs text-[#E8EDF5] flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                      <span>{f.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                <Link
                  href={svc.path}
                  className="text-xs font-mono font-bold text-[#00E676] hover:underline flex items-center"
                >
                  <span>Read Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  href={`/request-quote?service=${svc.slug}`}
                  className="text-xs font-mono text-[#9AA3B8] hover:text-white"
                >
                  Get Quote &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
