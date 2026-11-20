import fs from 'fs';
import path from 'path';
import { getDb } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { portfolioProjects, PortfolioProject, ProjectGalleryImage, ProjectVideo, ProjectExternalLink } from '@/data/portfolio';
import { company } from '@/data/company';
import { founderData } from '@/data/founder';
import { servicesData } from '@/data/services';

function stripUndefined(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, typeof v === 'object' && !Array.isArray(v) && v !== null ? stripUndefined(v) : v])
  );
}

async function mirrorToFirestore(collName: string, id: string, data: any) {
  try {
    const db = getDb();
    if (!db) return;
    const docRef = doc(db, collName, id);
    await setDoc(docRef, { ...stripUndefined(data), updatedAt: new Date().toISOString() });
    console.log(`[Firestore Sync] Mirrored ${collName}/${id}`);
  } catch (err: any) {
    console.debug(`[Firestore Sync Notice] Data ${id} safely stored locally. Cloud sync:`, err?.message || err);
  }
}

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

function readData<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      writeData(filename, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeData<T>(filename: string, data: T): void {
  try {
    const filePath = getFilePath(filename);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// -------------------------------------------------------------
// 1. APPOINTMENTS
// -------------------------------------------------------------
export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceRequired: string;
  preferredDate: string;
  preferredTime: string;
  projectBudget?: string;
  projectDescription: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  meetingLink?: string;
  followUpDate?: string;
  isRead?: boolean;
  visitorId?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

export const dbAppointments = {
  getAll: (): Appointment[] => readData<Appointment[]>('appointments.json', []),
  getById: (id: string): Appointment | undefined => {
    const all = readData<Appointment[]>('appointments.json', []);
    return all.find((a) => a.id === id);
  },
  create: (item: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const all = readData<Appointment[]>('appointments.json', []);
    const id = `APT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const newAppointment: Appointment = {
      ...item,
      id,
      status: 'new',
      priority: 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newAppointment);
    writeData('appointments.json', all);
    mirrorToFirestore('appointments', id, newAppointment).catch(() => {});
    return newAppointment;
  },
  updateStatus: (id: string, status: Appointment['status'], notes?: string): Appointment | null => {
    const all = readData<Appointment[]>('appointments.json', []);
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx].status = status;
    if (notes !== undefined) all[idx].notes = notes;
    writeData('appointments.json', all);
    mirrorToFirestore('appointments', id, all[idx]).catch(() => {});
    return all[idx];
  },
  updateDetails: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const all = readData<Appointment[]>('appointments.json', []);
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('appointments.json', all);
    mirrorToFirestore('appointments', id, all[idx]).catch(() => {});
    return all[idx];
  },
  delete: (id: string): boolean => {
    const all = readData<Appointment[]>('appointments.json', []);
    const filtered = all.filter((a) => a.id !== id);
    if (filtered.length === all.length) return false;
    writeData('appointments.json', filtered);
    return true;
  }
};

// -------------------------------------------------------------
// 2. ENQUIRIES
// -------------------------------------------------------------
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  interestedService: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  followUpDate?: string;
  isRead?: boolean;
  isSpam?: boolean;
  visitorId?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

export const dbEnquiries = {
  getAll: (): Enquiry[] => readData<Enquiry[]>('enquiries.json', []),
  getById: (id: string): Enquiry | undefined => {
    const all = readData<Enquiry[]>('enquiries.json', []);
    return all.find((e) => e.id === id);
  },
  create: (item: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
    const all = readData<Enquiry[]>('enquiries.json', []);
    const id = `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const newEnquiry: Enquiry = {
      ...item,
      id,
      status: 'new',
      priority: 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newEnquiry);
    writeData('enquiries.json', all);
    mirrorToFirestore('enquiries', id, newEnquiry).catch(() => {});
    return newEnquiry;
  },
  updateStatus: (id: string, status: Enquiry['status'], notes?: string): Enquiry | null => {
    const all = readData<Enquiry[]>('enquiries.json', []);
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    all[idx].status = status;
    if (notes !== undefined) all[idx].notes = notes;
    writeData('enquiries.json', all);
    mirrorToFirestore('enquiries', id, all[idx]).catch(() => {});
    return all[idx];
  },
  updateDetails: (id: string, updates: Partial<Enquiry>): Enquiry | null => {
    const all = readData<Enquiry[]>('enquiries.json', []);
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('enquiries.json', all);
    mirrorToFirestore('enquiries', id, all[idx]).catch(() => {});
    return all[idx];
  },
  delete: (id: string): boolean => {
    const all = readData<Enquiry[]>('enquiries.json', []);
    const filtered = all.filter((e) => e.id !== id);
    if (filtered.length === all.length) return false;
    writeData('enquiries.json', filtered);
    return true;
  }
};

// -------------------------------------------------------------
// 3. QUOTES
// -------------------------------------------------------------
export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  requiredService: string;
  projectScope: string;
  estimatedBudget: string;
  expectedTimeline: string;
  additionalRequirements?: string;
  status: 'new' | 'estimating' | 'proposal_sent' | 'accepted' | 'declined';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  followUpDate?: string;
  isRead?: boolean;
  visitorId?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

export const dbQuotes = {
  getAll: (): QuoteRequest[] => readData<QuoteRequest[]>('quotes.json', []),
  getById: (id: string): QuoteRequest | undefined => {
    const all = readData<QuoteRequest[]>('quotes.json', []);
    return all.find((q) => q.id === id);
  },
  create: (item: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): QuoteRequest => {
    const all = readData<QuoteRequest[]>('quotes.json', []);
    const id = `QUO-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const newQuote: QuoteRequest = {
      ...item,
      id,
      status: 'new',
      priority: 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newQuote);
    writeData('quotes.json', all);
    mirrorToFirestore('quotes', id, newQuote).catch(() => {});
    return newQuote;
  },
  updateStatus: (id: string, status: QuoteRequest['status'], notes?: string): QuoteRequest | null => {
    const all = readData<QuoteRequest[]>('quotes.json', []);
    const idx = all.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    all[idx].status = status;
    if (notes !== undefined) all[idx].notes = notes;
    writeData('quotes.json', all);
    mirrorToFirestore('quotes', id, all[idx]).catch(() => {});
    return all[idx];
  },
  updateDetails: (id: string, updates: Partial<QuoteRequest>): QuoteRequest | null => {
    const all = readData<QuoteRequest[]>('quotes.json', []);
    const idx = all.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    writeData('quotes.json', all);
    mirrorToFirestore('quotes', id, all[idx]).catch(() => {});
    return all[idx];
  },
  delete: (id: string): boolean => {
    const all = readData<QuoteRequest[]>('quotes.json', []);
    const filtered = all.filter((q) => q.id !== id);
    if (filtered.length === all.length) return false;
    writeData('quotes.json', filtered);
    return true;
  }
};

// -------------------------------------------------------------
// 4. PROJECTS & PORTFOLIO
// -------------------------------------------------------------
export { type PortfolioProject, type ProjectGalleryImage, type ProjectVideo, type ProjectExternalLink };

export const dbProjects = {
  getAll: (): PortfolioProject[] => {
    const projects = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    return projects.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  },
  getPublished: (): PortfolioProject[] => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    return all
      .filter((p) => !p.visibility || p.visibility === 'published')
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  },
  getById: (id: string): PortfolioProject | undefined => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    return all.find((p) => p.id === id);
  },
  getBySlug: (slug: string): PortfolioProject | undefined => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    return all.find((p) => p.slug === slug);
  },
  create: (item: Partial<PortfolioProject> & { title: string }): PortfolioProject => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const id = item.id || `PROJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newProject: PortfolioProject = {
      id,
      slug,
      title: item.title,
      category: item.category || 'Web Application & SaaS',
      summary: item.summary || '',
      client: item.client || 'HackifyPro Enterprise Client',
      market: item.market || 'India & Global',
      problemSolved: item.problemSolved || '',
      mainFeatures: item.mainFeatures || [],
      techStack: item.techStack || ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      image: item.image || '/assets/hackifypro-workspace.png',
      demoUrl: item.demoUrl || '',
      hasDemo: Boolean(item.demoUrl && item.demoUrl.trim().length > 0),
      status: item.status || 'Live & Deployed Demonstration',
      projectType: item.projectType || 'Web Application',
      targetAudience: item.targetAudience || 'Modern Businesses',
      visibility: item.visibility || 'published',
      featured: item.featured ?? true,
      completionDate: item.completionDate || new Date().toISOString().split('T')[0],
      location: item.location || 'Maharashtra, India',
      gallery: item.gallery || [],
      videos: item.videos || [],
      shortDescription: item.shortDescription || item.summary || '',
      fullDescription: item.fullDescription || '',
      githubUrl: item.githubUrl || '',
      externalUrls: item.externalUrls || [],
      seoTitle: item.seoTitle || `${item.title} | HackifyPro Project`,
      seoDescription: item.seoDescription || item.summary || '',
      displayOrder: item.displayOrder ?? (all.length + 1),
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newProject);
    writeData('projects.json', all);
    mirrorToFirestore('projects', id, newProject).catch(() => {});
    return newProject;
  },
  update: (id: string, updates: Partial<PortfolioProject>): PortfolioProject | null => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const current = all[idx];
    const demoUrl = updates.demoUrl !== undefined ? updates.demoUrl : current.demoUrl;
    
    const updated: PortfolioProject = {
      ...current,
      ...updates,
      id,
      hasDemo: Boolean(demoUrl && demoUrl.trim().length > 0),
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    writeData('projects.json', all);
    mirrorToFirestore('projects', id, updated).catch(() => {});
    return updated;
  },
  delete: (id: string): boolean => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const initialLen = all.length;
    const filtered = all.filter((p) => p.id !== id);
    if (filtered.length === initialLen) return false;
    writeData('projects.json', filtered);
    return true;
  },
  reorder: (orderedIds: string[]): PortfolioProject[] => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const idMap = new Map(all.map((p) => [p.id, p]));
    const reordered: PortfolioProject[] = [];
    
    orderedIds.forEach((id, index) => {
      const proj = idMap.get(id);
      if (proj) {
        proj.displayOrder = index + 1;
        reordered.push(proj);
        idMap.delete(id);
      }
    });

    // Add any missing
    idMap.forEach((proj) => {
      proj.displayOrder = reordered.length + 1;
      reordered.push(proj);
    });

    writeData('projects.json', reordered);
    return reordered;
  },
  incrementViews: (id: string): void => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      all[idx].viewsCount = (all[idx].viewsCount || 0) + 1;
      writeData('projects.json', all);
    }
  }
};

// -------------------------------------------------------------
// 5. MEDIA MANAGER
// -------------------------------------------------------------
export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  storagePath: string;
  mediaType: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  fileSize: number; // in bytes
  width?: number;
  height?: number;
  title?: string;
  altText?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-logo-icon',
    filename: 'hackifypro-icon.png',
    url: '/assets/hackifypro-icon.png',
    storagePath: 'public/assets/hackifypro-icon.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 45200,
    width: 512,
    height: 512,
    title: 'HackifyPro App Icon',
    altText: 'HackifyPro Transparent Shield Icon',
    caption: 'Official App Icon & Favicon',
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'med-logo-full',
    filename: 'hackifypro-logo.png',
    url: '/assets/hackifypro-logo.png',
    storagePath: 'public/assets/hackifypro-logo.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 68400,
    width: 1024,
    height: 280,
    title: 'HackifyPro Wordmark Logo',
    altText: 'HackifyPro Official Header Wordmark',
    caption: 'Website Header & Brand Identity',
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'med-shield',
    filename: 'hackifypro-shield.png',
    url: '/assets/hackifypro-shield.png',
    storagePath: 'public/assets/hackifypro-shield.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 52100,
    width: 600,
    height: 720,
    title: 'HackifyPro Security Shield',
    altText: 'Cybersecurity Shield Badge',
    caption: 'Hero Section Brand Emblem',
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'med-nilesh',
    filename: 'nilesh-barela.jpg',
    url: '/assets/nilesh-barela.jpg',
    storagePath: 'public/assets/nilesh-barela.jpg',
    mediaType: 'image',
    mimeType: 'image/jpeg',
    fileSize: 124000,
    width: 800,
    height: 800,
    title: 'Nilesh Barela Founder Profile',
    altText: 'Nilesh Barela - Founder & Lead Developer',
    caption: 'Founder Portrait for About & Bio',
    createdAt: '2026-11-10T12:00:00.000Z',
    updatedAt: '2026-11-10T12:00:00.000Z'
  },
  {
    id: 'med-storefront',
    filename: 'hackifypro-storefront.png',
    url: '/assets/hackifypro-storefront.png',
    storagePath: 'public/assets/hackifypro-storefront.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 312000,
    width: 1200,
    height: 750,
    title: 'Commercial Platform Showcase',
    altText: 'HackifyPro Web Storefront',
    caption: 'Portfolio Project 3 Showcase',
    createdAt: '2026-11-12T14:00:00.000Z',
    updatedAt: '2026-11-12T14:00:00.000Z'
  },
  {
    id: 'med-workspace',
    filename: 'hackifypro-workspace.png',
    url: '/assets/hackifypro-workspace.png',
    storagePath: 'public/assets/hackifypro-workspace.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 285000,
    width: 1200,
    height: 750,
    title: 'HMS Hospital Management System',
    altText: 'Hospital Management Software Mockup',
    caption: 'Portfolio Project 1 Showcase',
    createdAt: '2026-11-12T14:00:00.000Z',
    updatedAt: '2026-11-12T14:00:00.000Z'
  },
  {
    id: 'med-office',
    filename: 'hackifypro-office.png',
    url: '/assets/hackifypro-office.png',
    storagePath: 'public/assets/hackifypro-office.png',
    mediaType: 'image',
    mimeType: 'image/png',
    fileSize: 298000,
    width: 1200,
    height: 750,
    title: 'LeadSaathi PRO Workspace',
    altText: 'LeadSaathi CRM Platform Mockup',
    caption: 'Portfolio Project 2 Showcase',
    createdAt: '2026-11-12T14:00:00.000Z',
    updatedAt: '2026-11-12T14:00:00.000Z'
  }
];

export const dbMedia = {
  getAll: (): MediaItem[] => {
    return readData<MediaItem[]>('media.json', DEFAULT_MEDIA_ITEMS);
  },
  getById: (id: string): MediaItem | undefined => {
    const all = readData<MediaItem[]>('media.json', DEFAULT_MEDIA_ITEMS);
    return all.find((m) => m.id === id);
  },
  create: (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>): MediaItem => {
    const all = readData<MediaItem[]>('media.json', DEFAULT_MEDIA_ITEMS);
    const id = `med-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`;
    const newItem: MediaItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newItem);
    writeData('media.json', all);
    mirrorToFirestore('media', id, newItem).catch(() => {});
    return newItem;
  },
  update: (id: string, updates: Partial<MediaItem>): MediaItem | null => {
    const all = readData<MediaItem[]>('media.json', DEFAULT_MEDIA_ITEMS);
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeData('media.json', all);
    mirrorToFirestore('media', id, all[idx]).catch(() => {});
    return all[idx];
  },
  delete: (id: string): boolean => {
    const all = readData<MediaItem[]>('media.json', DEFAULT_MEDIA_ITEMS);
    const item = all.find((m) => m.id === id);
    if (!item) return false;

    // Delete local file if it's in public/uploads/
    if (item.url.startsWith('/uploads/')) {
      const fullPath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error('Failed to unlink file:', fullPath, e);
        }
      }
    }

    const filtered = all.filter((m) => m.id !== id);
    writeData('media.json', filtered);
    return true;
  },
  checkInUse: (mediaUrl: string): { inUse: boolean; references: string[] } => {
    const references: string[] = [];
    const projects = dbProjects.getAll();
    
    // Check projects cover image & galleries
    projects.forEach((p) => {
      if (p.image === mediaUrl) {
        references.push(`Project "${p.title}" (Cover Image)`);
      }
      if (p.gallery) {
        p.gallery.forEach((g) => {
          if (g.url === mediaUrl) {
            references.push(`Project "${p.title}" (Gallery Image)`);
          }
        });
      }
      if (p.videos) {
        p.videos.forEach((v) => {
          if (v.poster === mediaUrl || v.url === mediaUrl) {
            references.push(`Project "${p.title}" (Video Resource)`);
          }
        });
      }
    });

    // Check founder profile
    const content = dbSiteContent.get();
    if (content.founder.image === mediaUrl) {
      references.push('Founder Profile Portrait');
    }
    if (content.homepage.heroImage === mediaUrl) {
      references.push('Homepage Hero Section');
    }

    return {
      inUse: references.length > 0,
      references
    };
  }
};

// -------------------------------------------------------------
// 6. SITE CONTENT & LINKS
// -------------------------------------------------------------
export interface ManagedLink {
  id: string;
  key: string;
  label: string;
  url: string;
  category: 'social' | 'contact' | 'nav' | 'cta' | 'external';
  enabled: boolean;
  openInNewTab: boolean;
  order: number;
}

export interface SiteContent {
  links: ManagedLink[];
  founder: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    image: string;
    bio: string;
    email: string;
    secondaryEmail: string;
    phone: string;
    resumeUrl: string;
    availability: string;
    visibility: boolean;
    skills: string[];
    education: string;
    experience: string;
  };
  services: {
    id: string;
    slug: string;
    title: string;
    h1: string;
    shortDesc: string;
    iconName: string;
    displayOrder: number;
    visibility: boolean;
    metaTitle: string;
    metaDesc: string;
  }[];
  homepage: {
    badge: string;
    headingLine1: string;
    headingGradient: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
    heroImage: string;
  };
  sectionsVisibility: {
    hero: boolean;
    services: boolean;
    projects: boolean;
    founder: boolean;
    products: boolean;
    testimonials: boolean;
    contact: boolean;
    faq: boolean;
    blog: boolean;
  };
}

const DEFAULT_LINKS: ManagedLink[] = [
  { id: 'lnk-wa', key: 'whatsapp', label: 'WhatsApp Chat', url: 'https://wa.me/917414935405', category: 'contact', enabled: true, openInNewTab: true, order: 1 },
  { id: 'lnk-li', key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/nilesh-barels08/', category: 'social', enabled: true, openInNewTab: true, order: 2 },
  { id: 'lnk-ig', key: 'instagram', label: 'Instagram (Personal)', url: 'https://www.instagram.com/_https_nilesh08/', category: 'social', enabled: true, openInNewTab: true, order: 3 },
  { id: 'lnk-ig-co', key: 'companyInstagram', label: 'Instagram (Company)', url: 'https://www.instagram.com/hackifypro_web/', category: 'social', enabled: true, openInNewTab: true, order: 4 },
  { id: 'lnk-x', key: 'x', label: 'X (Twitter)', url: 'https://x.com/NileshBarela6', category: 'social', enabled: true, openInNewTab: true, order: 5 },
  { id: 'lnk-gh', key: 'github', label: 'GitHub Repository', url: 'https://github.com/Barela08', category: 'social', enabled: true, openInNewTab: true, order: 6 },
  { id: 'lnk-em1', key: 'emailPrimary', label: 'Primary Email', url: 'mailto:hackifypro@gmail.com', category: 'contact', enabled: true, openInNewTab: false, order: 7 },
  { id: 'lnk-em2', key: 'emailSecondary', label: 'Founder Direct Email', url: 'mailto:barelanilesh483@gmail.com', category: 'contact', enabled: true, openInNewTab: false, order: 8 },
  { id: 'lnk-apt', key: 'bookAppointment', label: 'Book Consultation', url: '/appointment', category: 'cta', enabled: true, openInNewTab: false, order: 9 },
  { id: 'lnk-quo', key: 'requestQuote', label: 'Get Free Estimate', url: '/request-quote', category: 'cta', enabled: true, openInNewTab: false, order: 10 },
  { id: 'lnk-res', key: 'resume', label: 'Download Resume', url: '/assets/nilesh-barela-resume.pdf', category: 'cta', enabled: false, openInNewTab: true, order: 11 }
];

const DEFAULT_SITE_CONTENT: SiteContent = {
  links: DEFAULT_LINKS,
  founder: {
    name: founderData.name,
    role: founderData.role,
    tagline: founderData.tagline,
    location: founderData.location,
    image: founderData.image,
    bio: founderData.bio,
    email: company.founder.emails[0],
    secondaryEmail: company.founder.emails[1],
    phone: company.contact.phone,
    resumeUrl: '/assets/nilesh-barela-resume.pdf',
    availability: 'Open for Select Custom Projects & Strategic Consulting',
    visibility: true,
    skills: ['React', 'Next.js', 'Android (Kotlin/Java)', 'Python', 'TypeScript', 'Node.js', 'Cybersecurity', 'Cloud Infrastructure'],
    education: 'Bachelor of Computer Applications (BCA)',
    experience: 'Founder & Full-Stack Engineer at HackifyPro'
  },
  services: servicesData.map((s, idx) => ({
    id: `srv-${s.slug}`,
    slug: s.slug,
    title: s.title,
    h1: s.h1,
    shortDesc: s.shortDesc,
    iconName: s.iconName,
    displayOrder: idx + 1,
    visibility: true,
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc
  })),
  homepage: {
    badge: 'WEBSITES • ANDROID APPS • CUSTOM BUSINESS SOFTWARE',
    headingLine1: 'We Build Websites, Android Apps & Custom Software',
    headingGradient: 'That Grow Your Business.',
    description: 'HackifyPro is a modern technology & software development company in Maharashtra. We build fast, search-optimized business websites, native Android applications, web applications, and complete management software for modern businesses.',
    ctaText: 'Book Free Discovery Call',
    ctaUrl: '/appointment',
    secondaryCtaText: 'Request Free Quote',
    secondaryCtaUrl: '/request-quote',
    heroImage: '/assets/hackifypro-shield.png'
  },
  sectionsVisibility: {
    hero: true,
    services: true,
    projects: true,
    founder: true,
    products: true,
    testimonials: true,
    contact: true,
    faq: true,
    blog: true
  }
};

export const dbSiteContent = {
  get: (): SiteContent => {
    return readData<SiteContent>('site_content.json', DEFAULT_SITE_CONTENT);
  },
  update: (updates: Partial<SiteContent>): SiteContent => {
    const current = readData<SiteContent>('site_content.json', DEFAULT_SITE_CONTENT);
    const updated: SiteContent = {
      ...current,
      ...updates,
      homepage: { ...current.homepage, ...(updates.homepage || {}) },
      founder: { ...current.founder, ...(updates.founder || {}) },
      sectionsVisibility: { ...current.sectionsVisibility, ...(updates.sectionsVisibility || {}) },
      links: updates.links || current.links,
      services: updates.services || current.services,
    };
    writeData('site_content.json', updated);
    mirrorToFirestore('settings', 'site_content', updated).catch(() => {});
    return updated;
  }
};

// -------------------------------------------------------------
// 7. VISITOR ANALYTICS
// -------------------------------------------------------------
export interface AnalyticsEvent {
  id: string;
  visitorId: string;
  sessionId: string;
  type: 'pageview' | 'heartbeat' | 'conversion';
  path: string;
  title?: string;
  referrer?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string;
  durationSeconds?: number;
}

export interface ActiveSession {
  sessionId: string;
  visitorId: string;
  currentPath: string;
  entryPath: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  startedAt: string;
  lastHeartbeat: string;
  totalPageviews: number;
}

export const dbAnalytics = {
  recordEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent => {
    const events = readData<AnalyticsEvent[]>('analytics_events.json', []);
    const sessions = readData<Record<string, ActiveSession>>('analytics_sessions.json', {});
    
    const now = new Date().toISOString();
    const id = `ev-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`;
    
    const newEvent: AnalyticsEvent = {
      ...event,
      id,
      timestamp: now,
    };

    // Update active session
    const currentSession = sessions[event.sessionId];
    if (currentSession) {
      currentSession.currentPath = event.path;
      currentSession.lastHeartbeat = now;
      if (event.type === 'pageview') {
        currentSession.totalPageviews += 1;
      }
    } else {
      sessions[event.sessionId] = {
        sessionId: event.sessionId,
        visitorId: event.visitorId,
        currentPath: event.path,
        entryPath: event.path,
        device: event.device,
        browser: event.browser,
        os: event.os,
        startedAt: now,
        lastHeartbeat: now,
        totalPageviews: 1,
      };
    }

    // Keep events list clean (max 5000 recent events)
    events.unshift(newEvent);
    if (events.length > 5000) {
      events.length = 5000;
    }

    // Clean up expired sessions (> 10 minutes inactive)
    const tenMinAgo = Date.now() - 10 * 60 * 1000;
    Object.keys(sessions).forEach((sid) => {
      const hb = new Date(sessions[sid].lastHeartbeat).getTime();
      if (hb < tenMinAgo) {
        delete sessions[sid];
      }
    });

    writeData('analytics_events.json', events);
    writeData('analytics_sessions.json', sessions);

    return newEvent;
  },

  getLiveVisitors: (): ActiveSession[] => {
    const sessions = readData<Record<string, ActiveSession>>('analytics_sessions.json', {});
    const threeMinAgo = Date.now() - 3 * 60 * 1000; // active in last 3 min
    return Object.values(sessions).filter((s) => new Date(s.lastHeartbeat).getTime() >= threeMinAgo);
  },

  getStats: (range: 'today' | '7d' | '30d' | '90d' | 'all' = '7d') => {
    const events = readData<AnalyticsEvent[]>('analytics_events.json', []);
    const sessions = readData<Record<string, ActiveSession>>('analytics_sessions.json', {});
    
    const now = new Date();
    let cutoff = new Date(0); // 'all'
    if (range === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === '90d') {
      cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }

    const filteredEvents = events.filter((e) => new Date(e.timestamp) >= cutoff);
    const todayCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEvents = events.filter((e) => new Date(e.timestamp) >= todayCutoff);

    const pageviews = filteredEvents.filter((e) => e.type === 'pageview');
    const uniqueVisitors = new Set(filteredEvents.map((e) => e.visitorId)).size;
    const todayVisitors = new Set(todayEvents.map((e) => e.visitorId)).size;
    const totalVisitorsAllTime = new Set(events.map((e) => e.visitorId)).size;

    // Returning visitors
    const visitorVisitCount = new Map<string, number>();
    events.forEach((e) => {
      visitorVisitCount.set(e.visitorId, (visitorVisitCount.get(e.visitorId) || 0) + 1);
    });
    const returningVisitors = Array.from(new Set(filteredEvents.map((e) => e.visitorId)))
      .filter((vId) => (visitorVisitCount.get(vId) || 0) > 1).length;

    // Device breakdown
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    filteredEvents.forEach((e) => {
      if (e.device === 'mobile') devices.mobile++;
      else if (e.device === 'tablet') devices.tablet++;
      else devices.desktop++;
    });

    // Top Pages
    const pageCounts = new Map<string, number>();
    pageviews.forEach((e) => {
      pageCounts.set(e.path, (pageCounts.get(e.path) || 0) + 1);
    });
    const topPages = Array.from(pageCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top Projects viewed (paths starting with /portfolio or matching project slugs)
    const projectViews = new Map<string, number>();
    pageviews.forEach((e) => {
      if (e.path.includes('/portfolio') || e.path.includes('hospital') || e.path.includes('leadsaathi') || e.path.includes('car-rental')) {
        projectViews.set(e.path, (projectViews.get(e.path) || 0) + 1);
      }
    });
    const topProjects = Array.from(projectViews.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Referrers
    const referrerCounts = new Map<string, number>();
    filteredEvents.forEach((e) => {
      if (e.referrer && e.referrer.trim().length > 0 && !e.referrer.includes(process.env.NEXT_PUBLIC_SITE_URL || 'localhost')) {
        try {
          const domain = new URL(e.referrer).hostname;
          referrerCounts.set(domain, (referrerCounts.get(domain) || 0) + 1);
        } catch {
          referrerCounts.set(e.referrer, (referrerCounts.get(e.referrer) || 0) + 1);
        }
      } else {
        referrerCounts.set('Direct / Organic Search', (referrerCounts.get('Direct / Organic Search') || 0) + 1);
      }
    });
    const topReferrers = Array.from(referrerCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Timeline breakdown (e.g. daily counts)
    const dailyMap = new Map<string, { visitors: Set<string>; pageviews: number }>();
    filteredEvents.forEach((e) => {
      const day = e.timestamp.split('T')[0];
      if (!dailyMap.has(day)) {
        dailyMap.set(day, { visitors: new Set(), pageviews: 0 });
      }
      const item = dailyMap.get(day)!;
      item.visitors.add(e.visitorId);
      if (e.type === 'pageview') {
        item.pageviews++;
      }
    });

    const timeline = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        visitors: data.visitors.size,
        pageviews: data.pageviews,
      }));

    // Live Visitors
    const threeMinAgo = Date.now() - 3 * 60 * 1000;
    const liveSessions = Object.values(sessions).filter((s) => new Date(s.lastHeartbeat).getTime() >= threeMinAgo);

    return {
      range,
      totalVisitors: totalVisitorsAllTime,
      periodVisitors: uniqueVisitors,
      todayVisitors,
      totalPageViews: pageviews.length,
      returningVisitors,
      newVisitors: Math.max(0, uniqueVisitors - returningVisitors),
      liveVisitorsCount: liveSessions.length,
      liveVisitors: liveSessions,
      devices,
      topPages,
      topProjects,
      topReferrers,
      timeline,
    };
  }
};

// -------------------------------------------------------------
// 8. ADMIN ACTIVITY LOGS
// -------------------------------------------------------------
export interface AdminActivityLog {
  id: string;
  action: string;
  targetType: 'project' | 'media' | 'content' | 'lead' | 'auth' | 'system';
  targetId?: string;
  description: string;
  adminEmail: string;
  ipAddress?: string;
  timestamp: string;
}

export const dbAdminActivity = {
  log: (item: Omit<AdminActivityLog, 'id' | 'timestamp'>): AdminActivityLog => {
    const logs = readData<AdminActivityLog[]>('admin_activity.json', []);
    const id = `act-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`;
    const newLog: AdminActivityLog = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 500) {
      logs.length = 500;
    }
    writeData('admin_activity.json', logs);
    mirrorToFirestore('admin_logs', id, newLog).catch(() => {});
    return newLog;
  },
  getAll: (limit = 100): AdminActivityLog[] => {
    const logs = readData<AdminActivityLog[]>('admin_activity.json', []);
    return logs.slice(0, limit);
  }
};
