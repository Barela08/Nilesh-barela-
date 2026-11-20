'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Link2,
  User,
  Settings,
  Activity,
  BarChart3,
  ChevronUp,
  ChevronDown,
  CalendarDays,
  Send,
  Shield,
  ArrowUpRight,
  Sliders,
  Copy,
  CheckCheck,
  Film,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Smartphone,
  Laptop,
  Monitor,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { PortfolioProject, ProjectGalleryImage, ProjectVideo } from '@/data/portfolio';

// Initial Project Form State
const INITIAL_PROJECT_FORM: Partial<PortfolioProject> & {
  galleryItems: ProjectGalleryImage[];
  videoItems: ProjectVideo[];
  mainFeaturesText: string;
  techStackText: string;
} = {
  id: '',
  title: '',
  category: 'Web Application & SaaS',
  summary: '',
  client: 'HackifyPro Enterprise Client',
  market: 'India & Global',
  problemSolved: '',
  mainFeaturesText: 'Production quality architecture\nFully responsive and high-speed UI\nScalable database structure',
  techStackText: 'React, Next.js, TypeScript, Tailwind CSS',
  image: '/assets/hackifypro-workspace.png',
  demoUrl: '',
  status: 'Live & Deployed Demonstration',
  projectType: 'Web Application',
  targetAudience: 'Modern Businesses & SMEs',
  visibility: 'published',
  featured: true,
  completionDate: new Date().toISOString().split('T')[0],
  location: 'Maharashtra, India',
  shortDescription: '',
  fullDescription: '',
  githubUrl: '',
  seoTitle: '',
  seoDescription: '',
  galleryItems: [],
  videoItems: []
};

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Main Navigation Tab
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'projects' | 'media' | 'analytics' | 'leads' | 'content' | 'system'
  >('dashboard');

  // Leads CRM Subtab
  const [leadTab, setLeadTab] = useState<'appointments' | 'enquiries' | 'quotes'>('appointments');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('list');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');
  const [leadMeetingLinkInput, setLeadMeetingLinkInput] = useState('');
  const [leadPriorityInput, setLeadPriorityInput] = useState<'low' | 'medium' | 'high'>('medium');
  const [leadFollowUpInput, setLeadFollowUpInput] = useState('');
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Leads Data
  const [leadsData, setLeadsData] = useState<{
    appointments: any[];
    enquiries: any[];
    quotes: any[];
    metrics: {
      totalLeads: number;
      totalAppointments: number;
      totalEnquiries: number;
      totalQuotes: number;
      newAppointments: number;
      newEnquiries: number;
      newQuotes: number;
    };
  }>({
    appointments: [],
    enquiries: [],
    quotes: [],
    metrics: { totalLeads: 0, totalAppointments: 0, totalEnquiries: 0, totalQuotes: 0, newAppointments: 0, newEnquiries: 0, newQuotes: 0 },
  });

  // Projects State
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState(INITIAL_PROJECT_FORM);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectActionMsg, setProjectActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<PortfolioProject | null>(null);

  // Media Manager State
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [mediaInUseWarning, setMediaInUseWarning] = useState<{ media: any; references: string[] } | null>(null);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Visitor Analytics State
  const [analyticsRange, setAnalyticsRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('7d');
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Website Content & Links State
  const [contentSubTab, setContentSubTab] = useState<'links' | 'founder' | 'services' | 'hero' | 'sections'>('links');
  const [siteContent, setSiteContent] = useState<any>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaveMsg, setContentSaveMsg] = useState<string | null>(null);

  // System & Audit Activity Logs State
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [emailTestAddress, setEmailTestAddress] = useState('barelanilesh483@gmail.com');
  const [emailTesting, setEmailTesting] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  // Helper: Get token
  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('hp_admin_token') || '' : '');

  // Session check on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchAllAdminData();
    }
  }, []);

  // Fetch all admin data
  const fetchAllAdminData = () => {
    fetchLeads();
    fetchProjects();
    fetchMedia();
    fetchAnalytics(analyticsRange);
    fetchSiteContent();
    fetchActivityLogs();
  };

  // Re-fetch analytics when range changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics(analyticsRange);
    }
  }, [analyticsRange, isAuthenticated]);

  // Periodic live refresh every 30s
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchLeads();
      fetchAnalytics(analyticsRange);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, analyticsRange]);

  // Login Handler
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
      fetchAllAdminData();
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

  // 1. Leads API
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${getToken()}` },
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

  const handleUpdateLead = async (type: string, id: string, updates: any) => {
    setUpdatingLeadId(id);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ type, id, ...updates }),
      });
      if (res.ok) {
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev: any) => ({ ...prev, ...updates }));
        }
      }
    } catch (err) {
      console.error('Failed to update lead', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleDeleteLead = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to permanently delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/admin/leads?type=${type}&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  };

  // 2. Projects API
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setProjects(json.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleOpenAddProject = () => {
    setIsEditingProject(false);
    setProjectForm({
      ...INITIAL_PROJECT_FORM,
      galleryItems: [],
      videoItems: []
    });
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
      client: proj.client,
      market: proj.market,
      problemSolved: proj.problemSolved,
      mainFeaturesText: (proj.mainFeatures || []).join('\n'),
      techStackText: (proj.techStack || []).join(', '),
      image: proj.image,
      demoUrl: proj.demoUrl || '',
      status: proj.status,
      projectType: proj.projectType || 'Web Application',
      targetAudience: proj.targetAudience || 'Modern Businesses',
      visibility: proj.visibility || 'published',
      featured: proj.featured ?? true,
      completionDate: proj.completionDate || '',
      location: proj.location || 'Maharashtra, India',
      shortDescription: proj.shortDescription || '',
      fullDescription: proj.fullDescription || '',
      githubUrl: proj.githubUrl || '',
      seoTitle: proj.seoTitle || '',
      seoDescription: proj.seoDescription || '',
      galleryItems: proj.gallery || [],
      videoItems: proj.videos || []
    });
    setProjectActionMsg(null);
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectSubmitting(true);
    setProjectActionMsg(null);

    const payload = {
      id: projectForm.id,
      title: projectForm.title,
      category: projectForm.category,
      summary: projectForm.summary,
      client: projectForm.client,
      market: projectForm.market,
      problemSolved: projectForm.problemSolved,
      mainFeatures: projectForm.mainFeaturesText.split('\n').filter(Boolean),
      techStack: projectForm.techStackText.split(',').map((s) => s.trim()).filter(Boolean),
      image: projectForm.image,
      demoUrl: projectForm.demoUrl,
      status: projectForm.status,
      projectType: projectForm.projectType,
      targetAudience: projectForm.targetAudience,
      visibility: projectForm.visibility,
      featured: projectForm.featured,
      completionDate: projectForm.completionDate,
      location: projectForm.location,
      shortDescription: projectForm.shortDescription,
      fullDescription: projectForm.fullDescription,
      githubUrl: projectForm.githubUrl,
      seoTitle: projectForm.seoTitle,
      seoDescription: projectForm.seoDescription,
      gallery: projectForm.galleryItems,
      videos: projectForm.videoItems
    };

    try {
      const url = '/api/admin/projects';
      const method = isEditingProject ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      setProjectActionMsg({
        type: 'success',
        text: isEditingProject ? 'Project updated successfully!' : 'Project created successfully!',
      });
      fetchProjects();
      setTimeout(() => {
        setProjectModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setProjectActionMsg({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        fetchProjects();
        setDeleteConfirmProject(null);
      }
    } catch (err) {
      console.error('Delete project failed', err);
    }
  };

  const handleToggleProjectVisibility = async (id: string, currentVis: string) => {
    const nextVis = currentVis === 'published' ? 'draft' : 'published';
    try {
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ id, visibility: nextVis }),
      });
      fetchProjects();
    } catch (err) {
      console.error('Toggle visibility failed', err);
    }
  };

  const handleReorderProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIdx];
    newProjects[targetIdx] = temp;

    setProjects(newProjects);

    try {
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          action: 'reorder',
          orderedIds: newProjects.map((p) => p.id),
        }),
      });
    } catch (err) {
      console.error('Reorder failed', err);
      fetchProjects();
    }
  };

  // 3. Media API
  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setMediaList(json.media || []);
      }
    } catch (err) {
      console.error('Failed to fetch media', err);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingMedia(true);
    setUploadProgress(`Uploading ${files.length} file(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`Upload error for ${file.name}: ${data.error}`);
        }
      } catch (err) {
        console.error('Upload failed', err);
      }
    }

    setIsUploadingMedia(false);
    setUploadProgress(null);
    fetchMedia();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteMedia = async (mediaItem: any, force = false) => {
    try {
      const res = await fetch(`/api/admin/media?id=${mediaItem.id}&force=${force}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.status === 409 && data.inUse) {
        setMediaInUseWarning({ media: mediaItem, references: data.references });
      } else if (res.ok) {
        setMediaInUseWarning(null);
        fetchMedia();
        if (selectedMediaPreview?.id === mediaItem.id) {
          setSelectedMediaPreview(null);
        }
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete media failed', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // 4. Visitor Analytics API
  const fetchAnalytics = async (range: string) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setAnalyticsStats(json.stats);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // 5. Site Content & Links API
  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSiteContent(json.content);
      }
    } catch (err) {
      console.error('Failed to fetch site content', err);
    }
  };

  const handleSaveSiteContent = async () => {
    if (!siteContent) return;
    setContentSaving(true);
    setContentSaveMsg(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (res.ok) {
        setContentSaveMsg('Website settings saved & updated live!');
        setTimeout(() => setContentSaveMsg(null), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Save site content failed', err);
    } finally {
      setContentSaving(false);
    }
  };

  // 6. System Audit Logs API
  const fetchActivityLogs = async () => {
    try {
      const res = await fetch('/api/admin/activity?limit=50', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setActivityLogs(json.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
    }
  };

  const handleTestEmail = async () => {
    setEmailTesting(true);
    setEmailTestResult(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ to: emailTestAddress }),
      });
      const data = await res.json();
      setEmailTestResult({
        success: data.success,
        message: data.message || data.error,
      });
    } catch (err: any) {
      setEmailTestResult({ success: false, message: err.message || 'Email dispatch failed' });
    } finally {
      setEmailTesting(false);
    }
  };

  // Filtered Leads
  const filteredAppointments = useMemo(() => {
    return leadsData.appointments.filter((a) => {
      const matchesSearch =
        a.fullName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        a.phone.includes(leadsSearch) ||
        a.serviceRequired.toLowerCase().includes(leadsSearch.toLowerCase());
      const matchesStatus = leadsStatusFilter === 'all' || a.status === leadsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leadsData.appointments, leadsSearch, leadsStatusFilter]);

  const filteredEnquiries = useMemo(() => {
    return leadsData.enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        e.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        e.phone.includes(leadsSearch) ||
        e.interestedService.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        e.message.toLowerCase().includes(leadsSearch.toLowerCase());
      const matchesStatus = leadsStatusFilter === 'all' || e.status === leadsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leadsData.enquiries, leadsSearch, leadsStatusFilter]);

  const filteredQuotes = useMemo(() => {
    return leadsData.quotes.filter((q) => {
      const matchesSearch =
        q.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        q.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        q.phone.includes(leadsSearch) ||
        q.requiredService.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        q.projectScope.toLowerCase().includes(leadsSearch.toLowerCase());
      const matchesStatus = leadsStatusFilter === 'all' || q.status === leadsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leadsData.quotes, leadsSearch, leadsStatusFilter]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      const matchesType = mediaTypeFilter === 'all' || m.mediaType === mediaTypeFilter;
      const matchesSearch =
        !mediaSearch ||
        m.filename.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        (m.title && m.title.toLowerCase().includes(mediaSearch.toLowerCase())) ||
        (m.altText && m.altText.toLowerCase().includes(mediaSearch.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [mediaList, mediaTypeFilter, mediaSearch]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !projectSearch ||
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));
      const matchesCategory =
        projectCategoryFilter === 'all' || p.category.toLowerCase().includes(projectCategoryFilter.toLowerCase());
      const matchesStatus =
        projectStatusFilter === 'all' ||
        (projectStatusFilter === 'published' && (!p.visibility || p.visibility === 'published')) ||
        (projectStatusFilter === 'draft' && p.visibility === 'draft') ||
        (projectStatusFilter === 'archived' && p.visibility === 'archived');
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, projectSearch, projectCategoryFilter, projectStatusFilter]);

  // Appointments grouped by Date for Calendar View
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    filteredAppointments.forEach((a) => {
      const dateKey = a.preferredDate || 'Unspecified Date';
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(a);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredAppointments]);

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080B12] text-[#E8EDF5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F1624] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden tech-grid-bg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#080B12] border border-[#1E293B] shadow-inner mb-4">
              <Image
                src="/assets/hackifypro-shield.png"
                alt="HackifyPro Admin"
                width={36}
                height={44}
                className="w-8 h-auto filter drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]"
                priority
              />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
              HackifyPro Control Center
            </h1>
            <p className="text-xs font-mono text-[#9AA3B8] mt-1.5 uppercase tracking-wider">
              Zero-Trust Encrypted Admin Portal
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9AA3B8] mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hackifypro@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#00E676] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9AA3B8] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#00E676] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] font-mono text-[#64748B]">
            Protected with SHA-256 HMAC &bull; Rate-Limited
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN PANEL LAYOUT
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#080B12] text-[#E8EDF5] flex flex-col pt-20">
      
      {/* TOP BAR / NAVIGATION HEADER */}
      <header className="sticky top-0 z-30 bg-[#0F1624]/95 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Live Visitors Pill */}
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" className="flex items-center space-x-2.5 group">
              <Image
                src="/assets/hackifypro-shield.png"
                alt="HackifyPro"
                width={28}
                height={34}
                className="w-7 h-auto filter drop-shadow-[0_0_6px_rgba(0,230,118,0.4)]"
              />
              <span className="font-heading font-extrabold text-lg text-white">
                Hackify<span className="text-[#00E676]">Pro</span>
                <span className="text-xs font-mono text-[#9AA3B8] font-normal ml-2 px-2 py-0.5 rounded bg-[#141D30] border border-[#1E293B]">
                  Admin
                </span>
              </span>
            </Link>

            {/* Live Visitors Pill */}
            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-xs font-mono text-[#00E676]">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
              <span>{analyticsStats?.liveVisitorsCount || 1} Live Visitor(s)</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenAddProject}
              className="px-3 py-1.5 rounded-lg bg-[#00E676] text-[#080B12] text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Add Project</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('media');
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-white hover:text-[#00E676] hover:border-[#00E676] text-xs font-mono flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden md:inline">Upload Media</span>
            </button>

            <button
              onClick={fetchAllAdminData}
              title="Refresh All Data"
              className="p-2 rounded-lg bg-[#0F1624] border border-[#1E293B] text-[#9AA3B8] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg bg-[#0F1624] border border-[#1E293B] text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E293B]/60">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'projects', label: 'Projects & Demos', icon: Layers, badge: projects.length },
              { id: 'media', label: 'Media Manager', icon: ImageIcon, badge: mediaList.length },
              { id: 'analytics', label: 'Visitor Analytics', icon: Activity },
              { id: 'leads', label: 'Inquiries & CRM', icon: MessageSquare, badge: leadsData.metrics.totalLeads },
              { id: 'content', label: 'Content & Links', icon: Globe },
              { id: 'system', label: 'Audit & Security', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center space-x-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#00E676]/15 text-[#00E676] font-bold border border-[#00E676]/30'
                      : 'text-[#9AA3B8] hover:text-white hover:bg-[#141D30]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#00E676] text-[#080B12]' : 'bg-[#1E293B] text-[#9AA3B8]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* HIDDEN GLOBAL FILE INPUT FOR QUICK UPLOAD */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Real Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Projects Stat */}
              <div 
                onClick={() => setCurrentTab('projects')}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Total Projects</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#00E676]">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {projects.length}
                </div>
                <div className="text-xs font-mono text-[#00E676] mt-1 flex items-center space-x-2">
                  <span>{projects.filter((p) => !p.visibility || p.visibility === 'published').length} Published</span>
                  <span className="text-[#64748B]">&bull;</span>
                  <span className="text-[#9AA3B8]">{projects.filter((p) => p.visibility === 'draft').length} Draft</span>
                </div>
              </div>

              {/* Inquiries & Leads Stat */}
              <div 
                onClick={() => { setCurrentTab('leads'); setLeadTab('enquiries'); }}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Total Inquiries</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#38BDF8]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {leadsData.metrics.totalEnquiries}
                </div>
                <div className="text-xs font-mono text-[#38BDF8] mt-1">
                  {leadsData.metrics.newEnquiries} New / Unhandled
                </div>
              </div>

              {/* Appointments Stat */}
              <div 
                onClick={() => { setCurrentTab('leads'); setLeadTab('appointments'); }}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#A78BFA]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Appointments</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#A78BFA]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {leadsData.metrics.totalAppointments}
                </div>
                <div className="text-xs font-mono text-[#A78BFA] mt-1">
                  {leadsData.appointments.filter((a) => a.status === 'scheduled' || a.status === 'new').length} Upcoming / Pending
                </div>
              </div>

              {/* Real Visitors Stat */}
              <div 
                onClick={() => setCurrentTab('analytics')}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Today's Visitors</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#00E676]">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2 flex items-center space-x-2">
                  <span>{analyticsStats?.todayVisitors || 0}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00E676]/10 text-[#00E676] font-normal">
                    {analyticsStats?.liveVisitorsCount || 1} live
                  </span>
                </div>
                <div className="text-xs font-mono text-[#9AA3B8] mt-1">
                  {analyticsStats?.totalPageViews || 0} Total Pageviews
                </div>
              </div>

            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Quick Action Center
                </h3>
                <p className="text-xs text-[#9AA3B8] mt-0.5">
                  Direct shortcuts to perform common management actions
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleOpenAddProject}
                  className="px-3.5 py-2 rounded-xl bg-[#00E676] text-[#080B12] text-xs font-mono font-bold flex items-center space-x-1.5 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('media');
                    fileInputRef.current?.click();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#38BDF8] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Upload Media</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('leads'); setLeadTab('enquiries'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#00E676] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>View Inquiries</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('leads'); setLeadTab('appointments'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#A78BFA] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>View Appointments</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('leads'); setLeadTab('quotes'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#38BDF8] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>View Quotes</span>
                </button>
              </div>
            </div>

            {/* Split Row: Recent Inquiries & Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Inquiries Card */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Recent Inquiries
                    </h3>
                  </div>
                  <button
                    onClick={() => { setCurrentTab('leads'); setLeadTab('enquiries'); }}
                    className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {leadsData.enquiries.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-[#64748B]">
                    No inquiries recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {leadsData.enquiries.slice(0, 4).map((enq) => (
                      <div 
                        key={enq.id}
                        onClick={() => { setSelectedLead(enq); setCurrentTab('leads'); setLeadTab('enquiries'); }}
                        className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#38BDF8]/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-bold text-white flex items-center space-x-2">
                            <span>{enq.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#38BDF8]">
                              {enq.interestedService}
                            </span>
                          </div>
                          <div className="text-xs text-[#9AA3B8] truncate max-w-xs mt-0.5">
                            {enq.message}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            enq.status === 'new' ? 'bg-[#00E676]/15 text-[#00E676]' : 'bg-[#1E293B] text-[#9AA3B8]'
                          }`}>
                            {enq.status.toUpperCase()}
                          </span>
                          <div className="text-[10px] font-mono text-[#64748B] mt-1">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Appointments Card */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#A78BFA]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Upcoming Appointments
                    </h3>
                  </div>
                  <button
                    onClick={() => { setCurrentTab('leads'); setLeadTab('appointments'); }}
                    className="text-xs font-mono text-[#A78BFA] hover:underline flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {leadsData.appointments.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-[#64748B]">
                    No appointments scheduled yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {leadsData.appointments.slice(0, 4).map((apt) => (
                      <div 
                        key={apt.id}
                        onClick={() => { setSelectedLead(apt); setCurrentTab('leads'); setLeadTab('appointments'); }}
                        className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#A78BFA]/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-bold text-white flex items-center space-x-2">
                            <span>{apt.fullName}</span>
                            <span className="text-[10px] font-mono text-[#00E676]">
                              {apt.preferredTime}
                            </span>
                          </div>
                          <div className="text-xs text-[#9AA3B8] mt-0.5">
                            Date: <strong className="text-white">{apt.preferredDate}</strong> &bull; {apt.serviceRequired}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            apt.status === 'scheduled' ? 'bg-[#00E676]/15 text-[#00E676]' : 'bg-[#1E293B] text-[#9AA3B8]'
                          }`}>
                            {apt.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Split Row: Recently Updated Projects & Recent Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recently Updated Projects */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-[#00E676]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Portfolio Showcase Projects
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('projects')}
                    className="text-xs font-mono text-[#00E676] hover:underline flex items-center space-x-1"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {projects.slice(0, 3).map((proj) => (
                    <div 
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0F1624] flex-shrink-0">
                          <Image src={proj.image} alt={proj.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{proj.title}</div>
                          <div className="text-xs font-mono text-[#9AA3B8]">{proj.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditProject(proj)}
                          className="p-2 rounded-lg bg-[#141D30] text-white hover:text-[#00E676] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewProject(proj)}
                          className="p-2 rounded-lg bg-[#141D30] text-white hover:text-[#38BDF8] transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Admin Activity Feed */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#38BDF8]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Recent Admin Activity
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('system')}
                    className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center space-x-1"
                  >
                    <span>View Audit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {activityLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-[#64748B]">
                    No activity recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activityLogs.slice(0, 4).map((act) => (
                      <div key={act.id} className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[#00E676] font-bold">{act.action}</span>
                          <span className="font-mono text-[10px] text-[#64748B]">
                            {new Date(act.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[#9AA3B8] mt-1 text-[11px]">{act.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROJECTS & DEMOS MANAGEMENT */}
        {/* ========================================================= */}
        {currentTab === 'projects' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">
                  Portfolio Projects &amp; Live Demos
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Manage software case studies, cover images, galleries, videos, and demo URLs
                </p>
              </div>

              <button
                onClick={handleOpenAddProject}
                className="px-4 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects by title, category, or stack..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5">
                {['all', 'published', 'draft'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setProjectStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                      projectStatusFilter === s
                        ? 'bg-[#00E676] text-[#080B12] font-bold'
                        : 'bg-[#080B12] text-[#9AA3B8] border border-[#1E293B]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Table / Cards */}
            <div className="space-y-4">
              {filteredProjects.map((proj, idx) => (
                <div 
                  key={proj.id}
                  className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start space-x-4">
                    {/* Reorder Arrows */}
                    <div className="flex flex-col space-y-1 pt-1">
                      <button
                        onClick={() => handleReorderProject(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded bg-[#080B12] border border-[#1E293B] text-[#9AA3B8] hover:text-[#00E676] disabled:opacity-30"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorderProject(idx, 'down')}
                        disabled={idx === projects.length - 1}
                        title="Move Down"
                        className="p-1 rounded bg-[#080B12] border border-[#1E293B] text-[#9AA3B8] hover:text-[#00E676] disabled:opacity-30"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cover Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#080B12] border border-[#1E293B] flex-shrink-0">
                      <Image src={proj.image} alt={proj.title} fill className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#080B12] text-[#00E676] border border-[#1E293B]">
                          {proj.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          proj.visibility === 'draft' ? 'bg-amber-500/15 text-amber-400' : 'bg-[#00E676]/15 text-[#00E676]'
                        }`}>
                          {(proj.visibility || 'published').toUpperCase()}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A78BFA]/15 text-[#A78BFA]">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-heading font-extrabold text-white">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-[#9AA3B8] line-clamp-1 max-w-xl">
                        {proj.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#64748B]">
                        <span>Gallery: {proj.gallery?.length || 0} image(s)</span>
                        <span>&bull;</span>
                        <span>Videos: {proj.videos?.length || 0}</span>
                        <span>&bull;</span>
                        <span>Views: {proj.viewsCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => handleToggleProjectVisibility(proj.id, proj.visibility || 'published')}
                      className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-xs font-mono text-white hover:text-[#00E676] transition-colors"
                    >
                      {proj.visibility === 'draft' ? 'Publish' : 'Unpublish (Draft)'}
                    </button>

                    <button
                      onClick={() => setPreviewProject(proj)}
                      className="p-2 rounded-lg bg-[#080B12] border border-[#1E293B] text-white hover:text-[#38BDF8] transition-colors"
                      title="Preview Card"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditProject(proj)}
                      className="p-2 rounded-lg bg-[#080B12] border border-[#1E293B] text-white hover:text-[#00E676] transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmProject(proj)}
                      className="p-2 rounded-lg bg-[#080B12] border border-[#1E293B] text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MEDIA MANAGER */}
        {/* ========================================================= */}
        {currentTab === 'media' && (
          <div className="space-y-6">
            
            {/* Header & Upload Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">
                  Website Media Manager
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Upload, inspect, replace, and verify images &amp; videos used across the entire website
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingMedia}
                  className="px-4 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingMedia ? 'Uploading...' : 'Upload Media'}</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-2xl bg-[#0F1624] border-2 border-dashed border-[#1E293B] hover:border-[#00E676]/60 transition-all text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#080B12] border border-[#1E293B] mx-auto flex items-center justify-center text-[#00E676] mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Drag &amp; Drop Images or Videos Here
              </h3>
              <p className="text-xs font-mono text-[#9AA3B8] mt-1">
                Supports PNG, JPG, WebP, SVG, MP4, WebM up to 50MB
              </p>
              {uploadProgress && (
                <div className="mt-3 text-xs font-mono text-[#00E676] animate-pulse">
                  {uploadProgress}
                </div>
              )}
            </div>

            {/* Search and Media Type Filters */}
            <div className="p-4 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search media by filename, title, or alt text..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                {['all', 'image', 'video', 'document'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setMediaTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                      mediaTypeFilter === t
                        ? 'bg-[#00E676] text-[#080B12] font-bold'
                        : 'bg-[#080B12] text-[#9AA3B8] border border-[#1E293B]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((m) => (
                <div 
                  key={m.id}
                  className="p-3 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/50 transition-all flex flex-col justify-between group space-y-2"
                >
                  {/* Thumbnail / Video icon */}
                  <div 
                    onClick={() => setSelectedMediaPreview(m)}
                    className="relative h-28 w-full rounded-xl overflow-hidden bg-[#080B12] border border-[#1E293B] flex items-center justify-center cursor-pointer"
                  >
                    {m.mediaType === 'video' ? (
                      <div className="text-center p-2">
                        <Film className="w-8 h-8 text-[#A78BFA] mx-auto mb-1" />
                        <span className="text-[9px] font-mono text-[#9AA3B8] block">VIDEO</span>
                      </div>
                    ) : m.mediaType === 'document' ? (
                      <div className="text-center p-2">
                        <FileText className="w-8 h-8 text-[#38BDF8] mx-auto mb-1" />
                        <span className="text-[9px] font-mono text-[#9AA3B8] block">PDF</span>
                      </div>
                    ) : (
                      <Image src={m.url} alt={m.altText || m.filename} fill className="object-cover group-hover:scale-105 transition-transform" />
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="text-xs font-bold text-white truncate" title={m.filename}>
                      {m.title || m.filename}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] flex items-center justify-between mt-0.5">
                      <span>{(m.fileSize / 1024).toFixed(0)} KB</span>
                      <span className="uppercase">{m.mediaType}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                    <button
                      onClick={() => copyToClipboard(m.url)}
                      title="Copy Public URL"
                      className="p-1.5 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-[#00E676] transition-colors"
                    >
                      {copiedUrl === m.url ? <CheckCheck className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setSelectedMediaPreview(m)}
                      title="View Details"
                      className="p-1.5 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-[#38BDF8] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(m, false)}
                      title="Delete Media"
                      className="p-1.5 rounded-lg bg-[#080B12] text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VISITOR ANALYTICS DASHBOARD */}
        {/* ========================================================= */}
        {currentTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Header & Date Range Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white flex items-center space-x-2">
                  <span>Privacy-Conscious Visitor Analytics</span>
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Anonymous, real-time traffic statistics collected without personal cookie tracking
                </p>
              </div>

              {/* Range Filter Buttons */}
              <div className="flex items-center space-x-1.5 bg-[#0F1624] p-1.5 rounded-xl border border-[#1E293B]">
                {[
                  { id: 'today', label: 'Today' },
                  { id: '7d', label: 'Last 7 Days' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: '90d', label: 'Last 90 Days' },
                  { id: 'all', label: 'All Time' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAnalyticsRange(r.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      analyticsRange === r.id
                        ? 'bg-[#00E676] text-[#080B12] font-bold'
                        : 'text-[#9AA3B8] hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8]">Unique Visitors ({analyticsRange.toUpperCase()})</div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1.5">
                  {analyticsStats?.periodVisitors || 0}
                </div>
                <div className="text-[11px] font-mono text-[#00E676] mt-1">
                  {analyticsStats?.newVisitors || 0} New &bull; {analyticsStats?.returningVisitors || 0} Returning
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8]">Total Pageviews</div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1.5">
                  {analyticsStats?.totalPageViews || 0}
                </div>
                <div className="text-[11px] font-mono text-[#38BDF8] mt-1">
                  Avg {(analyticsStats?.periodVisitors ? (analyticsStats.totalPageViews / analyticsStats.periodVisitors).toFixed(1) : '1.0')} pages/session
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8]">Live Active Visitors</div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#00E676] mt-1.5 flex items-center space-x-2">
                  <span>{analyticsStats?.liveVisitorsCount || 1}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping"></span>
                </div>
                <div className="text-[11px] font-mono text-[#64748B] mt-1">
                  Heartbeat in last 3 minutes
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B]">
                <div className="text-xs font-mono text-[#9AA3B8]">Device Breakdown</div>
                <div className="text-xs font-mono text-white mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Desktop:</span>
                    <strong className="text-[#00E676]">{analyticsStats?.devices?.desktop || 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <strong className="text-[#38BDF8]">{analyticsStats?.devices?.mobile || 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tablet:</span>
                    <strong className="text-[#A78BFA]">{analyticsStats?.devices?.tablet || 0}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visitors Real-Time Table */}
            {analyticsStats?.liveVisitors && analyticsStats.liveVisitors.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#00E676]/30 space-y-4">
                <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                  <span>Currently Active Visitors On Site</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#1E293B] text-[#9AA3B8]">
                        <th className="pb-2">Session ID</th>
                        <th className="pb-2">Current Page</th>
                        <th className="pb-2">Entry Page</th>
                        <th className="pb-2">Device</th>
                        <th className="pb-2">Pageviews</th>
                        <th className="pb-2">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/60">
                      {analyticsStats.liveVisitors.map((s: any) => (
                        <tr key={s.sessionId} className="hover:bg-[#141D30]">
                          <td className="py-2.5 text-white">{s.sessionId.substring(0, 16)}...</td>
                          <td className="py-2.5 text-[#00E676] font-bold">{s.currentPath}</td>
                          <td className="py-2.5 text-[#9AA3B8]">{s.entryPath}</td>
                          <td className="py-2.5 text-[#38BDF8] capitalize">{s.device}</td>
                          <td className="py-2.5 text-white">{s.totalPageviews}</td>
                          <td className="py-2.5 text-[#64748B]">{new Date(s.lastHeartbeat).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Split Breakdown: Top Visited Pages & Top Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Top Pages */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Most Visited Pages
                </h3>
                <div className="space-y-2">
                  {analyticsStats?.topPages?.length > 0 ? (
                    analyticsStats.topPages.map((tp: any) => (
                      <div key={tp.path} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B12] text-xs font-mono">
                        <span className="text-white truncate max-w-xs">{tp.path}</span>
                        <span className="text-[#00E676] font-bold px-2 py-0.5 rounded bg-[#00E676]/10">
                          {tp.count} views
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs font-mono text-[#64748B] py-4 text-center">
                      No pageview records yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Traffic Sources / Referrers */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Traffic Sources &amp; Referrers
                </h3>
                <div className="space-y-2">
                  {analyticsStats?.topReferrers?.length > 0 ? (
                    analyticsStats.topReferrers.map((tr: any) => (
                      <div key={tr.source} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B12] text-xs font-mono">
                        <span className="text-white truncate max-w-xs">{tr.source}</span>
                        <span className="text-[#38BDF8] font-bold px-2 py-0.5 rounded bg-[#38BDF8]/10">
                          {tr.count} visits
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs font-mono text-[#64748B] py-4 text-center">
                      No referrer records yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: LEADS & CRM MANAGEMENT */}
        {/* ========================================================= */}
        {currentTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Lead Type Sub-Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div className="flex space-x-2">
                {[
                  { id: 'appointments', label: 'Appointments', count: leadsData.metrics.totalAppointments, color: '#A78BFA' },
                  { id: 'enquiries', label: 'General Inquiries', count: leadsData.metrics.totalEnquiries, color: '#38BDF8' },
                  { id: 'quotes', label: 'Quote Requests', count: leadsData.metrics.totalQuotes, color: '#00E676' },
                ].map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => setLeadTab(lt.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center space-x-2 transition-all ${
                      leadTab === lt.id
                        ? 'bg-[#141D30] text-white font-bold border border-[#1E293B]'
                        : 'text-[#9AA3B8] hover:text-white'
                    }`}
                  >
                    <span>{lt.label}</span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{ backgroundColor: `${lt.color}20`, color: lt.color }}
                    >
                      {lt.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Mode Toggle for Appointments */}
              {leadTab === 'appointments' && (
                <div className="flex items-center space-x-1 bg-[#0F1624] p-1 rounded-xl border border-[#1E293B]">
                  <button
                    onClick={() => setAppointmentViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${
                      appointmentViewMode === 'list' ? 'bg-[#A78BFA] text-[#080B12] font-bold' : 'text-[#9AA3B8]'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setAppointmentViewMode('calendar')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center space-x-1 ${
                      appointmentViewMode === 'calendar' ? 'bg-[#A78BFA] text-[#080B12] font-bold' : 'text-[#9AA3B8]'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Search & Status Filters */}
            <div className="p-4 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, or service..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                {['all', 'new', 'scheduled', 'contacted', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadsStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                      leadsStatusFilter === st
                        ? 'bg-[#00E676] text-[#080B12] font-bold'
                        : 'bg-[#080B12] text-[#9AA3B8] border border-[#1E293B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Appointments Tab Content */}
            {leadTab === 'appointments' && (
              <>
                {appointmentViewMode === 'calendar' ? (
                  /* Calendar Grouped View */
                  <div className="space-y-6">
                    {appointmentsByDate.map(([date, appts]) => (
                      <div key={date} className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-3">
                        <div className="flex items-center space-x-2 text-sm font-mono font-bold text-[#A78BFA]">
                          <Calendar className="w-4 h-4" />
                          <span>{date}</span>
                          <span className="text-xs text-[#9AA3B8]">({appts.length} session(s))</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {appts.map((a) => (
                            <div 
                              key={a.id}
                              onClick={() => setSelectedLead(a)}
                              className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#A78BFA] transition-all cursor-pointer space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-sm">{a.fullName}</span>
                                <span className="text-xs font-mono text-[#00E676]">{a.preferredTime}</span>
                              </div>
                              <div className="text-xs text-[#9AA3B8]">{a.serviceRequired}</div>
                              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[10px] font-mono">
                                <span className="text-[#38BDF8]">{a.phone}</span>
                                <span className="uppercase text-[#A78BFA]">{a.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-3">
                    {filteredAppointments.map((apt) => (
                      <div 
                        key={apt.id}
                        className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#A78BFA]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{apt.fullName}</span>
                            {apt.companyName && (
                              <span className="text-xs font-mono text-[#9AA3B8]">({apt.companyName})</span>
                            )}
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              apt.status === 'scheduled' ? 'bg-[#00E676]/15 text-[#00E676]' : 'bg-[#1E293B] text-[#9AA3B8]'
                            }`}>
                              {apt.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-[#9AA3B8]">
                            Date: <strong className="text-white">{apt.preferredDate}</strong> at <strong className="text-white">{apt.preferredTime}</strong> &bull; {apt.serviceRequired}
                          </div>
                          <div className="text-xs text-[#64748B] line-clamp-1">
                            {apt.projectDescription}
                          </div>
                        </div>

                        {/* Contact & Status Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(apt.fullName)}%2C%20regarding%20your%20HackifyPro%20appointment...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-mono font-bold flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`mailto:${apt.email}?subject=Regarding%20Your%20HackifyPro%20Appointment`}
                            className="px-3 py-1.5 rounded-lg bg-[#141D30] border border-[#1E293B] text-white text-xs font-mono flex items-center space-x-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </a>

                          <button
                            onClick={() => setSelectedLead(apt)}
                            className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#A78BFA] text-xs font-mono hover:border-[#A78BFA]"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 2. Enquiries Tab Content */}
            {leadTab === 'enquiries' && (
              <div className="space-y-3">
                {filteredEnquiries.map((enq) => (
                  <div 
                    key={enq.id}
                    className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{enq.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#38BDF8]">
                          {enq.interestedService}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          enq.status === 'new' ? 'bg-[#00E676]/15 text-[#00E676]' : 'bg-[#1E293B] text-[#9AA3B8]'
                        }`}>
                          {enq.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-[#9AA3B8]">
                        Email: {enq.email} &bull; Phone: {enq.phone}
                      </div>
                      <div className="text-xs text-[#E8EDF5] bg-[#080B12] p-2 rounded-lg border border-[#1E293B]/70 mt-1">
                        {enq.message}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(enq.name)}%2C%20thank%20you%20for%20contacting%20HackifyPro!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-mono font-bold flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => setSelectedLead(enq)}
                        className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#38BDF8] text-xs font-mono hover:border-[#38BDF8]"
                      >
                        Details &amp; Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Quotes Tab Content */}
            {leadTab === 'quotes' && (
              <div className="space-y-3">
                {filteredQuotes.map((q) => (
                  <div 
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{q.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#00E676]">
                          Budget: {q.estimatedBudget}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-[#9AA3B8]">
                          {q.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-[#9AA3B8]">
                        Service: {q.requiredService} &bull; Timeline: {q.expectedTimeline}
                      </div>
                      <div className="text-xs text-[#E8EDF5] bg-[#080B12] p-2 rounded-lg border border-[#1E293B]/70 mt-1">
                        Scope: {q.projectScope}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(q.name)}%2C%20regarding%20your%20HackifyPro%20project%20quotation...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-mono font-bold flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => setSelectedLead(q)}
                        className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#00E676] text-xs font-mono hover:border-[#00E676]"
                      >
                        View Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: WEBSITE CONTENT & LINKS MANAGEMENT */}
        {/* ========================================================= */}
        {currentTab === 'content' && siteContent && (
          <div className="space-y-6">
            
            {/* Header & Save Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">
                  Dynamic Website Content &amp; Links Control
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Modify social links, founder biography, services, and hero text without touching code
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {contentSaveMsg && (
                  <span className="text-xs font-mono text-[#00E676] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{contentSaveMsg}</span>
                  </span>
                )}
                <button
                  onClick={handleSaveSiteContent}
                  disabled={contentSaving}
                  className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {contentSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Live Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subtabs Navigation */}
            <div className="flex space-x-2 border-b border-[#1E293B] pb-3">
              {[
                { id: 'links', label: 'Website Links' },
                { id: 'founder', label: 'Founder Profile' },
                { id: 'services', label: 'Services' },
                { id: 'hero', label: 'Hero & CTA' },
                { id: 'sections', label: 'Section Toggles' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setContentSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    contentSubTab === sub.id
                      ? 'bg-[#00E676] text-[#080B12] font-bold'
                      : 'bg-[#0F1624] text-[#9AA3B8] hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Subtab 1: Links */}
            {contentSubTab === 'links' && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    Centralized External &amp; Social Links
                  </h3>
                  <button
                    onClick={() => {
                      const newLink = {
                        id: `lnk-custom-${Date.now()}`,
                        key: 'customLink',
                        label: 'New Link',
                        url: 'https://',
                        category: 'external',
                        enabled: true,
                        openInNewTab: true,
                        order: (siteContent.links || []).length + 1,
                      };
                      setSiteContent({
                        ...siteContent,
                        links: [...(siteContent.links || []), newLink],
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-[#141D30] border border-[#1E293B] text-xs font-mono text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12] transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(siteContent.links || []).map((lnk: any, idx: number) => (
                    <div key={lnk.id} className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-mono text-[#64748B] block">Label</label>
                        <input
                          type="text"
                          value={lnk.label}
                          onChange={(e) => {
                            const newLinks = [...siteContent.links];
                            newLinks[idx].label = e.target.value;
                            setSiteContent({ ...siteContent, links: newLinks });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label className="text-[10px] font-mono text-[#64748B] block">URL Destination</label>
                        <input
                          type="text"
                          value={lnk.url}
                          onChange={(e) => {
                            const newLinks = [...siteContent.links];
                            newLinks[idx].url = e.target.value;
                            setSiteContent({ ...siteContent, links: newLinks });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] font-mono text-[#64748B] block">Category</label>
                        <select
                          value={lnk.category}
                          onChange={(e) => {
                            const newLinks = [...siteContent.links];
                            newLinks[idx].category = e.target.value;
                            setSiteContent({ ...siteContent, links: newLinks });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                        >
                          <option value="social">Social</option>
                          <option value="contact">Contact</option>
                          <option value="cta">CTA</option>
                          <option value="external">External</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-2 md:pt-0">
                        <label className="flex items-center space-x-1.5 text-xs font-mono text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lnk.enabled}
                            onChange={(e) => {
                              const newLinks = [...siteContent.links];
                              newLinks[idx].enabled = e.target.checked;
                              setSiteContent({ ...siteContent, links: newLinks });
                            }}
                            className="rounded accent-[#00E676]"
                          />
                          <span>Active</span>
                        </label>

                        <button
                          onClick={() => {
                            const newLinks = siteContent.links.filter((_: any, i: number) => i !== idx);
                            setSiteContent({ ...siteContent, links: newLinks });
                          }}
                          className="p-1 rounded text-red-400 hover:text-red-300"
                          title="Remove Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtab 2: Founder Profile */}
            {contentSubTab === 'founder' && siteContent.founder && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Founder Profile &amp; Biography Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={siteContent.founder.name}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        founder: { ...siteContent.founder, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={siteContent.founder.role}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        founder: { ...siteContent.founder, role: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Profile Image URL</label>
                    <input
                      type="text"
                      value={siteContent.founder.image}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        founder: { ...siteContent.founder, image: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Location</label>
                    <input
                      type="text"
                      value={siteContent.founder.location}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        founder: { ...siteContent.founder, location: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={siteContent.founder.tagline}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      founder: { ...siteContent.founder, tagline: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Biography / About Founder</label>
                  <textarea
                    rows={4}
                    value={siteContent.founder.bio}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      founder: { ...siteContent.founder, bio: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                  />
                </div>
              </div>
            )}

            {/* Subtab 3: Services */}
            {contentSubTab === 'services' && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    Dynamic Services Manager
                  </h3>
                </div>

                <div className="space-y-3">
                  {(siteContent.services || []).map((srv: any, idx: number) => (
                    <div key={srv.id} className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{srv.title}</span>
                          <span className="text-[10px] font-mono text-[#38BDF8]">/{srv.slug}</span>
                        </div>
                        <div className="text-xs text-[#9AA3B8] mt-1 line-clamp-1">{srv.shortDesc}</div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 text-xs font-mono text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={srv.visibility !== false}
                            onChange={(e) => {
                              const newServices = [...siteContent.services];
                              newServices[idx].visibility = e.target.checked;
                              setSiteContent({ ...siteContent, services: newServices });
                            }}
                            className="rounded accent-[#00E676]"
                          />
                          <span>Visible</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtab 4: Hero & CTA */}
            {contentSubTab === 'hero' && siteContent.homepage && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Homepage Hero &amp; Call-To-Action Content
                </h3>

                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={siteContent.homepage.badge}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: { ...siteContent.homepage, badge: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Heading Line 1</label>
                    <input
                      type="text"
                      value={siteContent.homepage.headingLine1}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        homepage: { ...siteContent.homepage, headingLine1: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Heading Gradient Text</label>
                    <input
                      type="text"
                      value={siteContent.homepage.headingGradient}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        homepage: { ...siteContent.homepage, headingGradient: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Hero Description</label>
                  <textarea
                    rows={3}
                    value={siteContent.homepage.description}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: { ...siteContent.homepage, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={siteContent.homepage.ctaText}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        homepage: { ...siteContent.homepage, ctaText: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Primary CTA URL</label>
                    <input
                      type="text"
                      value={siteContent.homepage.ctaUrl}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        homepage: { ...siteContent.homepage, ctaUrl: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Subtab 5: Section Toggles */}
            {contentSubTab === 'sections' && siteContent.sectionsVisibility && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Homepage Section Visibility Toggles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(siteContent.sectionsVisibility).map(([key, val]: any) => (
                    <label key={key} className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-mono text-white capitalize">{key} Section</span>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          sectionsVisibility: {
                            ...siteContent.sectionsVisibility,
                            [key]: e.target.checked
                          }
                        })}
                        className="rounded accent-[#00E676] w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: AUDIT ACTIVITY LOGS & SECURITY SETTINGS */}
        {/* ========================================================= */}
        {currentTab === 'system' && (
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">
                Security &amp; Admin Audit Trail
              </h2>
              <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                Immutable activity logs, server-side authentication state, and SMTP diagnostics
              </p>
            </div>

            {/* Diagnostics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Test Email Dispatcher */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#00E676]" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    SMTP Email Diagnostics
                  </h3>
                </div>
                <p className="text-xs text-[#9AA3B8]">
                  Send a live diagnostic test message through the configured Gmail SMTP server.
                </p>

                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={emailTestAddress}
                    onChange={(e) => setEmailTestAddress(e.target.value)}
                    placeholder="recipient@example.com"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                  <button
                    onClick={handleTestEmail}
                    disabled={emailTesting}
                    className="px-4 py-2 rounded-xl bg-[#00E676] text-[#080B12] text-xs font-mono font-bold uppercase flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {emailTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test</span>
                      </>
                    )}
                  </button>
                </div>

                {emailTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-mono flex items-center space-x-2 ${
                    emailTestResult.success ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {emailTestResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{emailTestResult.message}</span>
                  </div>
                )}
              </div>

              {/* Cloud Firestore Status */}
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    Cloud Firestore Dual-Write Sync
                  </h3>
                </div>
                <p className="text-xs text-[#9AA3B8]">
                  All new appointments, inquiries, and projects automatically replicate to Google Cloud Firestore (<code className="text-[#00E676]">self-driving-car-rental-9f35f</code>).
                </p>

                <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs font-mono text-[#00E676] flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                    <span>Firestore Real-Time Mirror Active</span>
                  </span>
                  <span className="text-[#9AA3B8]">100% Synced</span>
                </div>
              </div>

            </div>

            {/* Audit Logs Table */}
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Activity Audit Trail ({activityLogs.length} Events)
                </h3>
                <button
                  onClick={fetchActivityLogs}
                  className="p-1.5 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-[#9AA3B8]">
                      <th className="pb-2">Timestamp</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Target</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#141D30]">
                        <td className="py-2.5 text-[#64748B] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5 text-[#00E676] font-bold">{log.action}</td>
                        <td className="py-2.5 text-[#38BDF8] uppercase">{log.targetType}</td>
                        <td className="py-2.5 text-white max-w-md truncate">{log.description}</td>
                        <td className="py-2.5 text-[#9AA3B8]">{log.adminEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PROJECT MODAL */}
      {/* ========================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-4xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white">
                  {isEditingProject ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
                </h3>
                <p className="text-xs font-mono text-[#9AA3B8]">
                  Fill in all project specifications, galleries, videos, and demo URLs
                </p>
              </div>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-2 rounded-xl bg-[#080B12] text-[#9AA3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {projectActionMsg && (
              <div className={`p-4 rounded-xl text-xs font-mono flex items-center space-x-2 ${
                projectActionMsg.type === 'success' ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                {projectActionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{projectActionMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-6">
              
              {/* Row 1: Title, Category, Project Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. HackifyPro HMS"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="HealthTech, CRM, Mobile App"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Project Type</label>
                  <input
                    type="text"
                    value={projectForm.projectType}
                    onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                    placeholder="Web App, Android App, SaaS"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
              </div>

              {/* Row 2: Client, Market, Completion Date, Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Client</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Target Market</label>
                  <input
                    type="text"
                    value={projectForm.market}
                    onChange={(e) => setProjectForm({ ...projectForm, market: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={projectForm.completionDate}
                    onChange={(e) => setProjectForm({ ...projectForm, completionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Visibility</label>
                  <select
                    value={projectForm.visibility}
                    onChange={(e) => setProjectForm({ ...projectForm, visibility: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Cover Image URL & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-9">
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Main Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="/assets/hackifypro-workspace.png or upload in Media Manager"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div className="md:col-span-3 pt-5">
                  <label className="flex items-center space-x-2 text-xs font-mono text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded accent-[#00E676] w-4 h-4"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Row 4: URLs (Live Demo, GitHub) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://... or /appointment?service=..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">GitHub Code Repository URL</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/Barela08/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
              </div>

              {/* Summary & Problem Solved */}
              <div>
                <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={projectForm.summary}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  placeholder="Overview of this project..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Problem Solved</label>
                <textarea
                  rows={2}
                  value={projectForm.problemSolved}
                  onChange={(e) => setProjectForm({ ...projectForm, problemSolved: e.target.value })}
                  placeholder="The real business challenge this software resolved..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                />
              </div>

              {/* Features & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Key Features (One per line)</label>
                  <textarea
                    rows={4}
                    value={projectForm.mainFeaturesText}
                    onChange={(e) => setProjectForm({ ...projectForm, mainFeaturesText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Tech Stack (Comma-separated)</label>
                  <textarea
                    rows={4}
                    value={projectForm.techStackText}
                    onChange={(e) => setProjectForm({ ...projectForm, techStackText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
              </div>

              {/* MULTIPLE GALLERY IMAGES SECTION */}
              <div className="p-4 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>Project Multi-Image Gallery ({projectForm.galleryItems.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImg: ProjectGalleryImage = {
                        id: `img-${Date.now()}`,
                        url: '',
                        alt: projectForm.title,
                        caption: '',
                        order: projectForm.galleryItems.length + 1,
                      };
                      setProjectForm({
                        ...projectForm,
                        galleryItems: [...projectForm.galleryItems, newImg],
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#141D30] text-[#00E676] text-xs font-mono hover:bg-[#00E676] hover:text-[#080B12] transition-colors"
                  >
                    + Add Gallery Image
                  </button>
                </div>

                <div className="space-y-2">
                  {projectForm.galleryItems.map((g, gIdx) => (
                    <div key={g.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Image URL (/uploads/...)"
                        value={g.url}
                        onChange={(e) => {
                          const items = [...projectForm.galleryItems];
                          items[gIdx].url = e.target.value;
                          setProjectForm({ ...projectForm, galleryItems: items });
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Caption"
                        value={g.caption || ''}
                        onChange={(e) => {
                          const items = [...projectForm.galleryItems];
                          items[gIdx].caption = e.target.value;
                          setProjectForm({ ...projectForm, galleryItems: items });
                        }}
                        className="w-48 px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const items = projectForm.galleryItems.filter((_, i) => i !== gIdx);
                          setProjectForm({ ...projectForm, galleryItems: items });
                        }}
                        className="p-1.5 rounded text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEOS SECTION */}
              <div className="p-4 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-1.5">
                    <VideoIcon className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>Project Videos &amp; Demos ({projectForm.videoItems.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVid: ProjectVideo = {
                        id: `vid-${Date.now()}`,
                        title: `${projectForm.title} Demo`,
                        url: '',
                        type: 'youtube',
                        order: projectForm.videoItems.length + 1,
                        position: 'after',
                      };
                      setProjectForm({
                        ...projectForm,
                        videoItems: [...projectForm.videoItems, newVid],
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#141D30] text-[#A78BFA] text-xs font-mono hover:bg-[#A78BFA] hover:text-[#080B12] transition-colors"
                  >
                    + Add Video
                  </button>
                </div>

                <div className="space-y-2">
                  {projectForm.videoItems.map((v, vIdx) => (
                    <div key={v.id} className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={v.title}
                        onChange={(e) => {
                          const items = [...projectForm.videoItems];
                          items[vIdx].title = e.target.value;
                          setProjectForm({ ...projectForm, videoItems: items });
                        }}
                        className="w-40 px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="YouTube / Vimeo URL or /uploads/video.mp4"
                        value={v.url}
                        onChange={(e) => {
                          const items = [...projectForm.videoItems];
                          items[vIdx].url = e.target.value;
                          setProjectForm({ ...projectForm, videoItems: items });
                        }}
                        className="flex-1 min-w-[200px] px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                      />
                      <select
                        value={v.position}
                        onChange={(e) => {
                          const items = [...projectForm.videoItems];
                          items[vIdx].position = e.target.value as any;
                          setProjectForm({ ...projectForm, videoItems: items });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs text-white"
                      >
                        <option value="after">After Screenshots</option>
                        <option value="before">Before Screenshots</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const items = projectForm.videoItems.filter((_, i) => i !== vIdx);
                          setProjectForm({ ...projectForm, videoItems: items });
                        }}
                        className="p-1.5 rounded text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#080B12] text-[#9AA3B8] font-mono text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={projectSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {projectSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditingProject ? 'Save Changes' : 'Publish Project'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PROJECT PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <span className="text-xs font-mono text-[#00E676] uppercase">Project Preview</span>
              <button onClick={() => setPreviewProject(null)} className="p-1 rounded text-[#9AA3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B]">
              <Image src={previewProject.image} alt={previewProject.title} fill className="object-cover" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-[#00E676]">{previewProject.category}</span>
              <h3 className="text-2xl font-bold text-white">{previewProject.title}</h3>
              <p className="text-sm text-[#9AA3B8]">{previewProject.summary}</p>
              {previewProject.problemSolved && (
                <div className="p-3 rounded-xl bg-[#080B12] text-xs text-[#38BDF8]">
                  <strong>Problem Solved:</strong> {previewProject.problemSolved}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1E293B]">
              <button
                onClick={() => setPreviewProject(null)}
                className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: IN-USE WARNING FOR MEDIA DELETION */}
      {/* ========================================================= */}
      {mediaInUseWarning && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1624] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Media Currently In Use!</h3>
            </div>
            <p className="text-xs text-[#9AA3B8]">
              This media file is currently referenced in active sections of your website:
            </p>
            <ul className="space-y-1.5 p-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs font-mono text-amber-300">
              {mediaInUseWarning.references.map((r, i) => (
                <li key={i}>&bull; {r}</li>
              ))}
            </ul>
            <p className="text-xs text-red-400">
              Deleting it now will result in broken images on these pages.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setMediaInUseWarning(null)}
                className="px-4 py-2 rounded-xl bg-[#080B12] text-xs font-mono text-[#9AA3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMedia(mediaInUseWarning.media, true)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-mono font-bold hover:bg-red-700"
              >
                Force Delete Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: LEAD DETAILS & INTERNAL NOTES MODAL */}
      {/* ========================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00E676] uppercase">Lead Management</span>
                <h3 className="text-lg font-bold text-white">
                  {selectedLead.fullName || selectedLead.name}
                </h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded text-[#9AA3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-white">
                <div>Email: <strong className="text-[#38BDF8]">{selectedLead.email}</strong></div>
                <div>Phone: <strong className="text-[#00E676]">{selectedLead.phone}</strong></div>
              </div>
              {selectedLead.serviceRequired && (
                <div>Service Required: <strong className="text-white">{selectedLead.serviceRequired}</strong></div>
              )}
              {selectedLead.preferredDate && (
                <div>Date &amp; Time: <strong className="text-white">{selectedLead.preferredDate} at {selectedLead.preferredTime}</strong></div>
              )}
              {selectedLead.projectDescription && (
                <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-[#9AA3B8]">
                  {selectedLead.projectDescription}
                </div>
              )}
              {selectedLead.message && (
                <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-[#9AA3B8]">
                  {selectedLead.message}
                </div>
              )}
            </div>

            {/* Status Change Selector */}
            <div>
              <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Status Workflow</label>
              <select
                value={selectedLead.status}
                onChange={(e) => handleUpdateLead(
                  selectedLead.fullName ? 'appointment' : selectedLead.projectScope ? 'quote' : 'enquiry',
                  selectedLead.id,
                  { status: e.target.value }
                )}
                className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
              >
                <option value="new">New</option>
                <option value="scheduled">Scheduled / Confirmed</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Internal Admin Notes</label>
              <textarea
                rows={3}
                placeholder="Add confidential notes about this client..."
                value={leadNotesInput !== '' ? leadNotesInput : (selectedLead.notes || '')}
                onChange={(e) => setLeadNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
              <button
                onClick={() => handleDeleteLead(
                  selectedLead.fullName ? 'appointment' : selectedLead.projectScope ? 'quote' : 'enquiry',
                  selectedLead.id
                )}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <button
                onClick={() => {
                  handleUpdateLead(
                    selectedLead.fullName ? 'appointment' : selectedLead.projectScope ? 'quote' : 'enquiry',
                    selectedLead.id,
                    { notes: leadNotesInput }
                  );
                  setSelectedLead(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DELETE PROJECT CONFIRMATION */}
      {/* ========================================================= */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1624] border border-red-500/40 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-[#9AA3B8]">
              Are you sure you want to permanently delete <strong>{deleteConfirmProject.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProject(null)}
                className="px-4 py-2 rounded-xl bg-[#080B12] text-xs font-mono text-[#9AA3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmProject.id)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-mono font-bold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
