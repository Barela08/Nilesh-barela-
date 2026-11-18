'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import { allFaqs } from '@/data/faq';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  const filteredCategories = allFaqs.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#9AA3B8]">
            Find clear answers about HackifyPro services, development timelines, software solutions, and project engagement.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions (e.g. Nashik, timeline, demo)..."
              className="w-full bg-[#0F1624] border border-[#1E293B] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-3.5" />
          </div>
        </div>

        <div className="space-y-10">
          {filteredCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-3">
              <h2 className="text-lg font-heading font-bold text-[#38BDF8] border-b border-[#1E293B] pb-2">
                {cat.category}
              </h2>

              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={item.question} className="border border-[#1E293B] rounded-xl bg-[#0F1624] overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#00E676] transition-colors"
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-5 pt-0 text-xs sm:text-sm text-[#9AA3B8] leading-relaxed border-t border-[#1E293B]/60">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
          <h3 className="text-lg font-heading font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-xs text-[#9AA3B8] mb-4">We are always available to discuss your specific technical requirements.</p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#00E676] hover:underline"
          >
            <span>Reach Out on Our Contact Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
