'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { servicesData } from '@/data/services';
import { productsData } from '@/data/products';

export default function EnquiryForm({ defaultService = '' }: { defaultService?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interestedService: defaultService || 'website-development',
    budgetRange: '₹25,000 - ₹50,000',
    timeline: '1-2 Weeks',
    message: '',
    privacyConsent: false,
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.privacyConsent) {
      setError('Under the Digital Personal Data Protection Act (DPDP Act, 2023), your explicit affirmative consent is required. Please check the consent box below to proceed.');
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
      setError(err.message || 'An unexpected error occurred. Please contact us directly.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Your Name <span className="text-[#00E676]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Nilesh Patel"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Business Email <span className="text-[#00E676]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. nilesh@enterprise.in"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Phone / WhatsApp <span className="text-[#00E676]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 7414935405"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Company / Organization
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. TechCorp Solutions"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Interested Service / Solution <span className="text-[#00E676]">*</span>
          </label>
          <select
            name="interestedService"
            value={formData.interestedService}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <optgroup label="Services">
              {servicesData.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </optgroup>
            <optgroup label="Software Products">
              {productsData.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Estimated Budget
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <option value="Under ₹25,000">Under ₹25,000</option>
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
            <option value="₹2,50,000+">₹2,50,000+ (Custom Enterprise)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
          Expected Timeline
        </label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
        >
          <option value="Immediate (Within 1 Week)">Immediate (Within 1 Week)</option>
          <option value="1-2 Weeks">1-2 Weeks</option>
          <option value="2-4 Weeks">2-4 Weeks</option>
          <option value="1-2 Months">1-2 Months</option>
          <option value="Flexible / Planning Phase">Flexible / Planning Phase</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
          Project Details & Message <span className="text-[#00E676]">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your software requirements, challenges you are looking to solve, or questions you have..."
          className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
        ></textarea>
      </div>

      {/* DPDP Act 2023 Explicit Consent Box */}
      <div className="p-4 rounded-xl bg-[#0F1624] border border-[#1E293B] space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#00E676]">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold uppercase tracking-wider">DPDP Act, 2023 Notice &amp; Consent</span>
        </div>
        <p className="text-[11px] text-[#9AA3B8] leading-relaxed">
          We collect your name, contact information, and project specifications solely to respond to your technical enquiry, prepare service proposals, and schedule consultations. In compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, your data is processed only with your explicit consent and will never be shared with third parties for marketing. You have the right to access, rectify, erase, or withdraw your consent at any time by emailing <a href="mailto:hackifypro@gmail.com" className="text-[#00E676] hover:underline">hackifypro@gmail.com</a>.
        </p>
        <div className="pt-2 border-t border-[#1E293B]/70 flex items-start space-x-3">
          <input
            type="checkbox"
            id="privacyConsent"
            name="privacyConsent"
            required
            checked={formData.privacyConsent}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-[#1E293B] text-[#00E676] focus:ring-[#00E676] bg-[#080B12] cursor-pointer"
          />
          <label htmlFor="privacyConsent" className="text-xs text-[#E8EDF5] leading-snug cursor-pointer select-none">
            I explicitly consent under the DPDP Act, 2023 to HackifyPro collecting and processing my submitted details for this project enquiry in accordance with the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00E676] underline hover:text-[#00c853]">Privacy Policy</a>. <span className="text-[#00E676]">*</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] hover:opacity-95 transition-all shadow-glow-green flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Sending Enquiry...</span>
        ) : (
          <>
            <span>Submit Project Enquiry</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
