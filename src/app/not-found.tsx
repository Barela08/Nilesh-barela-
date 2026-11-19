import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B12] text-[#E8EDF5] flex items-center justify-center px-4 pt-32 pb-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block p-3 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] font-mono text-xs">
          404 &bull; PAGE NOT FOUND
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
          Lost in Cyberspace?
        </h1>
        <p className="text-sm text-[#9AA3B8] leading-relaxed">
          The requested page could not be found or may have been moved.
        </p>
        <div className="pt-4 flex items-center justify-center space-x-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:opacity-95 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 rounded-xl bg-[#0F1624] border border-[#1E293B] text-white font-mono text-xs hover:border-[#38BDF8] transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}