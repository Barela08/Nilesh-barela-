'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { company } from '@/data/company';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function WhatsAppFloating() {
  return (
    <a
      href={company.contact.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick('floating_badge')}
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-[#00E676] hover:bg-[#00c853] text-[#080B12] font-mono text-xs font-bold px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105 group"
      aria-label="Chat with HackifyPro on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 text-[#080B12] group-hover:animate-bounce" />
      <span className="hidden sm:inline font-sans font-semibold">Chat on WhatsApp</span>
    </a>
  );
}
