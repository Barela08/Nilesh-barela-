'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Globe, 
  Smartphone, 
  Laptop, 
  Cpu, 
  Zap, 
  Wrench, 
  Palette, 
  Activity, 
  Car, 
  Utensils, 
  Dumbbell, 
  Shield 
} from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setSolutionsDropdown(false);
  }, [pathname]);

  const services = [
    { name: 'Website Development', href: '/website-development', icon: Globe, desc: 'Responsive, fast, SEO-ready business sites' },
    { name: 'Android App Development', href: '/android-app-development', icon: Smartphone, desc: 'Native & hybrid mobile applications' },
    { name: 'Web Application Development', href: '/web-application-development', icon: Laptop, desc: 'SaaS platforms & cloud dashboards' },
    { name: 'Custom Software Development', href: '/custom-software-development', icon: Cpu, desc: 'Tailored enterprise management tools' },
    { name: 'Business Automation', href: '/business-automation', icon: Zap, desc: 'WhatsApp API & workflow streamlining' },
    { name: 'Software Maintenance', href: '/software-maintenance', icon: Wrench, desc: 'Security updates & continuous support' },
    { name: 'UI/UX Design', href: '/ui-ux-design', icon: Palette, desc: 'Intuitive modern interfaces & prototypes' },
  ];

  const solutions = [
    { name: 'Hospital Management (HMS)', href: '/hospital-management-software', icon: Activity, desc: 'OPD, IPD, doctor desk & clinical records' },
    { name: 'Car Rental Software', href: '/car-rental-software', icon: Car, desc: 'Fleet schedule, KYC verification & deposits' },
    { name: 'Restaurant POS System', href: '/restaurant-management-software', icon: Utensils, desc: 'QR menus, KDS, tables & GST billing' },
    { name: 'Gym Management Software', href: '/gym-management-software', icon: Dumbbell, desc: 'Member subscriptions & renewal alerts' },
    { name: 'Driving School Software', href: '/driving-school-software', icon: Shield, desc: 'Student batching & RTO progress logs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#080B12]/95 backdrop-blur-md border-b border-[#1E293B] py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/hackifypro-icon.png"
                alt="HackifyPro Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,230,118,0.35)]"
                priority
              />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-[#00E676] transition-colors">
                Hackify<span className="text-[#00E676]">Pro</span>
              </span>
              <span className="hidden sm:block text-[9px] font-mono tracking-widest text-[#9AA3B8] uppercase">
                Secure &bull; Learn &bull; Innovate
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === '/' ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              Home
            </Link>

            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === '/about' ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                  pathname.includes('-development') || pathname === '/services' || pathname === '/business-automation' || pathname === '/software-maintenance' || pathname === '/ui-ux-design'
                    ? 'text-[#00E676]' 
                    : 'text-[#E8EDF5] hover:text-[#00E676]'
                }`}
                aria-expanded={servicesDropdown}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-80 bg-[#0F1624] border border-[#1E293B] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="mb-2 pb-2 border-b border-[#1E293B] flex items-center justify-between px-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA3B8]">Core Services</span>
                    <Link href="/services" className="text-xs text-[#00E676] hover:underline flex items-center">
                      All Services <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {services.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start p-2 rounded-lg hover:bg-[#141D30] transition-colors group"
                      >
                        <item.icon className="w-4 h-4 text-[#00E676] mt-0.5 mr-2.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#00E676] transition-colors">{item.name}</div>
                          <div className="text-xs text-[#9AA3B8]">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSolutionsDropdown(true)}
              onMouseLeave={() => setSolutionsDropdown(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                  pathname.includes('-software') || pathname === '/products'
                    ? 'text-[#38BDF8]' 
                    : 'text-[#E8EDF5] hover:text-[#38BDF8]'
                }`}
                aria-expanded={solutionsDropdown}
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </button>

              {solutionsDropdown && (
                <div className="absolute top-full left-0 w-80 bg-[#0F1624] border border-[#1E293B] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="mb-2 pb-2 border-b border-[#1E293B] flex items-center justify-between px-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AA3B8]">Business Products</span>
                    <Link href="/products" className="text-xs text-[#38BDF8] hover:underline flex items-center">
                      All Products <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {solutions.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start p-2 rounded-lg hover:bg-[#141D30] transition-colors group"
                      >
                        <item.icon className="w-4 h-4 text-[#38BDF8] mt-0.5 mr-2.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#38BDF8] transition-colors">{item.name}</div>
                          <div className="text-xs text-[#9AA3B8]">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/portfolio" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === '/portfolio' ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              Portfolio
            </Link>

            <Link 
              href="/nilesh-barela" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1.5 ${
                pathname === '/nilesh-barela' ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
              </span>
              <span>Founder</span>
            </Link>

            <Link 
              href="/blog" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname.startsWith('/blog') ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              Blog
            </Link>

            <Link 
              href="/contact" 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === '/contact' ? 'text-[#00E676]' : 'text-[#E8EDF5] hover:text-[#00E676]'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/appointment"
              className="text-xs font-mono font-semibold px-3.5 py-2 rounded-lg border border-[#1E293B] text-[#9AA3B8] hover:text-white hover:border-[#38BDF8] transition-colors"
            >
              Book Consultation
            </Link>
            <Link
              href="/request-quote"
              className="text-xs font-mono font-bold tracking-wide uppercase px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] hover:opacity-90 shadow-glow-green transition-all transform hover:-translate-y-0.5"
            >
              Get a Quote
            </Link>
          </div>

          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href="/request-quote"
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-[#00E676] text-[#080B12]"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0F1624] border border-[#1E293B] text-white hover:text-[#00E676] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080B12] border-b border-[#1E293B] px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            className="block py-2 text-base font-medium text-white hover:text-[#00E676] border-b border-[#1E293B]/50"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-base font-medium text-white hover:text-[#00E676] border-b border-[#1E293B]/50"
          >
            About HackifyPro
          </Link>

          <div className="border-b border-[#1E293B]/50 pb-2">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between py-2 text-base font-medium text-white hover:text-[#00E676]"
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l border-[#1E293B]">
                <Link href="/services" className="block text-xs font-mono text-[#00E676] uppercase tracking-wider py-1">
                  View All Services &rarr;
                </Link>
                {services.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-[#9AA3B8] hover:text-white py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-[#1E293B]/50 pb-2">
            <button
              onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
              className="w-full flex items-center justify-between py-2 text-base font-medium text-white hover:text-[#38BDF8]"
            >
              <span>Solutions</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileSolutionsOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l border-[#1E293B]">
                <Link href="/products" className="block text-xs font-mono text-[#38BDF8] uppercase tracking-wider py-1">
                  View All Products &rarr;
                </Link>
                {solutions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-[#9AA3B8] hover:text-white py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/portfolio"
            className="block py-2 text-base font-medium text-white hover:text-[#00E676] border-b border-[#1E293B]/50"
          >
            Portfolio & Projects
          </Link>
          <Link
            href="/nilesh-barela"
            className="block py-2 text-base font-medium text-[#00E676] border-b border-[#1E293B]/50 flex items-center justify-between"
          >
            <span>Nilesh Barela (Founder)</span>
            <span className="text-[10px] font-mono bg-[#00E676]/20 px-2 py-0.5 rounded text-[#00E676]">PROFILE</span>
          </Link>
          <Link
            href="/blog"
            className="block py-2 text-base font-medium text-white hover:text-[#00E676] border-b border-[#1E293B]/50"
          >
            Blog & Tech Insights
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-base font-medium text-white hover:text-[#00E676] border-b border-[#1E293B]/50"
          >
            Contact & WhatsApp
          </Link>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/appointment"
              className="text-center py-2.5 rounded-lg border border-[#1E293B] text-xs font-mono text-white"
            >
              Book Appointment
            </Link>
            <Link
              href="/request-quote"
              className="text-center py-2.5 rounded-lg bg-[#00E676] text-xs font-mono font-bold text-[#080B12]"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
