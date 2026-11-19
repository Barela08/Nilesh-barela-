import fs from 'fs';
import path from 'path';
import { getDb } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { portfolioProjects, PortfolioProject } from '@/data/portfolio';

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
    console.debug(`[Firestore Sync Notice] Lead ${id} safely stored locally. Cloud sync:`, err?.message || err);
  }
}

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
  notes?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

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
  notes?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

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
  notes?: string;
  createdAt: string;
  ipAddress?: string;
  dpdpConsent?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  lastLogin: string;
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

// APPOINTMENTS
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
    return all[idx];
  },
};

// ENQUIRIES
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
    return all[idx];
  },
};

// QUOTES
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
    return all[idx];
  },
};

// PROJECTS & PORTFOLIO
export { type PortfolioProject };

export const dbProjects = {
  getAll: (): PortfolioProject[] => readData<PortfolioProject[]>('projects.json', portfolioProjects),
  getById: (id: string): PortfolioProject | undefined => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    return all.find((p) => p.id === id);
  },
  create: (item: Omit<PortfolioProject, 'id' | 'slug'> & { id?: string; slug?: string }): PortfolioProject => {
    const all = readData<PortfolioProject[]>('projects.json', portfolioProjects);
    const id = item.id || `PROJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProject: PortfolioProject = {
      ...item,
      id,
      slug,
      hasDemo: Boolean(item.demoUrl && item.demoUrl.trim().length > 0),
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
};
