'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { servicesData } from '@/data/services';
import { productsData } from '@/data/products';
import { trackFormStage, getAnonymousVisitorId, getAnonymousSessionId } from '@/components/shared/VisitorTracker';

export default function QuoteForm({ defaultService = '' }: { defaultService?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasStartedRef = useRef(false);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    trackFormStage('quote', 'viewed');
    const handleBeforeUnload = () => {
      if (hasStartedRef.current && !isSubmittedRef.current) {
        trackFormStage('quote', 'abandoned');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (hasStartedRef.current && !isSubmittedRef.current) {
        trackFormStage('quote', 'abandoned');
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requiredService: defaultService || 'custom-software-development',
    projectScope: 'New Project from Scratch',
    estimatedBudget: '₹50,000 - ₹1,00,000',
    expectedTimeline: '2-4 Weeks',
    additionalRequirements: '',
    dpdpConsent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStage('quote', 'started');
    }
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.additionalRequirements.trim()) {
      setError('Please fill in all required fields to help us prepare an accurate proposal.');
      return;
    }

    if (!formData.dpdpConsent) {
      setError('Under the Digital Personal Data Protection Act (DPDP Act, 2023), your explicit affirmative consent is required. Please check the consent box below.');
      return;
    }

    setLoading(true);

    try {
      const visitorId = getAnonymousVisitorId();
      const sessionId = getAnonymousSessionId();

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, visitorId, sessionId }),
      });

      const result = await res.json();

      if (!res.ok) {
        trackFormStage('quote', 'failed');
        throw new Error(result.error || 'Failed to submit quote request. Please try again.');
      }

      isSubmittedRef.current = true;
      trackFormStage('quote', 'submitted', result.id);

      router.push(`/request-received?id=${result.id}&name=${encodeURIComponent(formData.name)}`);
    } catch (err: any) {
      trackFormStage('quote', 'failed');
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
            Full Name <span className="text-[#00E676]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Amit Kulkarni"
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
            placeholder="e.g. amit@kulkarni-ind.com"
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
            Company / Business Name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Kulkarni Enterprises, Nashik"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Primary Service Required <span className="text-[#00E676]">*</span>
          </label>
          <select
            name="requiredService"
            value={formData.requiredService}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <optgroup label="Software Engineering">
              {servicesData.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </optgroup>
            <optgroup label="Business Solutions">
              {productsData.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Project Scope
          </label>
          <select
            name="projectScope"
            value={formData.projectScope}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <option value="New Project from Scratch">New Project from Scratch</option>
            <option value="Redesign / Modernization of Existing System">Redesign / Modernization of Existing System</option>
            <option value="Feature Additions to Live Product">Feature Additions to Live Product</option>
            <option value="Ongoing Maintenance & Retainer">Ongoing Maintenance & Retainer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Target Budget Tier
          </label>
          <select
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Standard Business Site)</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Web App / Mobile App MVP)</option>
            <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Full Management Suite)</option>
            <option value="₹2,50,000+">₹2,50,000+ (Custom Enterprise SaaS)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Desired Delivery Deadline
          </label>
          <select
            name="expectedTimeline"
            value={formData.expectedTimeline}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <option value="Under 2 Weeks (Fast Track)">Under 2 Weeks (Fast Track)</option>
            <option value="2-4 Weeks">2-4 Weeks</option>
            <option value="1-2 Months">1-2 Months</option>
            <option value="3+ Months">3+ Months</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
          Detailed Specifications & Requirements <span className="text-[#00E676]">*</span>
        </label>
        <textarea
          name="additionalRequirements"
          required
          rows={5}
          value={formData.additionalRequirements}
          onChange={handleChange}
          placeholder="Please describe the core functionality, user roles, integrations needed (e.g. payment gateway, WhatsApp API), and any design references..."
          className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
        ></textarea>
      </div>

      {/* Compact Consent */}
      <div className="flex items-center space-x-3 pt-1">
        <input
          type="checkbox"
          id="quoteDpdpConsent"
          name="dpdpConsent"
          required
          checked={formData.dpdpConsent}
          onChange={handleChange}
          className="h-4 w-4 rounded border-[#1E293B] text-[#00E676] focus:ring-[#00E676] bg-[#080B12] cursor-pointer"
        />
        <label htmlFor="quoteDpdpConsent" className="text-xs text-[#9AA3B8] cursor-pointer select-none">
          I agree to be contacted via WhatsApp/Email with this formal project proposal under the <a href="/privacy-policy" target="_blank" className="text-[#00E676] underline">Privacy Policy</a>. <span className="text-[#00E676]">*</span>
        </label>
      </div>

      <div className="flex items-start space-x-2 text-xs text-[#9AA3B8]">
        <ShieldCheck className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
        <span>We will review your scope and provide a formal, itemized technical proposal and milestone schedule within 24 business hours.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] hover:opacity-95 transition-all shadow-glow-green flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Generating Proposal Request...</span>
        ) : (
          <>
            <span>Request Formal Quotation</span>
            <FileText className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
