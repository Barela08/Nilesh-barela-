'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { servicesData } from '@/data/services';
import { productsData } from '@/data/products';

export default function AppointmentForm({ defaultService = '' }: { defaultService?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tomorrow's date formatted as YYYY-MM-DD to prevent past dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceRequired: defaultService || 'website-development',
    preferredDate: minDate,
    preferredTime: '11:00 AM - 12:00 PM',
    projectBudget: '₹25,000 - ₹50,000',
    projectDescription: '',
    dpdpConsent: false,
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

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.projectDescription.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.dpdpConsent) {
      setError('Under the Digital Personal Data Protection Act (DPDP Act, 2023), your explicit affirmative consent is required. Please check the consent box below.');
      return;
    }

    if (new Date(formData.preferredDate) < new Date(minDate)) {
      setError('Please select a date from tomorrow onwards.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to schedule appointment. Please try again.');
      }

      // Genuine successful submission redirect to confirmation page with reference ID
      router.push(`/appointment-confirmation?id=${result.id}&name=${encodeURIComponent(formData.fullName)}`);
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
            Full Name <span className="text-[#00E676]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
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
            placeholder="e.g. rahul@company.com"
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
            placeholder="e.g. +91 9876543210"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Company / Organization Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Sharma Logistics"
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Service / Product Required <span className="text-[#00E676]">*</span>
          </label>
          <select
            name="serviceRequired"
            value={formData.serviceRequired}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <optgroup label="Development Services">
              {servicesData.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </optgroup>
            <optgroup label="Software Solutions">
              {productsData.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Project Budget Range
          </label>
          <select
            name="projectBudget"
            value={formData.projectBudget}
            onChange={handleChange}
            className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
          >
            <option value="Under ₹25,000">Under ₹25,000</option>
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
            <option value="₹2,50,000+">₹2,50,000+ (Enterprise)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Preferred Date <span className="text-[#00E676]">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="preferredDate"
              required
              min={minDate}
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            />
            <Calendar className="w-4 h-4 text-[#9AA3B8] absolute right-4 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
            Preferred Time Slot <span className="text-[#00E676]">*</span>
          </label>
          <div className="relative">
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
            >
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
            </select>
            <Clock className="w-4 h-4 text-[#9AA3B8] absolute right-4 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-medium text-[#9AA3B8] uppercase mb-1.5">
          Project Description & Goals <span className="text-[#00E676]">*</span>
        </label>
        <textarea
          name="projectDescription"
          required
          rows={4}
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Briefly describe what you want to build, key features needed, and your expected launch timeline..."
          className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-colors"
        ></textarea>
      </div>

      {/* Compact Consent */}
      <div className="flex items-center space-x-3 pt-1">
        <input
          type="checkbox"
          id="apptDpdpConsent"
          name="dpdpConsent"
          required
          checked={formData.dpdpConsent}
          onChange={handleChange}
          className="h-4 w-4 rounded border-[#1E293B] text-[#00E676] focus:ring-[#00E676] bg-[#080B12] cursor-pointer"
        />
        <label htmlFor="apptDpdpConsent" className="text-xs text-[#9AA3B8] cursor-pointer select-none">
          I agree to be contacted via WhatsApp/Email to schedule this discovery consultation under the <a href="/privacy-policy" target="_blank" className="text-[#00E676] underline">Privacy Policy</a>. <span className="text-[#00E676]">*</span>
        </label>
      </div>

      <div className="flex items-start space-x-2 text-xs text-[#9AA3B8]">
        <ShieldCheck className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
        <span>Your contact details are strictly confidential. We never share your information with third parties.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] hover:opacity-95 transition-all shadow-glow-green flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Scheduling Your Session...</span>
        ) : (
          <>
            <span>Confirm Discovery Session</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
