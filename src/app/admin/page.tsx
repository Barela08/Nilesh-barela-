'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Lock, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'enquiries' | 'quotes'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [leadsData, setLeadsData] = useState<{
    appointments: any[];
    enquiries: any[];
    quotes: any[];
    metrics: {
      totalLeads: number;
      totalAppointments: number;
      totalEnquiries: number;
      totalQuotes: number;
    };
  }>({
    appointments: [],
    enquiries: [],
    quotes: [],
    metrics: { totalLeads: 0, totalAppointments: 0, totalEnquiries: 0, totalQuotes: 0 },
  });

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('hp_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('hp_admin_token', data.token);
      setIsAuthenticated(true);
      fetchLeads();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hp_admin_token');
    setIsAuthenticated(false);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const json = await res.json();
        setLeadsData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleStatusChange = async (type: string, id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Compile unified list
  const combinedLeads = [
    ...leadsData.appointments.map((a) => ({
      ...a,
      type: 'appointment',
      displayType: 'Appointment',
      name: a.fullName,
      detail: `${a.serviceRequired} (${a.preferredDate} ${a.preferredTime})`,
    })),
    ...leadsData.enquiries.map((e) => ({
      ...e,
      type: 'enquiry',
      displayType: 'Enquiry',
      name: e.name,
      detail: `${e.interestedService} - Budget: ${e.budgetRange || 'N/A'}`,
    })),
    ...leadsData.quotes.map((q) => ({
      ...q,
      type: 'quote',
      displayType: 'Quote',
      name: q.name,
      detail: `${q.requiredService} - Scope: ${q.projectScope}`,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredLeads = combinedLeads.filter((item) => {
    if (activeTab === 'appointments' && item.type !== 'appointment') return false;
    if (activeTab === 'enquiries' && item.type !== 'enquiry') return false;
    if (activeTab === 'quotes' && item.type !== 'quote') return false;

    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-36 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#0F1624] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 relative mx-auto mb-5">
            <Image
              src="/assets/hackifypro-icon.png"
              alt="HackifyPro Emblem"
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(0,230,118,0.4)]"
            />
          </div>

          <h1 className="text-2xl font-heading font-extrabold text-white text-center mb-1">
            HackifyPro Admin Access
          </h1>
          <p className="text-xs font-mono text-[#9AA3B8] text-center mb-6">
            Authorized Personnel Portal & Lead CRM
          </p>

          {loginError && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs mb-5 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9AA3B8] uppercase mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hackifypro@gmail.com"
                className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9AA3B8] uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1E293B] text-[11px] font-mono text-[#64748B] text-center">
            Default credentials configured in .env.local
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E676]/10 text-xs font-mono text-[#00E676] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
              <span>LIVE OPERATIONS DESK</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white">
              Lead Management Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchLeads}
              className="p-2.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-[#9AA3B8] hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href="/api/admin/export"
              download
              className="px-4 py-2.5 rounded-lg bg-[#141D30] border border-[#1E293B] hover:border-[#00E676] text-xs font-mono text-white flex items-center space-x-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-lg bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-900/30 flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="text-xs font-mono text-[#9AA3B8] uppercase">Total Inquiries Received</div>
            <div className="text-3xl font-heading font-extrabold text-white mt-2">
              {leadsData.metrics.totalLeads}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="text-xs font-mono text-[#00E676] uppercase">Scheduled Appointments</div>
            <div className="text-3xl font-heading font-extrabold text-[#00E676] mt-2">
              {leadsData.metrics.totalAppointments}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="text-xs font-mono text-[#38BDF8] uppercase">Project Enquiries</div>
            <div className="text-3xl font-heading font-extrabold text-[#38BDF8] mt-2">
              {leadsData.metrics.totalEnquiries}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
            <div className="text-xs font-mono text-[#A78BFA] uppercase">Quote Requests</div>
            <div className="text-3xl font-heading font-extrabold text-[#A78BFA] mt-2">
              {leadsData.metrics.totalQuotes}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-[#0F1624] p-1.5 rounded-xl border border-[#1E293B]">
            {(['all', 'appointments', 'enquiries', 'quotes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                  activeTab === tab
                    ? 'bg-[#00E676] text-[#080B12] font-bold'
                    : 'text-[#9AA3B8] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="bg-[#0F1624] border border-[#1E293B] rounded-lg px-3.5 py-2 pl-9 text-xs text-white placeholder-[#64748B] focus:border-[#00E676]"
              />
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0F1624] border border-[#1E293B] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-[#00E676]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="qualified">Qualified</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        {/* Leads Table */}
        <div className="bg-[#0F1624] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B12] border-b border-[#1E293B] font-mono text-[#9AA3B8] uppercase">
                <tr>
                  <th className="py-3.5 px-4">Ref ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Scope / Schedule</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#64748B] font-mono">
                      No leads match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#141D30]/60 transition-colors">
                      <td className="py-4 px-4 font-mono text-[#38BDF8] font-bold">
                        {lead.id}
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          lead.type === 'appointment' ? 'bg-[#00E676]/15 text-[#00E676]' :
                          lead.type === 'enquiry' ? 'bg-[#38BDF8]/15 text-[#38BDF8]' :
                          'bg-[#A78BFA]/15 text-[#A78BFA]'
                        }`}>
                          {lead.displayType}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-[11px] text-[#9AA3B8]">{lead.email}</div>
                        <div className="text-[11px] font-mono text-[#64748B]">{lead.phone}</div>
                        {lead.company && <div className="text-[10px] text-[#64748B]">Co: {lead.company}</div>}
                      </td>
                      <td className="py-4 px-4 max-w-xs text-[#9AA3B8]">
                        <div className="font-medium text-white">{lead.detail}</div>
                        <div className="text-[11px] line-clamp-2 mt-1">
                          {lead.projectDescription || lead.message || lead.additionalRequirements}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-[#9AA3B8]">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead.type, lead.id, e.target.value)}
                          className="bg-[#080B12] border border-[#1E293B] rounded px-2.5 py-1 text-xs font-mono text-white focus:border-[#00E676]"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="qualified">Qualified</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
