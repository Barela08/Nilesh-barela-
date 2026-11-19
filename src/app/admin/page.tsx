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
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Globe,
  Layers,
  Sparkles,
  Check,
  Phone,
  Mail,
  Building,
  HelpCircle
} from 'lucide-react';
import { PortfolioProject } from '@/data/portfolio';

const INITIAL_PROJECT_FORM = {
  id: '',
  title: '',
  category: 'Web Application & SaaS',
  summary: '',
  client: 'HackifyPro Enterprise Client',
  market: 'India & Global',
  problemSolved: '',
  mainFeatures: '',
  techStack: 'React, Next.js, TypeScript, Tailwind CSS',
  image: '/assets/hackifypro-workspace.png',
  demoUrl: '',
  status: 'Live & Deployed Demonstration',
};

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Main navigation view
  const [mainView, setMainView] = useState<'inquiries' | 'projects'>('inquiries');

  // Leads CRM State
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
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Projects State
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState(INITIAL_PROJECT_FORM);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectActionMsg, setProjectActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('hp_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchLeads();
      fetchProjects();
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
      fetchProjects();
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
      const token = localStorage.getItem('hp_admin_token') || '';
      const res = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setLeadsData(json.data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('hp_admin_token') || '';
      const res = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setProjects(json.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleStatusChange = async (type: string, id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('hp_admin_token') || '';
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // PROJECT ACTIONS
  const handleOpenAddProject = () => {
    setIsEditingProject(false);
    setProjectForm(INITIAL_PROJECT_FORM);
    setProjectActionMsg(null);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: PortfolioProject) => {
    setIsEditingProject(true);
    setProjectForm({
      id: proj.id,
      title: proj.title,
      category: proj.category,
      summary: proj.summary,
      client: proj.client || '',
      market: proj.market || '',
      problemSolved: proj.problemSolved || '',
      mainFeatures: (proj.mainFeatures || []).join('\n'),
      techStack: (proj.techStack || []).join(', '),
      image: proj.image || '/assets/hackifypro-workspace.png',
      demoUrl: proj.demoUrl || '',
      status: proj.status || 'Live & Deployed Demonstration',
    });
    setProjectActionMsg(null);
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectSubmitting(true);
    setProjectActionMsg(null);

    const token = localStorage.getItem('hp_admin_token') || '';

    try {
      const payload = {
        id: projectForm.id,
        title: projectForm.title,
        category: projectForm.category,
        summary: projectForm.summary,
        client: projectForm.client,
        market: projectForm.market,
        problemSolved: projectForm.problemSolved,
        mainFeatures: projectForm.mainFeatures.split('\n').filter(Boolean),
        techStack: projectForm.techStack.split(',').map((s) => s.trim()).filter(Boolean),
        image: projectForm.image,
        demoUrl: projectForm.demoUrl.trim(),
        status: projectForm.status,
      };

      const endpoint = '/api/admin/projects';
      const method = isEditingProject ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      setProjectActionMsg({
        type: 'success',
        text: isEditingProject ? 'Project updated successfully with demo link!' : 'New project added successfully!'
      });

      await fetchProjects();
      setTimeout(() => {
        setProjectModalOpen(false);
        setProjectActionMsg(null);
      }, 1000);
    } catch (err: any) {
      setProjectActionMsg({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const token = localStorage.getItem('hp_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // Compile unified leads list
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
        item.id.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.projectDescription && item.projectDescription.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const filteredProjects = projects.filter((p) => {
    if (!projectSearch) return true;
    const q = projectSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.summary && p.summary.toLowerCase().includes(q)) ||
      (p.demoUrl && p.demoUrl.toLowerCase().includes(q)) ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
    );
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
            Authorized Personnel Portal, Projects & Lead CRM
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
              {mainView === 'inquiries' ? 'Inquiries & CRM Management' : 'Project Portfolio & Demos'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex bg-[#0F1624] p-1 rounded-xl border border-[#1E293B]">
              <button
                onClick={() => setMainView('inquiries')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 transition-all ${
                  mainView === 'inquiries'
                    ? 'bg-[#00E676] text-[#080B12] font-bold shadow-md'
                    : 'text-[#9AA3B8] hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All Inquiries ({leadsData.metrics.totalLeads})</span>
              </button>

              <button
                onClick={() => setMainView('projects')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 transition-all ${
                  mainView === 'projects'
                    ? 'bg-[#00E676] text-[#080B12] font-bold shadow-md'
                    : 'text-[#9AA3B8] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Projects & Demos ({projects.length})</span>
              </button>
            </div>

            <button
              onClick={() => {
                fetchLeads();
                fetchProjects();
              }}
              className="p-2.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-[#9AA3B8] hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {mainView === 'inquiries' && (
              <a
                href="/api/admin/export"
                download
                className="px-4 py-2.5 rounded-lg bg-[#141D30] border border-[#1E293B] hover:border-[#00E676] text-xs font-mono text-white flex items-center space-x-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Export CSV</span>
              </a>
            )}

            {mainView === 'projects' && (
              <button
                onClick={handleOpenAddProject}
                className="px-4 py-2.5 rounded-lg bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center space-x-2 transition-opacity shadow-lg shadow-[#00E676]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-lg bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-900/30 flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: INQUIRIES & LEADS CRM                                             */}
        {/* ========================================================================= */}
        {mainView === 'inquiries' && (
          <div className="space-y-6">
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
                    placeholder="Search by name, email, phone, message..."
                    className="bg-[#0F1624] border border-[#1E293B] rounded-lg px-3.5 py-2 pl-9 text-xs text-white placeholder-[#64748B] focus:border-[#00E676] w-64"
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
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#64748B] font-mono">
                          No inquiries found matching the selected criteria.
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
                              {lead.projectDescription || lead.message || lead.additionalRequirements || 'No additional note'}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-[11px] text-[#9AA3B8]">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 rounded-lg bg-[#141D30] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] hover:border-[#38BDF8] text-[11px] font-mono inline-flex items-center space-x-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Full</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PROJECT PORTFOLIO & DEMOS                                         */}
        {/* ========================================================================= */}
        {mainView === 'projects' && (
          <div className="space-y-6">
            
            {/* Project Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8] uppercase">Total Portfolio Projects</div>
                <div className="text-3xl font-heading font-extrabold text-white mt-2">
                  {projects.length}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#00E676] uppercase">Projects With Active Demo Link</div>
                <div className="text-3xl font-heading font-extrabold text-[#00E676] mt-2">
                  {projects.filter((p) => p.demoUrl && p.demoUrl.trim().length > 0).length}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#38BDF8] uppercase">Public Website Status</div>
                <div className="text-sm font-mono text-[#38BDF8] mt-3 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse"></span>
                  <span>Syncing Live with /portfolio</span>
                </div>
              </div>
            </div>

            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects by title, category, tech stack, demo URL..."
                  className="w-full bg-[#0F1624] border border-[#1E293B] rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-[#64748B] focus:border-[#00E676]"
                />
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
              </div>

              <button
                onClick={handleOpenAddProject}
                className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#00E676]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-[#0F1624] border border-[#1E293B] rounded-2xl">
                  <Layers className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
                  <p className="text-sm font-mono text-[#9AA3B8]">No projects found matching your search.</p>
                  <button
                    onClick={handleOpenAddProject}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#00E676] text-[#080B12] text-xs font-mono font-bold"
                  >
                    + Add First Project
                  </button>
                </div>
              ) : (
                filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/50 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      {/* Thumbnail Header */}
                      <div className="relative h-44 w-full bg-[#080B12] overflow-hidden border-b border-[#1E293B]">
                        <Image
                          src={p.image || '/assets/hackifypro-workspace.png'}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-[#080B12]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#00E676] border border-[#1E293B]">
                          {p.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-heading font-bold text-white group-hover:text-[#00E676] transition-colors line-clamp-1">
                            {p.title}
                          </h3>
                        </div>

                        {/* Demo Link Highlight */}
                        <div className="p-2.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-xs space-y-1">
                          <div className="text-[10px] font-mono text-[#9AA3B8] uppercase flex items-center justify-between">
                            <span>Demo Link:</span>
                            {p.demoUrl ? (
                              <span className="text-[#00E676] font-semibold flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Configured</span>
                              </span>
                            ) : (
                              <span className="text-amber-400 font-semibold">No Demo Link</span>
                            )}
                          </div>
                          
                          {p.demoUrl ? (
                            <a
                              href={p.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-[#38BDF8] hover:underline flex items-center space-x-1.5 break-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">{p.demoUrl}</span>
                            </a>
                          ) : (
                            <div className="text-[11px] text-[#64748B] italic">
                              Add demo link via &apos;Edit Project&apos;
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-[#9AA3B8] line-clamp-2 leading-relaxed">
                          {p.summary}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(p.techStack || []).slice(0, 4).map((tech) => (
                            <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#38BDF8] border border-[#1E293B]">
                              {tech}
                            </span>
                          ))}
                          {(p.techStack || []).length > 4 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141D30] text-[#9AA3B8]">
                              +{(p.techStack || []).length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-[#080B12] border-t border-[#1E293B] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#64748B] line-clamp-1 max-w-[120px]">
                        {p.status}
                      </span>

                      <div className="flex items-center space-x-2">
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#141D30] hover:bg-[#1E293B] text-[#00E676] border border-[#1E293B] hover:border-[#00E676]"
                            title="Open Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenEditProject(p)}
                          className="px-3 py-1.5 rounded-lg bg-[#141D30] hover:bg-[#1E293B] text-white border border-[#1E293B] hover:border-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>Edit</span>
                        </button>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-[#1E293B] text-white text-[10px] font-mono"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/30"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PROJECT                                               */}
      {/* ========================================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#0F1624] border border-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">
                  {isEditingProject ? 'Edit Project & Demo Link' : 'Add New Portfolio Project'}
                </h2>
                <p className="text-xs font-mono text-[#9AA3B8] mt-1">
                  Updates are saved immediately to the projects database and live on the portfolio page.
                </p>
              </div>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-2 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-white border border-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {projectActionMsg && (
              <div className={`p-4 rounded-xl text-xs font-mono flex items-center space-x-2 ${
                projectActionMsg.type === 'success'
                  ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/50 border border-red-500/50 text-red-300'
              }`}>
                {projectActionMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{projectActionMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              
              {/* Project Title */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. LeadSaathi PRO – Local Business Outreach Suite"
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
                />
              </div>

              {/* DEMO LINK - Highlighted field */}
              <div className="p-4 rounded-xl bg-[#080B12] border border-[#00E676]/40 space-y-1.5">
                <label className="block font-mono text-[#00E676] uppercase font-bold flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo Link / URL (Important)</span>
                  </span>
                  <span className="text-[10px] text-[#9AA3B8] lowercase font-normal">
                    (external https://... or internal /appointment?service=...)
                  </span>
                </label>
                <input
                  type="text"
                  value={projectForm.demoUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                  placeholder="e.g. https://demo.hackifypro.com or https://www.nileshbarela.site"
                  className="w-full bg-[#0F1624] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white font-mono focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676]"
                />
                <p className="text-[11px] text-[#9AA3B8]">
                  Clients on your website will be able to click directly on this link to test your live demo.
                </p>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="e.g. HealthTech, Web Apps, Business Automation"
                    className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                    Deployment Status
                  </label>
                  <input
                    type="text"
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    placeholder="e.g. Live & Deployed Demonstration"
                    className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                  />
                </div>
              </div>

              {/* Client & Market */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                    Client / Target Audience
                  </label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g. Healthcare Clinics & Nursing Homes"
                    className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                    Market / Location
                  </label>
                  <input
                    type="text"
                    value={projectForm.market}
                    onChange={(e) => setProjectForm({ ...projectForm, market: e.target.value })}
                    placeholder="e.g. Maharashtra, India"
                    className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="/assets/hackifypro-workspace.png"
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Project Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={projectForm.summary}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  placeholder="Short 2-3 line overview of what this application does..."
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                />
              </div>

              {/* Problem Solved */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Problem Solved
                </label>
                <textarea
                  rows={2}
                  value={projectForm.problemSolved}
                  onChange={(e) => setProjectForm({ ...projectForm, problemSolved: e.target.value })}
                  placeholder="What operational or business bottlenecks were resolved?"
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                />
              </div>

              {/* Main Features */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Key Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  value={projectForm.mainFeatures}
                  onChange={(e) => setProjectForm({ ...projectForm, mainFeatures: e.target.value })}
                  placeholder="Digital Patient EMR&#10;Live doctor OPD queue&#10;Integrated pharmacy & billing"
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block font-mono text-[#9AA3B8] uppercase mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={projectForm.techStack}
                  onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                  placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                  className="w-full bg-[#080B12] border border-[#1E293B] rounded-lg px-4 py-2.5 text-white focus:border-[#00E676]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#080B12] hover:bg-[#141D30] text-[#9AA3B8] hover:text-white font-mono text-xs transition-colors border border-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={projectSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#00E676]/20"
                >
                  {projectSubmitting ? 'Saving...' : isEditingProject ? 'Save Project Changes' : 'Create Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INQUIRY FULL DETAILS                                             */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#0F1624] border border-[#1E293B] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    selectedLead.type === 'appointment' ? 'bg-[#00E676]/15 text-[#00E676]' :
                    selectedLead.type === 'enquiry' ? 'bg-[#38BDF8]/15 text-[#38BDF8]' :
                    'bg-[#A78BFA]/15 text-[#A78BFA]'
                  }`}>
                    {selectedLead.displayType}
                  </span>
                  <span className="font-mono text-xs text-[#38BDF8] font-bold">
                    {selectedLead.id}
                  </span>
                </div>
                <h2 className="text-xl font-heading font-extrabold text-white mt-1">
                  Inquiry Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-white border border-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Contact Information Card */}
              <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <div className="font-mono text-[#00E676] uppercase text-[10px]">Client Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Name:</span>
                    <span className="text-white font-semibold text-sm">{selectedLead.name}</span>
                  </div>

                  {selectedLead.company && (
                    <div>
                      <span className="text-[#64748B] block text-[10px]">Company:</span>
                      <span className="text-white font-medium">{selectedLead.company}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[#64748B] block text-[10px]">Email:</span>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-[#38BDF8] hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{selectedLead.email}</span>
                    </a>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[10px]">Phone / WhatsApp:</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-white font-mono hover:text-[#00E676] flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedLead.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-emerald-950/60 text-[#00E676] border border-[#00E676]/40 text-[10px] font-mono hover:bg-[#00E676] hover:text-[#080B12] transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement & Scope */}
              <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] space-y-2">
                <div className="font-mono text-[#38BDF8] uppercase text-[10px]">Project Scope & Requirement</div>
                
                <div className="text-white font-medium text-sm">
                  {selectedLead.interestedService || selectedLead.serviceRequired || selectedLead.requiredService || 'General Inquiry'}
                </div>

                {selectedLead.preferredDate && (
                  <div className="text-[#9AA3B8] font-mono text-[11px]">
                    Preferred Time: <span className="text-[#00E676]">{selectedLead.preferredDate} ({selectedLead.preferredTime})</span>
                  </div>
                )}

                {(selectedLead.budgetRange || selectedLead.estimatedBudget) && (
                  <div className="text-[#9AA3B8] font-mono text-[11px]">
                    Budget: <span className="text-[#A78BFA]">{selectedLead.budgetRange || selectedLead.estimatedBudget}</span>
                  </div>
                )}

                {(selectedLead.timeline || selectedLead.expectedTimeline) && (
                  <div className="text-[#9AA3B8] font-mono text-[11px]">
                    Timeline: <span className="text-white">{selectedLead.timeline || selectedLead.expectedTimeline}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] mb-1">Full Message / Requirements:</span>
                  <div className="p-3 rounded-lg bg-[#0F1624] text-[#E8EDF5] leading-relaxed whitespace-pre-wrap">
                    {selectedLead.projectDescription || selectedLead.message || selectedLead.additionalRequirements || selectedLead.projectScope || 'No detailed message provided.'}
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#080B12] border border-[#1E293B]">
                <span className="text-xs font-mono text-[#9AA3B8]">Update Status:</span>
                <select
                  value={selectedLead.status}
                  disabled={updatingId === selectedLead.id}
                  onChange={(e) => handleStatusChange(selectedLead.type, selectedLead.id, e.target.value)}
                  className="bg-[#0F1624] border border-[#1E293B] rounded px-3 py-1.5 text-xs font-mono text-white focus:border-[#00E676]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="qualified">Qualified</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Meta details */}
              <div className="text-[10px] font-mono text-[#64748B] flex items-center justify-between pt-2">
                <span>Received: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}</span>
                <span>IP: {selectedLead.ipAddress || 'Recorded'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-[#141D30] text-white font-mono text-xs hover:bg-[#1E293B]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}