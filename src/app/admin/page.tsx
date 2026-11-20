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
  RotateCcw,
  StopCircle,
  UserCheck,
  ShieldAlert,
  KeyRound,
  Ban
} from 'lucide-react';
import { PortfolioProject, ProjectGalleryImage, ProjectVideo } from '@/data/portfolio';
import { VisitorProfile } from '@/lib/visitorIntelligence';

// Upload Queue Item Interface
interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  status: 'queued' | 'preparing' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  loadedBytes: number;
  totalBytes: number;
  elapsedSeconds: number;
  errorMessage?: string;
  xhr?: XMLHttpRequest;
}

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
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; email: string; role: 'owner' | 'admin' | 'editor' | 'viewer' } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryKeyInput, setRecoveryKeyInput] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState<{ success?: boolean; text: string } | null>(null);

  // Permission Restriction Modal State
  const [permissionDeniedModal, setPermissionDeniedModal] = useState<{
    requiredRole: string;
    currentRole: string;
    reason: string;
  } | null>(null);

  // Active Main Navigation Tab
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'projects' | 'media' | 'analytics' | 'visitors' | 'leads' | 'content' | 'system'
  >('dashboard');

  // Leads CRM Subtab
  const [leadTab, setLeadTab] = useState<'appointments' | 'enquiries' | 'quotes'>('appointments');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('list');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');
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
  const [projectMediaUploading, setProjectMediaUploading] = useState(false);
  const [projectUploadError, setProjectUploadError] = useState<string | null>(null);
  const projectMediaInputRef = useRef<HTMLInputElement>(null);
  const projectGalleryInputRef = useRef<HTMLInputElement>(null);
  const projectVideoInputRef = useRef<HTMLInputElement>(null);

  // Media Manager & Upload Queue State
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [mediaInUseWarning, setMediaInUseWarning] = useState<{ media: any; references: string[] } | null>(null);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Visitor Intelligence State
  const [visitorsList, setVisitorsList] = useState<VisitorProfile[]>([]);
  const [visitorStatusFilter, setVisitorStatusFilter] = useState<string>('all');
  const [visitorCountFilter, setVisitorCountFilter] = useState<string>('all');
  const [visitorFormFilter, setVisitorFormFilter] = useState<string>('all');
  const [visitorRangeFilter, setVisitorRangeFilter] = useState<string>('7d');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [selectedVisitorDetail, setSelectedVisitorDetail] = useState<VisitorProfile | null>(null);
  const [funnelStats, setFunnelStats] = useState<any>(null);

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
    const storedUser = localStorage.getItem('hp_admin_user');
    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser({ email: 'hackifypro@gmail.com', role: 'owner' });
        }
      } else {
        setCurrentUser({ email: 'hackifypro@gmail.com', role: 'owner' });
      }
      fetchAllAdminData();
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (!cooldownRemaining || cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  // Fetch all admin data
  const fetchAllAdminData = () => {
    fetchLeads();
    fetchProjects();
    fetchMedia();
    fetchAnalytics(analyticsRange);
    fetchVisitors();
    fetchSiteContent();
    fetchActivityLogs();
  };

  // Re-fetch analytics when range changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics(analyticsRange);
      fetchVisitors();
    }
  }, [analyticsRange, isAuthenticated]);

  // Periodic live refresh every 30s
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchLeads();
      fetchAnalytics(analyticsRange);
      fetchVisitors();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, analyticsRange]);

  // Permission Check Helper
  const requirePermission = (permission: string, actionName: string): boolean => {
    const role = currentUser?.role || 'viewer';
    if (role === 'owner') return true;

    const allowed = (
      (role === 'admin' && ['manage_projects', 'manage_media', 'manage_content', 'manage_leads', 'view_analytics'].includes(permission)) ||
      (role === 'editor' && ['manage_projects', 'manage_media', 'manage_content', 'view_leads', 'view_analytics'].includes(permission)) ||
      (role === 'viewer' && ['view_analytics', 'view_projects', 'view_leads'].includes(permission))
    );

    if (!allowed) {
      setPermissionDeniedModal({
        requiredRole: permission.startsWith('delete') || permission.startsWith('security') ? 'Owner' : 'Admin or Editor',
        currentRole: role.toUpperCase(),
        reason: `Your account role does not possess the "${permission}" permission required to ${actionName}.`,
      });
      return false;
    }
    return true;
  };

  // Login Handler with Progressive Cooldown
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
        if (res.status === 429 && data.retryAfterSeconds) {
          setCooldownRemaining(data.retryAfterSeconds);
        }
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('hp_admin_token', data.token);
      localStorage.setItem('hp_admin_user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      fetchAllAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler (revokes session token server-side)
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {}
    localStorage.removeItem('hp_admin_token');
    localStorage.removeItem('hp_admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Emergency Recovery Unlock
  const handleEmergencyUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);
    try {
      const res = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey: recoveryKeyInput, identifier: email || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecoveryMsg({ success: true, text: data.message });
        setCooldownRemaining(null);
        setTimeout(() => {
          setRecoveryModalOpen(false);
        }, 1500);
      } else {
        setRecoveryMsg({ success: false, text: data.error || 'Unlock failed' });
      }
    } catch (err: any) {
      setRecoveryMsg({ success: false, text: err.message || 'Unlock failed' });
    }
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
    if (!requirePermission('manage_leads', 'update lead status')) return;
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
    if (!requirePermission('delete_leads', 'permanently delete leads')) return;
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
    if (!requirePermission('manage_projects', 'create new projects')) return;
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
    if (!requirePermission('manage_projects', 'edit project details')) return;
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

  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery' | 'video' = 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProjectMediaUploading(true);
    setProjectUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('altText', `${projectForm.title || 'Project'} ${target}`);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload media file');
      }

      const uploadedUrl = data.media?.url;
      if (target === 'cover' && uploadedUrl) {
        setProjectForm((prev) => ({
          ...prev,
          image: uploadedUrl,
        }));
      } else if (target === 'gallery' && uploadedUrl) {
        setProjectForm((prev) => ({
          ...prev,
          galleryItems: [
            ...(prev.galleryItems || []),
            {
              id: `img-${Date.now()}`,
              url: uploadedUrl,
              alt: `${prev.title} screenshot`,
              caption: file.name,
              order: (prev.galleryItems?.length || 0) + 1,
            },
          ],
        }));
      } else if (target === 'video' && uploadedUrl) {
        setProjectForm((prev) => ({
          ...prev,
          videoItems: [
            ...(prev.videoItems || []),
            {
              id: `vid-${Date.now()}`,
              title: file.name,
              url: uploadedUrl,
              type: 'file',
              order: (prev.videoItems?.length || 0) + 1,
              position: 'after',
            },
          ],
        }));
      }

      setProjectActionMsg({
        type: 'success',
        text: `Uploaded "${file.name}" successfully!`,
      });
      setTimeout(() => setProjectActionMsg(null), 3000);
    } catch (err: any) {
      setProjectUploadError(err.message || 'Media upload failed');
    } finally {
      setProjectMediaUploading(false);
      if (projectMediaInputRef.current) projectMediaInputRef.current.value = '';
      if (projectGalleryInputRef.current) projectGalleryInputRef.current.value = '';
      if (projectVideoInputRef.current) projectVideoInputRef.current.value = '';
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirePermission('manage_projects', 'save project modifications')) return;
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
    if (!requirePermission('manage_projects', 'delete portfolio projects')) return;
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
    if (!requirePermission('manage_projects', 'toggle project visibility')) return;
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
    if (!requirePermission('manage_projects', 'reorder portfolio projects')) return;
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

  // 3. Media API & Drag-and-Drop Queue with Real Progress and Genuine Cancellation
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

  const addFilesToUploadQueue = (files: FileList | File[]) => {
    if (!requirePermission('manage_media', 'upload media assets')) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newItems: UploadQueueItem[] = fileArray.map((file) => ({
      id: `up_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      status: 'queued',
      progress: 0,
      loadedBytes: 0,
      totalBytes: file.size,
      elapsedSeconds: 0,
    }));

    setUploadQueue((prev) => [...newItems, ...prev]);

    // Start uploads asynchronously
    newItems.forEach((item) => {
      startRealUpload(item);
    });
  };

  const startRealUpload = (item: UploadQueueItem) => {
    const xhr = new XMLHttpRequest();
    item.xhr = xhr;
    const startTime = Date.now();

    // Update status to preparing / uploading
    setUploadQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', xhr } : q))
    );

    // Track real progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  progress: percent,
                  loadedBytes: event.loaded,
                  totalBytes: event.total,
                  elapsedSeconds: elapsed,
                  status: percent === 100 ? 'processing' : 'uploading',
                }
              : q
          )
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'completed', progress: 100 } : q))
        );
        fetchMedia();
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'failed', errorMessage: res.error || 'Upload rejected' } : q
            )
          );
        } catch {
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'failed', errorMessage: 'Server error' } : q))
          );
        }
      }
    };

    xhr.onerror = () => {
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'failed', errorMessage: 'Network connection error' } : q))
      );
    };

    xhr.onabort = () => {
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'cancelled', errorMessage: 'Upload aborted by user' } : q))
      );
    };

    const formData = new FormData();
    formData.append('file', item.file);

    xhr.open('POST', '/api/admin/media/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
    xhr.send(formData);
  };

  // Genuine Cancellation Controls
  const cancelUpload = (id: string) => {
    setUploadQueue((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (q.xhr && (q.status === 'uploading' || q.status === 'processing')) {
            q.xhr.abort();
          }
          return { ...q, status: 'cancelled', errorMessage: 'Cancelled by user' };
        }
        return q;
      })
    );
  };

  const cancelAllUploads = () => {
    setUploadQueue((prev) =>
      prev.map((q) => {
        if ((q.status === 'uploading' || q.status === 'processing') && q.xhr) {
          q.xhr.abort();
        }
        if (q.status === 'uploading' || q.status === 'processing' || q.status === 'queued') {
          return { ...q, status: 'cancelled', errorMessage: 'Cancelled by user' };
        }
        return q;
      })
    );
  };

  const retryUpload = (item: UploadQueueItem) => {
    startRealUpload({ ...item, status: 'queued', progress: 0, loadedBytes: 0 });
  };

  const handleDeleteMedia = async (mediaItem: any, force = false) => {
    if (!requirePermission('manage_media', 'delete media assets')) return;
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

  // 4. Visitor Intelligence API
  const fetchVisitors = async () => {
    try {
      const url = `/api/admin/visitors?status=${visitorStatusFilter}&visitCount=${visitorCountFilter}&formFilter=${visitorFormFilter}&range=${visitorRangeFilter}${visitorSearch ? `&search=${encodeURIComponent(visitorSearch)}` : ''}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        setVisitorsList(json.visitors || []);
        setFunnelStats(json.funnel || null);
      }
    } catch (err) {
      console.error('Failed to fetch visitors', err);
    }
  };

  // 5. Visitor Analytics API
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

  // 6. Site Content & Links API
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
    if (!requirePermission('manage_content', 'save website content and links')) return;
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

  // 7. System Audit Logs API
  const fetchActivityLogs = async () => {
    try {
      const res = await fetch('/api/admin/activity?limit=100', {
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
  // LOGIN SCREEN WITH PROGRESSIVE COOLDOWN & UNLOCK RECOVERY
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

          {cooldownRemaining !== null && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-amber-300 text-xs font-mono">
              <Clock className="w-4 h-4 flex-shrink-0 animate-spin" />
              <span>
                Progressive Cooldown Active: Access locked for <strong>{cooldownRemaining}s</strong> to prevent brute-force attacks.
              </span>
            </div>
          )}

          {loginError && !cooldownRemaining && (
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
              <input
                type="email"
                required
                disabled={Boolean(cooldownRemaining)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hackifypro@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#00E676] transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9AA3B8] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                disabled={Boolean(cooldownRemaining)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#00E676] transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(cooldownRemaining)}
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

          <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span>Bcrypt Hashed &bull; SHA-256 HMAC</span>
            <button
              onClick={() => {
                setRecoveryMsg(null);
                setRecoveryModalOpen(true);
              }}
              className="text-[#38BDF8] hover:underline"
            >
              Emergency Unlock
            </button>
          </div>
        </div>

        {/* Emergency Recovery Unlock Modal */}
        {recoveryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center space-x-2 text-white">
                  <KeyRound className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-bold">Owner Emergency Unlock</h3>
                </div>
                <button onClick={() => setRecoveryModalOpen(false)} className="text-[#9AA3B8] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#9AA3B8]">
                If your IP or account has been locked due to repeated attempts, enter the secret <code>ADMIN_SECRET_KEY</code> from your environment configuration to immediately lift the lock.
              </p>

              {recoveryMsg && (
                <div className={`p-3 rounded-xl text-xs font-mono ${
                  recoveryMsg.success ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {recoveryMsg.text}
                </div>
              )}

              <form onSubmit={handleEmergencyUnlock} className="space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Enter ADMIN_SECRET_KEY..."
                  value={recoveryKeyInput}
                  onChange={(e) => setRecoveryKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#38BDF8] text-[#080B12] font-mono text-xs font-bold uppercase"
                >
                  Lift Security Lockout
                </button>
              </form>
            </div>
          </div>
        )}
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
                <span className="text-xs font-mono text-[#9AA3B8] font-normal ml-2 px-2 py-0.5 rounded bg-[#141D30] border border-[#1E293B] uppercase">
                  {currentUser?.role || 'Admin'}
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
              title="Logout & Revoke Session"
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
              { id: 'visitors', label: 'Visitor Intelligence', icon: Users, badge: visitorsList.length },
              { id: 'projects', label: 'Projects & Demos', icon: Layers, badge: projects.length },
              { id: 'media', label: 'Media Manager', icon: ImageIcon, badge: mediaList.length },
              { id: 'analytics', label: 'Traffic Analytics', icon: Activity },
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
        onChange={(e) => {
          if (e.target.files) addFilesToUploadQueue(e.target.files);
        }}
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
              
              {/* Visitor Intelligence Stat */}
              <div 
                onClick={() => setCurrentTab('visitors')}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Tracked Browsers</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#00E676]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {visitorsList.length}
                </div>
                <div className="text-xs font-mono text-[#00E676] mt-1 flex items-center space-x-2">
                  <span>{visitorsList.filter((v) => v.isReturning).length} Returning</span>
                  <span className="text-[#64748B]">&bull;</span>
                  <span className="text-[#38BDF8]">{visitorsList.filter((v) => v.conversions.length > 0).length} Converted</span>
                </div>
              </div>

              {/* Projects Stat */}
              <div 
                onClick={() => setCurrentTab('projects')}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#38BDF8]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Total Projects</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#38BDF8]">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {projects.length}
                </div>
                <div className="text-xs font-mono text-[#38BDF8] mt-1 flex items-center space-x-2">
                  <span>{projects.filter((p) => !p.visibility || p.visibility === 'published').length} Published</span>
                  <span className="text-[#64748B]">&bull;</span>
                  <span className="text-[#9AA3B8]">{projects.filter((p) => p.visibility === 'draft').length} Draft</span>
                </div>
              </div>

              {/* Inquiries & Leads Stat */}
              <div 
                onClick={() => { setCurrentTab('leads'); setLeadTab('enquiries'); }}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#A78BFA]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Inquiries</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#A78BFA]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {leadsData.metrics.totalEnquiries}
                </div>
                <div className="text-xs font-mono text-[#A78BFA] mt-1">
                  {leadsData.metrics.newEnquiries} New / Unhandled
                </div>
              </div>

              {/* Appointments Stat */}
              <div 
                onClick={() => { setCurrentTab('leads'); setLeadTab('appointments'); }}
                className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9AA3B8]">Appointments</span>
                  <div className="p-2 rounded-xl bg-[#080B12] text-[#00E676]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-2">
                  {leadsData.metrics.totalAppointments}
                </div>
                <div className="text-xs font-mono text-[#00E676] mt-1">
                  {leadsData.appointments.filter((a) => a.status === 'scheduled' || a.status === 'new').length} Scheduled / Pending
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
                  onClick={() => setCurrentTab('visitors')}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#00E676] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Visitor Intelligence</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('leads'); setLeadTab('enquiries'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#A78BFA] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>View Inquiries</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('leads'); setLeadTab('appointments'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#141D30] border border-[#1E293B] text-white hover:border-[#00E676] text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>View Appointments</span>
                </button>
              </div>
            </div>

            {/* Form Funnel Conversion Overview Card */}
            {funnelStats && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[#00E676]" />
                      <span>Form Conversion Funnel Intelligence</span>
                    </h3>
                    <p className="text-xs text-[#9AA3B8] mt-0.5">
                      Tracks visitor drop-offs and completed submissions without storing unsubmitted personal field data
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('visitors')}
                    className="text-xs font-mono text-[#00E676] hover:underline flex items-center space-x-1"
                  >
                    <span>View Visitor Profiles</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'appointment', label: 'Consultation Appointments', color: '#A78BFA' },
                    { key: 'enquiry', label: 'General Project Inquiries', color: '#38BDF8' },
                    { key: 'quote', label: 'Quotation Estimates', color: '#00E676' },
                  ].map((f) => {
                    const data = funnelStats[f.key] || { viewed: 0, started: 0, abandoned: 0, submitted: 0, rate: 0 };
                    return (
                      <div key={f.key} className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-white">{f.label}</span>
                          <span className="font-bold text-[#00E676]">{data.rate}% Rate</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-[#0F1624]">
                            <div className="text-[#9AA3B8]">Viewed</div>
                            <div className="text-white font-bold mt-0.5">{data.viewed}</div>
                          </div>
                          <div className="p-1.5 rounded bg-[#0F1624]">
                            <div className="text-[#38BDF8]">Started</div>
                            <div className="text-white font-bold mt-0.5">{data.started}</div>
                          </div>
                          <div className="p-1.5 rounded bg-[#0F1624]">
                            <div className="text-amber-400">Left</div>
                            <div className="text-white font-bold mt-0.5">{data.abandoned}</div>
                          </div>
                          <div className="p-1.5 rounded bg-[#0F1624]">
                            <div className="text-[#00E676]">Sent</div>
                            <div className="text-white font-bold mt-0.5">{data.submitted}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VISITOR INTELLIGENCE & INDIVIDUAL VISITOR HISTORY */}
        {/* ========================================================= */}
        {currentTab === 'visitors' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white flex items-center space-x-2">
                  <span>Visitor Intelligence &amp; Return Tracking</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30">
                    Anonymous &bull; 1st-Party
                  </span>
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Distinguishes anonymous returning browsers without capturing PII or fingerprinting
                </p>
              </div>

              <button
                onClick={fetchVisitors}
                className="px-3 py-1.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-white hover:border-[#00E676] text-xs font-mono flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Profiles</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[220px] relative">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Visitor ID, device, browser, or visited path..."
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                {/* Date Range */}
                <div className="flex items-center space-x-1 bg-[#080B12] p-1 rounded-xl border border-[#1E293B]">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: '7d', label: '7D' },
                    { id: '30d', label: '30D' },
                    { id: 'all', label: 'All Time' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setVisitorRangeFilter(r.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        visitorRangeFilter === r.id ? 'bg-[#00E676] text-[#080B12] font-bold' : 'text-[#9AA3B8]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1E293B]/60 text-xs font-mono">
                <span className="text-[#9AA3B8]">Filter by:</span>

                {/* Status Filter */}
                <select
                  value={visitorStatusFilter}
                  onChange={(e) => setVisitorStatusFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#1E293B] text-xs text-white"
                >
                  <option value="all">All Engagement Types</option>
                  <option value="new">New Visitors</option>
                  <option value="returning">Returning Visitors</option>
                  <option value="engaged">Engaged Visitors</option>
                  <option value="converted">Form Submitted / Converted</option>
                </select>

                {/* Visit Count Filter */}
                <select
                  value={visitorCountFilter}
                  onChange={(e) => setVisitorCountFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#1E293B] text-xs text-white"
                >
                  <option value="all">Any Visit Count</option>
                  <option value="1">1 Visit Only</option>
                  <option value="2-5">2 to 5 Visits</option>
                  <option value="6+">6+ Visits</option>
                </select>

                {/* Form Filter */}
                <select
                  value={visitorFormFilter}
                  onChange={(e) => setVisitorFormFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#1E293B] text-xs text-white"
                >
                  <option value="all">All Form Activities</option>
                  <option value="submitted">Form Submitted</option>
                  <option value="not_submitted">Form Not Submitted</option>
                  <option value="appointment">Appointment Booked</option>
                  <option value="quote">Quote Requested</option>
                  <option value="enquiry">Inquiry Sent</option>
                </select>
              </div>
            </div>

            {/* Visitors Table */}
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
              <div className="text-xs font-mono text-[#9AA3B8]">
                Displaying <strong>{visitorsList.length}</strong> tracked browser profiles
              </div>

              {visitorsList.length === 0 ? (
                <div className="text-center py-12 text-xs font-mono text-[#64748B]">
                  No visitors match the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#1E293B] text-[#9AA3B8]">
                        <th className="pb-3">Visitor ID</th>
                        <th className="pb-3">Label</th>
                        <th className="pb-3">Visits</th>
                        <th className="pb-3">Pageviews</th>
                        <th className="pb-3">Device / OS</th>
                        <th className="pb-3">First Seen</th>
                        <th className="pb-3">Last Seen</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/60">
                      {visitorsList.map((v) => (
                        <tr key={v.visitorId} className="hover:bg-[#141D30]">
                          <td className="py-3 text-white font-bold">
                            {v.visitorId.substring(0, 18)}...
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              v.engagementLabel === 'Appointment Booked' ? 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30' :
                              v.engagementLabel === 'Quote Requested' ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30' :
                              v.engagementLabel === 'Inquiry Submitted' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30' :
                              v.engagementLabel === 'Engaged Visitor' ? 'bg-[#00E676]/15 text-[#00E676]' :
                              v.engagementLabel === 'Returning Visitor' ? 'bg-[#38BDF8]/15 text-[#38BDF8]' :
                              'bg-[#1E293B] text-[#9AA3B8]'
                            }`}>
                              {v.engagementLabel}
                            </span>
                          </td>
                          <td className="py-3 text-white font-bold">{v.totalVisits}</td>
                          <td className="py-3 text-white">{v.totalPageViews}</td>
                          <td className="py-3 text-[#9AA3B8] capitalize">
                            {v.deviceCategory} &bull; {v.browserCategory}
                          </td>
                          <td className="py-3 text-[#64748B]">
                            {new Date(v.firstSeen).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-[#64748B]">
                            {new Date(v.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedVisitorDetail(v)}
                              className="px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12] transition-colors"
                            >
                              Timeline &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROJECTS & DEMOS MANAGEMENT */}
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
        {/* TAB 4: MEDIA MANAGER WITH DRAG & DROP QUEUE AND PROGRESS */}
        {/* ========================================================= */}
        {currentTab === 'media' && (
          <div className="space-y-6">
            
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">
                  Media Manager &amp; Upload Engine
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Drag &amp; drop multiple images/videos with real progress tracking and cancellation
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {uploadQueue.some((q) => q.status === 'uploading' || q.status === 'processing' || q.status === 'queued') && (
                  <button
                    onClick={cancelAllUploads}
                    className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-mono flex items-center space-x-1.5"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    <span>Cancel All</span>
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Select Files</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                addFilesToUploadQueue(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl bg-[#0F1624] border-2 border-dashed transition-all text-center cursor-pointer group ${
                isDragOver ? 'border-[#00E676] bg-[#00E676]/5 scale-[1.01]' : 'border-[#1E293B] hover:border-[#00E676]/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#080B12] border border-[#1E293B] mx-auto flex items-center justify-center text-[#00E676] mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Drag &amp; Drop Images or Videos Here
              </h3>
              <p className="text-xs font-mono text-[#9AA3B8] mt-1">
                Supports Multi-File Upload: PNG, JPG, WebP, SVG, MP4, WebM up to 60MB
              </p>
            </div>

            {/* REAL-TIME UPLOAD QUEUE DISPLAY */}
            {uploadQueue.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-[#00E676]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Upload Task Queue ({uploadQueue.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setUploadQueue([])}
                    className="text-xs font-mono text-[#9AA3B8] hover:text-white"
                  >
                    Clear Queue
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadQueue.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 truncate">
                          {item.previewUrl ? (
                            <img src={item.previewUrl} alt={item.name} className="w-9 h-9 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded bg-[#141D30] flex items-center justify-center flex-shrink-0">
                              <Film className="w-4 h-4 text-[#A78BFA]" />
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">{item.name}</div>
                            <div className="text-[10px] font-mono text-[#64748B]">
                              {(item.size / (1024 * 1024)).toFixed(2)} MB &bull; {item.type}
                            </div>
                          </div>
                        </div>

                        {/* Status & Cancel / Retry Controls */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            item.status === 'completed' ? 'bg-[#00E676]/15 text-[#00E676]' :
                            item.status === 'uploading' ? 'bg-[#38BDF8]/15 text-[#38BDF8] animate-pulse' :
                            item.status === 'processing' ? 'bg-[#A78BFA]/15 text-[#A78BFA] animate-pulse' :
                            item.status === 'cancelled' ? 'bg-[#64748B]/20 text-[#9AA3B8]' :
                            'bg-red-500/15 text-red-400'
                          }`}>
                            {item.status.toUpperCase()} {item.status === 'uploading' ? `${item.progress}%` : ''}
                          </span>

                          {item.status === 'uploading' && (
                            <button
                              onClick={() => cancelUpload(item.id)}
                              title="Abort Upload"
                              className="p-1 rounded bg-[#141D30] text-red-400 hover:text-red-300"
                            >
                              <StopCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {(item.status === 'failed' || item.status === 'cancelled') && (
                            <button
                              onClick={() => retryUpload(item)}
                              title="Retry Upload"
                              className="p-1 rounded bg-[#141D30] text-[#00E676] hover:bg-[#00E676] hover:text-[#080B12]"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Genuine Real Progress Bar */}
                      {item.status === 'uploading' && (
                        <div className="space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-[#141D30] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00E676] to-[#38BDF8] transition-all duration-150"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
                            <span>{(item.loadedBytes / (1024 * 1024)).toFixed(2)} MB of {(item.totalBytes / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>{item.elapsedSeconds}s elapsed</span>
                          </div>
                        </div>
                      )}

                      {item.errorMessage && (
                        <div className="text-[10px] font-mono text-red-400">{item.errorMessage}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Search and Type Filters */}
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

                  <div>
                    <div className="text-xs font-bold text-white truncate" title={m.filename}>
                      {m.title || m.filename}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] flex items-center justify-between mt-0.5">
                      <span>{(m.fileSize / 1024).toFixed(0)} KB</span>
                      <span className="uppercase">{m.mediaType}</span>
                    </div>
                  </div>

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
        {/* TAB 5: TRAFFIC ANALYTICS */}
        {/* ========================================================= */}
        {currentTab === 'analytics' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white flex items-center space-x-2">
                  <span>Privacy-Conscious Traffic Analytics</span>
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                </h2>
                <p className="text-xs text-[#9AA3B8] mt-0.5 font-mono">
                  Real-time events aggregated from privacy-safe beacons
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#0F1624] p-1.5 rounded-xl border border-[#1E293B]">
                {[
                  { id: 'today', label: 'Today' },
                  { id: '7d', label: '7D' },
                  { id: '30d', label: '30D' },
                  { id: '90d', label: '90D' },
                  { id: 'all', label: 'All' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAnalyticsRange(r.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      analyticsRange === r.id ? 'bg-[#00E676] text-[#080B12] font-bold' : 'text-[#9AA3B8]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
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
                <div className="text-[11px] font-mono text-[#64748B] mt-1">Heartbeat in last 3 minutes</div>
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

            {/* Split Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Most Visited Pages</h3>
                <div className="space-y-2">
                  {analyticsStats?.topPages?.map((tp: any) => (
                    <div key={tp.path} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B12] text-xs font-mono">
                      <span className="text-white truncate max-w-xs">{tp.path}</span>
                      <span className="text-[#00E676] font-bold px-2 py-0.5 rounded bg-[#00E676]/10">{tp.count} views</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Traffic Sources</h3>
                <div className="space-y-2">
                  {analyticsStats?.topReferrers?.map((tr: any) => (
                    <div key={tr.source} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B12] text-xs font-mono">
                      <span className="text-white truncate max-w-xs">{tr.source}</span>
                      <span className="text-[#38BDF8] font-bold px-2 py-0.5 rounded bg-[#38BDF8]/10">{tr.count} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: INQUIRIES & CRM MANAGEMENT */}
        {/* ========================================================= */}
        {currentTab === 'leads' && (
          <div className="space-y-6">
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
                      leadTab === lt.id ? 'bg-[#141D30] text-white font-bold border border-[#1E293B]' : 'text-[#9AA3B8]'
                    }`}
                  >
                    <span>{lt.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${lt.color}20`, color: lt.color }}>
                      {lt.count}
                    </span>
                  </button>
                ))}
              </div>

              {leadTab === 'appointments' && (
                <div className="flex items-center space-x-1 bg-[#0F1624] p-1 rounded-xl border border-[#1E293B]">
                  <button
                    onClick={() => setAppointmentViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${appointmentViewMode === 'list' ? 'bg-[#A78BFA] text-[#080B12] font-bold' : 'text-[#9AA3B8]'}`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setAppointmentViewMode('calendar')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center space-x-1 ${appointmentViewMode === 'calendar' ? 'bg-[#A78BFA] text-[#080B12] font-bold' : 'text-[#9AA3B8]'}`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </button>
                </div>
              )}
            </div>

            {/* List / Calendar content */}
            {leadTab === 'appointments' && (
              appointmentViewMode === 'calendar' ? (
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
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAppointments.map((apt) => (
                    <div key={apt.id} className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#A78BFA]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{apt.fullName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-[#9AA3B8] uppercase">{apt.status}</span>
                        </div>
                        <div className="text-xs text-[#9AA3B8]">Date: <strong className="text-white">{apt.preferredDate}</strong> at <strong className="text-white">{apt.preferredTime}</strong> &bull; {apt.serviceRequired}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-[#00E676]/15 text-[#00E676] text-xs font-mono font-bold">WhatsApp</a>
                        <button onClick={() => setSelectedLead(apt)} className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#A78BFA] text-xs font-mono">Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {leadTab === 'enquiries' && (
              <div className="space-y-3">
                {filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{enq.name} ({enq.interestedService})</div>
                      <div className="text-xs text-[#9AA3B8] mt-1">{enq.message}</div>
                    </div>
                    <button onClick={() => setSelectedLead(enq)} className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#38BDF8] text-xs font-mono">Details</button>
                  </div>
                ))}
              </div>
            )}

            {leadTab === 'quotes' && (
              <div className="space-y-3">
                {filteredQuotes.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{q.name} &bull; Budget: {q.estimatedBudget}</div>
                      <div className="text-xs text-[#9AA3B8] mt-1">Scope: {q.projectScope}</div>
                    </div>
                    <button onClick={() => setSelectedLead(q)} className="px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#1E293B] text-[#00E676] text-xs font-mono">View Quote</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CONTENT & LINKS */}
        {/* ========================================================= */}
        {currentTab === 'content' && siteContent && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-white">Dynamic Content &amp; Links</h2>
                <p className="text-xs text-[#9AA3B8] font-mono">Manage links, founder biography, services, and hero text</p>
              </div>
              <button
                onClick={handleSaveSiteContent}
                disabled={contentSaving}
                className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider"
              >
                {contentSaving ? 'Saving...' : 'Save Live Changes'}
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
              <h3 className="text-sm font-mono font-bold uppercase text-white">Managed External URLs</h3>
              <div className="space-y-3">
                {(siteContent.links || []).map((lnk: any, idx: number) => (
                  <div key={lnk.id} className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={lnk.label}
                      onChange={(e) => {
                        const newLinks = [...siteContent.links];
                        newLinks[idx].label = e.target.value;
                        setSiteContent({ ...siteContent, links: newLinks });
                      }}
                      className="md:col-span-4 px-3 py-1.5 rounded bg-[#0F1624] text-xs text-white border border-[#1E293B]"
                    />
                    <input
                      type="text"
                      value={lnk.url}
                      onChange={(e) => {
                        const newLinks = [...siteContent.links];
                        newLinks[idx].url = e.target.value;
                        setSiteContent({ ...siteContent, links: newLinks });
                      }}
                      className="md:col-span-8 px-3 py-1.5 rounded bg-[#0F1624] text-xs text-white border border-[#1E293B]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: AUDIT & SECURITY */}
        {/* ========================================================= */}
        {currentTab === 'system' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">Security &amp; Audit Logs</h2>
              <p className="text-xs text-[#9AA3B8] font-mono">Authentication events, progressive cooldowns, and server audit trail</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center space-x-2 text-white">
                  <Mail className="w-4 h-4 text-[#00E676]" />
                  <h3 className="text-sm font-mono font-bold uppercase">SMTP Email Diagnostics</h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={emailTestAddress}
                    onChange={(e) => setEmailTestAddress(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                  <button
                    onClick={handleTestEmail}
                    disabled={emailTesting}
                    className="px-4 py-2 rounded-xl bg-[#00E676] text-[#080B12] text-xs font-mono font-bold"
                  >
                    {emailTesting ? 'Sending...' : 'Test SMTP'}
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
                <div className="flex items-center space-x-2 text-white">
                  <Shield className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-mono font-bold uppercase">Authentication &amp; Cooldown</h3>
                </div>
                <p className="text-xs text-[#9AA3B8]">
                  Bcrypt hashing with 12 salt rounds active. Progressive cooldown triggers on 4+ failed attempts.
                </p>
                <div className="text-xs font-mono text-[#00E676]">
                  Active Session Role: <strong className="uppercase">{currentUser?.role || 'Owner'}</strong>
                </div>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold uppercase text-white">Audit Trail ({activityLogs.length} Events)</h3>
                <button onClick={fetchActivityLogs} className="p-1.5 rounded-lg bg-[#080B12] text-[#9AA3B8] hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-[#9AA3B8]">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60">
                    {activityLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-[#141D30]">
                        <td className="py-2.5 text-[#64748B] whitespace-nowrap">{new Date(l.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2.5 text-[#00E676] font-bold">{l.action}</td>
                        <td className="py-2.5 text-white max-w-md truncate">{l.description}</td>
                        <td className="py-2.5 text-[#9AA3B8]">{l.adminEmail}</td>
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
      {/* MODAL 1: INDIVIDUAL VISITOR DETAIL & TIMELINE MODAL */}
      {/* ========================================================= */}
      {selectedVisitorDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <span className="text-xs font-mono text-[#00E676] uppercase">Visitor Intelligence Profile</span>
                <h3 className="text-xl font-heading font-extrabold text-white">
                  {selectedVisitorDetail.visitorId}
                </h3>
              </div>
              <button onClick={() => setSelectedVisitorDetail(null)} className="p-2 rounded-xl bg-[#080B12] text-[#9AA3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B]">
                <div className="text-[#9AA3B8]">Status Label</div>
                <div className="text-[#00E676] font-bold mt-1">{selectedVisitorDetail.engagementLabel}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B]">
                <div className="text-[#9AA3B8]">Total Visits</div>
                <div className="text-white font-bold mt-1">{selectedVisitorDetail.totalVisits} Session(s)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B]">
                <div className="text-[#9AA3B8]">Total Pageviews</div>
                <div className="text-white font-bold mt-1">{selectedVisitorDetail.totalPageViews} Views</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B]">
                <div className="text-[#9AA3B8]">Device / OS</div>
                <div className="text-[#38BDF8] font-bold mt-1 capitalize">{selectedVisitorDetail.deviceCategory} ({selectedVisitorDetail.browserCategory})</div>
              </div>
            </div>

            {/* Visit Timeline */}
            <div className="p-5 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Session &amp; Visit Timeline ({selectedVisitorDetail.sessions.length} recorded)</span>
              </h4>

              <div className="space-y-3">
                {selectedVisitorDetail.sessions.map((sess, sIdx) => (
                  <div key={sess.sessionId} className="p-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A78BFA] font-bold">Session #{selectedVisitorDetail.sessions.length - sIdx}</span>
                      <span className="text-[#64748B]">{new Date(sess.startedAt).toLocaleString()}</span>
                    </div>
                    <div className="text-[#9AA3B8]">
                      Duration: <strong className="text-white">{sess.durationSeconds}s</strong> &bull; Pageviews: <strong className="text-white">{sess.pageviews}</strong>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sess.pages.map((p) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-[#080B12] text-[#38BDF8] border border-[#1E293B]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clicks & Interactions */}
            {selectedVisitorDetail.interactions.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Clicks &amp; Interactions ({selectedVisitorDetail.interactions.length})
                </h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedVisitorDetail.interactions.map((i) => (
                    <div key={i.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0F1624]">
                      <span className="text-[#00E676]">{i.type.replace('_', ' ').toUpperCase()} on {i.page}</span>
                      <span className="text-[#64748B]">{new Date(i.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversions */}
            {selectedVisitorDetail.conversions.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#080B12] border border-[#00E676]/40 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
                  Verified Lead Conversions ({selectedVisitorDetail.conversions.length})
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  {selectedVisitorDetail.conversions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0F1624] border border-[#1E293B]">
                      <div>
                        <span className="font-bold text-white capitalize">{c.formType} Form</span>
                        <div className="text-[11px] text-[#38BDF8]">Lead Reference: {c.leadId}</div>
                      </div>
                      <span className="text-[#64748B]">{new Date(c.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#1E293B]">
              <button
                onClick={() => setSelectedVisitorDetail(null)}
                className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PERMISSION RESTRICTED MODAL */}
      {/* ========================================================= */}
      {permissionDeniedModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1624] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Access Restricted</h3>
            <p className="text-xs text-[#9AA3B8]">{permissionDeniedModal.reason}</p>
            
            <div className="p-3 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs font-mono space-y-1 text-left">
              <div>Current Role: <strong className="text-white">{permissionDeniedModal.currentRole}</strong></div>
              <div>Required Role: <strong className="text-[#00E676]">{permissionDeniedModal.requiredRole}</strong></div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setPermissionDeniedModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD / EDIT PROJECT MODAL */}
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
              {/* Hidden file inputs for direct uploads */}
              <input
                type="file"
                ref={projectMediaInputRef}
                onChange={(e) => handleProjectFileUpload(e, 'cover')}
                accept="image/*,video/*"
                className="hidden"
              />
              <input
                type="file"
                ref={projectGalleryInputRef}
                onChange={(e) => handleProjectFileUpload(e, 'gallery')}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={projectVideoInputRef}
                onChange={(e) => handleProjectFileUpload(e, 'video')}
                accept="video/*"
                className="hidden"
              />

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Self-Driving Car Rental ERP"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="e.g. Automotive & Fleet ERP"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Project Type</label>
                  <input
                    type="text"
                    value={projectForm.projectType}
                    onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                    placeholder="e.g. Enterprise ERP / SaaS"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:border-[#00E676]"
                  />
                </div>
              </div>

              {/* COVER MEDIA (IMAGE / VIDEO) UPLOAD & PREVIEW */}
              <div className="p-4 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-mono text-white font-bold flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Project Cover Media (Image or Video) *</span>
                    </label>
                    <p className="text-[11px] font-mono text-[#64748B]">
                      Upload an image (PNG, JPG, WebP) or demo video (MP4, WebM) directly from your device.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={projectMediaUploading}
                      onClick={() => projectMediaInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center space-x-1.5 transition-opacity disabled:opacity-50 shadow-md shadow-[#00E676]/20"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{projectMediaUploading ? 'Uploading Media...' : 'Upload Image / Video'}</span>
                    </button>
                    {projectForm.image && (
                      <button
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, image: '' })}
                        className="px-2.5 py-1.5 rounded-lg bg-[#141D30] text-[#9AA3B8] hover:text-red-400 text-xs font-mono transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct URL Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="/assets/hackifypro-workspace.png or /uploads/my-video.mp4"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1624] border border-[#1E293B] text-xs text-white font-mono focus:border-[#00E676]"
                  />
                </div>

                {projectUploadError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{projectUploadError}</span>
                  </div>
                )}

                {/* Live Media Preview Box */}
                {projectForm.image && (
                  <div className="p-3 rounded-xl bg-[#0F1624] border border-[#1E293B] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#9AA3B8] flex items-center space-x-1">
                        {/\.(mp4|webm|mov|mkv|ogg)(\?.*)?$/i.test(projectForm.image) ? (
                          <>
                            <Film className="w-3.5 h-3.5 text-[#38BDF8]" />
                            <span className="text-[#38BDF8] font-bold">Video Asset Detected</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-[#00E676]" />
                            <span className="text-[#00E676] font-bold">Image Asset Detected</span>
                          </>
                        )}
                      </span>
                      <span className="text-[#64748B] truncate max-w-xs">{projectForm.image}</span>
                    </div>

                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                      {/\.(mp4|webm|mov|mkv|ogg)(\?.*)?$/i.test(projectForm.image) ? (
                        <video
                          src={projectForm.image}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={projectForm.image}
                          alt="Cover Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as any).src = '/assets/hackifypro-workspace.png';
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DEMO LINK SECTION */}
              <div className="p-4 rounded-2xl bg-[#080B12] border border-[#00E676]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#00E676] font-bold uppercase flex items-center space-x-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo Link / URL</span>
                  </label>
                  {projectForm.demoUrl && (
                    <a
                      href={projectForm.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#00E676] hover:underline flex items-center space-x-1"
                    >
                      <span>Test Demo Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={projectForm.demoUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                  placeholder="e.g. https://demo.hackifypro.com or /car-rental-software"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1624] border border-[#1E293B] text-xs text-white font-mono focus:border-[#00E676]"
                />
                <p className="text-[11px] font-mono text-[#64748B]">
                  Clients on your website can click directly to test this demo. External links (https://...) open in a new tab.
                </p>
              </div>

              {/* Deployment Status & Market */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Deployment Status</label>
                  <input
                    type="text"
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    placeholder="e.g. Live & Demonstration Ready"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Client / Target Audience</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g. Self-Drive Fleet Operators"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Market / Location</label>
                  <input
                    type="text"
                    value={projectForm.market}
                    onChange={(e) => setProjectForm({ ...projectForm, market: e.target.value })}
                    placeholder="e.g. Maharashtra & Pan-India"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white"
                  />
                </div>
              </div>

              {/* Summary & Problem Solved */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Project Summary *</label>
                  <textarea
                    rows={3}
                    required
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    placeholder="Brief 2-3 line overview of this application..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Problem Solved</label>
                  <textarea
                    rows={3}
                    value={projectForm.problemSolved}
                    onChange={(e) => setProjectForm({ ...projectForm, problemSolved: e.target.value })}
                    placeholder="What operational or business bottlenecks were resolved?"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white focus:border-[#00E676]"
                  />
                </div>
              </div>

              {/* Key Features & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA3B8] block mb-1">
                    Key Features (One feature per line)
                  </label>
                  <textarea
                    rows={4}
                    value={projectForm.mainFeaturesText}
                    onChange={(e) => setProjectForm({ ...projectForm, mainFeaturesText: e.target.value })}
                    placeholder="Instant Driving License KYC&#10;Visual fleet calendar&#10;Digital rental contracts"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-[#9AA3B8] block mb-1">
                      Tech Stack (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={projectForm.techStackText}
                      onChange={(e) => setProjectForm({ ...projectForm, techStackText: e.target.value })}
                      placeholder="Next.js 15, React 19, TypeScript, Firebase, Tailwind CSS"
                      className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-mono text-[#9AA3B8] block mb-1">Visibility</label>
                      <select
                        value={projectForm.visibility}
                        onChange={(e) => setProjectForm({ ...projectForm, visibility: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs text-white font-mono"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft (Hidden)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="featuredToggle"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="rounded border-[#1E293B] text-[#00E676] focus:ring-[#00E676] bg-[#080B12]"
                      />
                      <label htmlFor="featuredToggle" className="text-xs font-mono text-white cursor-pointer">
                        Featured on Home Page
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Gallery Screenshots & Demo Video Upload */}
              <div className="p-4 rounded-2xl bg-[#080B12] border border-[#1E293B] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-white font-bold block">
                      Extra Gallery Screenshots &amp; Videos (Optional)
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      Upload additional screenshots or demo video files for this project.
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={projectMediaUploading}
                      onClick={() => projectGalleryInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#141D30] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] text-xs font-mono flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Screenshot</span>
                    </button>
                    <button
                      type="button"
                      disabled={projectMediaUploading}
                      onClick={() => projectVideoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#141D30] hover:bg-[#1E293B] text-[#A78BFA] border border-[#1E293B] text-xs font-mono flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Video</span>
                    </button>
                  </div>
                </div>

                {/* Gallery List Preview */}
                {(projectForm.galleryItems?.length > 0 || projectForm.videoItems?.length > 0) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1E293B]">
                    {projectForm.galleryItems?.map((g, gIdx) => (
                      <div key={g.id || gIdx} className="relative group w-20 h-16 rounded-lg overflow-hidden border border-[#1E293B] bg-black">
                        <img src={g.url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProjectForm(prev => ({
                            ...prev,
                            galleryItems: prev.galleryItems.filter((_, i) => i !== gIdx)
                          }))}
                          className="absolute top-1 right-1 p-0.5 rounded bg-red-600 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {projectForm.videoItems?.map((v, vIdx) => (
                      <div key={v.id || vIdx} className="relative group w-24 h-16 rounded-lg overflow-hidden border border-[#A78BFA]/40 bg-black flex items-center justify-center">
                        <Film className="w-6 h-6 text-[#A78BFA]" />
                        <button
                          type="button"
                          onClick={() => setProjectForm(prev => ({
                            ...prev,
                            videoItems: prev.videoItems.filter((_, i) => i !== vIdx)
                          }))}
                          className="absolute top-1 right-1 p-0.5 rounded bg-red-600 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Submission Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#080B12] text-[#9AA3B8] font-mono text-xs hover:text-white border border-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={projectSubmitting || projectMediaUploading}
                  className="px-7 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#00E676]/20"
                >
                  {projectSubmitting ? 'Saving Project...' : isEditingProject ? 'Save Project Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3B: PREVIEW PROJECT CARD */}
      {/* ========================================================= */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1624] border border-[#1E293B] rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <span className="text-xs font-mono text-[#00E676] uppercase tracking-wider">{previewProject.category}</span>
                <h3 className="text-xl font-heading font-extrabold text-white mt-1">
                  {previewProject.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewProject(null)}
                className="p-2 rounded-xl bg-[#080B12] text-[#9AA3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-black border border-[#1E293B] flex items-center justify-center">
              {previewProject.image && /\.(mp4|webm|mov|mkv|ogg)(\?.*)?$/i.test(previewProject.image) ? (
                <video src={previewProject.image} controls className="w-full h-full object-contain" />
              ) : (
                <img
                  src={previewProject.image || '/assets/hackifypro-workspace.png'}
                  alt={previewProject.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Description & Problem Solved */}
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-[#E8EDF5]">{previewProject.summary}</p>
              {previewProject.problemSolved && (
                <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#1E293B]">
                  <strong className="text-[#38BDF8] block font-mono text-[11px] mb-1">Problem Solved:</strong>
                  <span className="text-[#9AA3B8]">{previewProject.problemSolved}</span>
                </div>
              )}
            </div>

            {/* Features */}
            {previewProject.mainFeatures && previewProject.mainFeatures.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-mono text-[#9AA3B8] uppercase block">Key Features</span>
                {previewProject.mainFeatures.map((f, i) => (
                  <div key={i} className="flex items-center space-x-2 text-[#E8EDF5]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack */}
            {previewProject.techStack && previewProject.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {previewProject.techStack.map((tech) => (
                  <span key={tech} className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#141D30] text-[#38BDF8] border border-[#1E293B]">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Footer with Demo Link */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E293B]">
              <span className="text-xs font-mono text-[#00E676]">{previewProject.status}</span>
              <div className="flex items-center space-x-3">
                {previewProject.demoUrl && (
                  <a
                    href={previewProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <span>Open Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setPreviewProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#080B12] text-xs font-mono text-[#9AA3B8] hover:text-white border border-[#1E293B]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: IN-USE WARNING FOR MEDIA DELETION */}
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
      {/* MODAL 5: LEAD DETAILS & INTERNAL NOTES MODAL */}
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
              {selectedLead.visitorId && (
                <div className="p-2 rounded-lg bg-[#080B12] border border-[#1E293B] font-mono text-[11px] text-[#A78BFA] flex items-center justify-between">
                  <span>Visitor ID: {selectedLead.visitorId.substring(0, 20)}...</span>
                  <button
                    onClick={() => {
                      const v = visitorsList.find((vis) => vis.visitorId === selectedLead.visitorId);
                      if (v) setSelectedVisitorDetail(v);
                      else alert(`Visitor Profile ${selectedLead.visitorId}`);
                    }}
                    className="text-[#00E676] hover:underline"
                  >
                    View Journey &rarr;
                  </button>
                </div>
              )}
            </div>

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
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold"
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
