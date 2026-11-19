'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, AlertCircle, MessageCircle, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/data/services';
import { productsData } from '@/data/products';
import { trackWhatsAppClick } from '@/lib/analytics';

interface Props {
  defaultService?: string;
}

export default function EnquiryForm({ defaultService = '' }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interestedService: defaultService || 'website-development',
    message: '',
    privacyConsent: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, phone number, email, and project requirement.');
      return;
    }

    if (!formData.privacyConsent) {
      setError('Please confirm that you agree to be contacted regarding this enquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit enquiry. Please try again.');
      }

      router.push(`/enquiry-confirmation?id=${result.id}&name=${encodeURIComponent(formData.name)}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please contact us directly on WhatsApp.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
              Your Name / Business Name <span className="text-[#00E676]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Nilesh Patel"
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            />
          </div>

          {/* WhatsApp / Phone */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
              WhatsApp / Mobile Number <span className="text-[#00E676]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 7414935405"
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
              Email Address <span className="text-[#00E676]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. contact@yourbusiness.com"
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            />
          </div>

          {/* Service / Software Needed */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
              Service or Software Needed <span className="text-[#00E676]">*</span>
            </label>
            <select
              name="interestedService"
              value={formData.interestedService}
              onChange={handleChange}
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            >
              <optgroup label="Software Development Services">
                {servicesData.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </optgroup>
              <optgroup label="Management Software Solutions">
                {productsData.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Project Requirement */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Brief Project Requirement <span className="text-[#00E676]">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what you want to build (e.g. Corporate website for my clinic, Android delivery app, or Restaurant billing software)..."
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          ></textarea>
        </div>

        {/* Compact Consent */}
        <div className="flex items-center space-x-3 pt-1">
          <input
            type="checkbox"
            id="privacyConsent"
            name="privacyConsent"
            checked={formData.privacyConsent}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[#1E293B] text-[#00E676] focus:ring-[#00E676] bg-[#080B12] cursor-pointer"
          />
          <label htmlFor="privacyConsent" className="text-xs text-[#9AA3B8] cursor-pointer select-none">
            I agree to receive a project quote and consultation via WhatsApp/Email under the <a href="/privacy-policy" target="_blank" className="text-[#00E676] underline">Privacy Policy</a>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] hover:opacity-95 transition-all shadow-glow-green flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Sending Project Enquiry...</span>
          ) : (
            <>
              <span>Send Project Enquiry</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Direct WhatsApp Fast-Track */}
      <div className="pt-4 border-t border-[#1E293B] text-center">
        <p className="text-xs text-[#9AA3B8] mb-3">
          Prefer an instant chat with Nilesh Barela?
        </p>
        <a
          href="https://wa.me/917414935405?text=Hi%20Nilesh%2C%20I%20have%20a%20project%20enquiry%20for%20HackifyPro."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('enquiry_form_instant')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono font-bold text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat Directly on WhatsApp (+91 7414935405)</span>
        </a>
      </div>
    </div>
  );
}
