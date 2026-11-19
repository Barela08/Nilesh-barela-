import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Activity, Car, Utensils, Dumbbell, Shield, Sparkles } from 'lucide-react';
import { productsData } from '@/data/products';

export const metadata: Metadata = {
  title: 'Business Software Solutions & Management Systems | HackifyPro',
  description: 'Explore turnkey business management software solutions developed by HackifyPro for healthcare, car rentals, restaurants, gyms, and driving schools.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/products',
  },
};

export default function ProductsHubPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Turnkey Management Systems
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Business Software Products
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Eliminate chaotic spreadsheets and fragmented legacy programs. HackifyPro builds specialized management software engineered for industry-specific operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.map((prod) => (
            <div 
              key={prod.slug}
              className="p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-bold uppercase">
                    {prod.badge}
                  </span>
                  <span className="text-xs font-mono text-[#00E676] flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] mr-1.5 animate-pulse"></span>
                    {prod.status === 'Live & Demonstration Ready' ? 'Demo Ready' : 'Deployable'}
                  </span>
                </div>

                <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                  {prod.title}
                </h2>

                <p className="text-xs font-mono text-[#9AA3B8] mt-1">
                  {prod.tagline}
                </p>

                <p className="text-sm text-[#9AA3B8] mt-3 leading-relaxed">
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

              <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                <Link
                  href={prod.path}
                  className="text-xs font-mono font-bold text-[#38BDF8] hover:underline flex items-center"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  href={`/appointment?service=${prod.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-xs font-mono font-bold text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#080B12] transition-all"
                >
                  Demo Session
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
