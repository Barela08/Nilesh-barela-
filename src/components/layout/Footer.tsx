'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Instagram, 
  Twitter, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { company } from '@/data/company';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070C] border-t border-[#1E293B] text-[#9AA3B8] pt-16 pb-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E293B]">
          
          {/* Column 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/assets/hackifypro-icon.png"
                  alt="HackifyPro Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,230,118,0.3)]"
                />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight group-hover:text-[#00E676] transition-colors">
                Hackify<span className="text-[#00E676]">Pro</span>
              </span>
            </Link>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE | LEARN | INNOVATE</span>
            </div>

            <p className="text-sm leading-relaxed text-[#9AA3B8] max-w-sm">
              Building powerful digital solutions for modern businesses. We develop high-speed websites, Android applications, web applications, and specialized business management software.
            </p>

            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#E8EDF5]">
                <MapPin className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>Primary Service Market: Nashik, Maharashtra, India</span>
              </div>
              <div className="flex items-center space-x-2 text-[#E8EDF5]">
                <Mail className="w-4 h-4 text-[#00E676] flex-shrink-0" />
                <a href={`mailto:${company.contact.email}`} className="hover:text-[#00E676] transition-colors">
                  {company.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-[#E8EDF5]">
                <Phone className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />
                <a href={`tel:${company.contact.phoneRaw}`} className="hover:text-[#A78BFA] transition-colors">
                  {company.contact.phone}
                </a>
              </div>
            </div>

            <div className="pt-3 flex items-center space-x-3">
              <a
                href={company.founder.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#0F1624] border border-[#1E293B] flex items-center justify-center text-white hover:text-[#00E676] hover:border-[#00E676] transition-all"
                aria-label="HackifyPro on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={company.founder.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#0F1624] border border-[#1E293B] flex items-center justify-center text-white hover:text-[#38BDF8] hover:border-[#38BDF8] transition-all"
                aria-label="HackifyPro on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={company.founder.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#0F1624] border border-[#1E293B] flex items-center justify-center text-white hover:text-[#A78BFA] hover:border-[#A78BFA] transition-all"
                aria-label="HackifyPro on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={company.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('footer_social')}
                className="min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#00E676]/15 border border-[#00E676]/40 text-xs font-mono font-bold text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12] transition-all flex items-center justify-center"
              >
                WhatsApp Chat &rarr;
              </a>
            </div>
          </div>

          {/* Column 2: Software Development Services */}
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-4">
              Development Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/website-development" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Website Development</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/android-app-development" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Android App Development</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/web-application-development" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Web Applications & SaaS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/custom-software-development" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Custom Software</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/business-automation" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Business Automation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/software-maintenance" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>Software Maintenance</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/ui-ux-design" className="hover:text-[#00E676] transition-colors flex items-center justify-between group">
                  <span>UI/UX Design</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Business Software Solutions */}
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-4">
              Software Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/hospital-management-software" className="hover:text-[#38BDF8] transition-colors flex items-center justify-between group">
                  <span>Hospital Management (HMS)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/car-rental-software" className="hover:text-[#38BDF8] transition-colors flex items-center justify-between group">
                  <span>Car Rental Software</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/restaurant-management-software" className="hover:text-[#38BDF8] transition-colors flex items-center justify-between group">
                  <span>Restaurant POS System</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/gym-management-software" className="hover:text-[#38BDF8] transition-colors flex items-center justify-between group">
                  <span>Gym Management Software</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/driving-school-software" className="hover:text-[#38BDF8] transition-colors flex items-center justify-between group">
                  <span>Driving School Software</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/products" className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center">
                  View All Solutions &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Founder */}
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-4">
              Company & Founder
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About HackifyPro
                </Link>
              </li>
              <li>
                <Link href="/nilesh-barela" className="text-[#00E676] hover:underline font-medium flex items-center space-x-1">
                  <span>Nilesh Barela (Founder)</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Portfolio Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog & Tech Articles
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers & Culture
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-white transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Locations
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Official Brand Badge with Instagram & WhatsApp */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="p-1 rounded-2xl bg-[#080B12] border border-[#1E293B] shadow-xl inline-block max-w-lg w-full transition-transform hover:scale-[1.02]">
            <Image
              src="/assets/hackifypro-banner.png"
              alt="HackifyPro - Instagram @hackifypro_web | WhatsApp +91 74149 35405"
              width={962}
              height={106}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#94A3B8] space-y-4 md:space-y-0 font-mono">
          <div>
            &copy; {currentYear} <Link href="/" className="text-[#CBD5E1] hover:text-white underline-offset-4 hover:underline">HackifyPro</Link>. Founded by <Link href="/nilesh-barela" className="text-[#00E676] underline underline-offset-4 hover:text-[#00c853]">Nilesh Barela</Link>. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Link href="/privacy-policy" className="py-2.5 px-2 text-[#94A3B8] hover:text-white underline-offset-4 hover:underline transition-colors inline-block">Privacy Policy</Link>
            <span className="text-[#64748B]">&bull;</span>
            <Link href="/terms-and-conditions" className="py-2.5 px-2 text-[#94A3B8] hover:text-white underline-offset-4 hover:underline transition-colors inline-block">Terms & Conditions</Link>
            <span className="text-[#64748B]">&bull;</span>
            <Link href="/refund-policy" className="py-2.5 px-2 text-[#94A3B8] hover:text-white underline-offset-4 hover:underline transition-colors inline-block">Refund Policy</Link>
            <span className="text-[#64748B]">&bull;</span>
            <Link href="/cookie-policy" className="py-2.5 px-2 text-[#94A3B8] hover:text-white underline-offset-4 hover:underline transition-colors inline-block">Cookie Policy</Link>
            <span className="text-[#64748B]">&bull;</span>
            <a href="/sitemap.xml" className="py-2.5 px-2 text-[#94A3B8] hover:text-white underline-offset-4 hover:underline transition-colors inline-block">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
