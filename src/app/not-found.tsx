import React from 'react';
import Link from 'next/link';
import { Home, Globe, Laptop, User, MessageCircle, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B12] text-[#E8EDF5] flex items-center justify-center px-4 pt-32 pb-24 tech-grid-bg">
      <div className="max-w-lg w-full text-center space-y-6 bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] font-mono text-xs font-bold">
          404 • PAGE NOT FOUND
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
          Looking for Something Specific?
        </h1>
        
        <p className="text-sm text-[#9AA3B8] leading-relaxed">
          The page you requested may have moved or doesn’t exist. Here are popular pages to help you get back on track:
        </p>

        {/* Helpful quick directory */}
        <div className="grid grid-cols-2 gap-3 text-left pt-2">
          <Link
            href="/"
            className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#00E676] transition-colors group"
          >
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <Home className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Homepage</span>
            </div>
            <div className="text-[11px] text-[#9AA3B8] mt-0.5">Overview &amp; Products</div>
          </Link>

          <Link
            href="/services"
            className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#38BDF8] transition-colors group"
          >
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Services</span>
            </div>
            <div className="text-[11px] text-[#9AA3B8] mt-0.5">Web &amp; Android Apps</div>
          </Link>

          <Link
            href="/products"
            className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#A78BFA] transition-colors group"
          >
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <Laptop className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Software</span>
            </div>
            <div className="text-[11px] text-[#9AA3B8] mt-0.5">Hospital, POS &amp; Gym</div>
          </Link>

          <Link
            href="/nilesh-barela"
            className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#00E676] transition-colors group"
          >
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Founder Profile</span>
            </div>
            <div className="text-[11px] text-[#9AA3B8] mt-0.5">Nilesh Barela</div>
          </Link>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/request-quote"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 hover:opacity-95 transition-opacity shadow-glow-green"
          >
            <FileText className="w-4 h-4" />
            <span>Get Project Quote</span>
          </Link>

          <a
            href="https://wa.me/917414935405?text=Hi%20HackifyPro%2C%20I%20have%20a%20query."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#080B12] border border-[#00E676]/40 hover:border-[#00E676] text-white font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#00E676]" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
