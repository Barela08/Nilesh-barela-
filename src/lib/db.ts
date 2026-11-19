import fs from 'fs';
import path from 'path';

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
