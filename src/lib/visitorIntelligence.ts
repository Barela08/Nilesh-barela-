import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export type EngagementLabel =
  | 'New Visitor'
  | 'Returning Visitor'
  | 'Engaged Visitor'
  | 'Inquiry Submitted'
  | 'Appointment Booked'
  | 'Quote Requested';

export interface VisitorSessionSummary {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  entryPath: string;
  exitPath: string;
  pageviews: number;
  pages: string[];
  projects: string[];
}

export interface VisitorInteraction {
  id: string;
  type: 'whatsapp_click' | 'phone_click' | 'email_click' | 'demo_click' | 'appointment_cta' | 'quote_cta';
  targetUrl: string;
  page: string;
  timestamp: string;
}

export interface VisitorConversion {
  id: string;
  formType: 'appointment' | 'enquiry' | 'quote';
  leadId: string;
  timestamp: string;
}

export interface VisitorProfile {
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  totalVisits: number; // Distinct visit sessions
  totalSessions: number;
  totalPageViews: number;
  isReturning: boolean;
  engagementLabel: EngagementLabel;
  pagesVisited: string[];
  projectPagesVisited: string[];
  deviceCategory: 'desktop' | 'mobile' | 'tablet';
  browserCategory: string;
  osCategory: string;
  trafficSource: string;
  referrer?: string;
  location?: string;
  sessions: VisitorSessionSummary[];
  interactions: VisitorInteraction[];
  conversions: VisitorConversion[];
}

export interface FormConversionRecord {
  id: string;
  visitorId: string;
  sessionId: string;
  formType: 'appointment' | 'enquiry' | 'quote';
  formPage: string;
  stage: 'viewed' | 'started' | 'abandoned' | 'submitted' | 'failed';
  leadId?: string;
  timestamp: string;
}

function getVisitorsFilePath(): string {
  return path.join(DATA_DIR, 'visitors.json');
}

function getConversionsFilePath(): string {
  return path.join(DATA_DIR, 'form_conversions.json');
}

function readData<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      writeData(filePath, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeData<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export const dbVisitorIntelligence = {
  /**
   * Records pageview or heartbeat event into visitor intelligence profile.
   */
  recordVisit: (params: {
    visitorId: string;
    sessionId: string;
    path: string;
    title?: string;
    referrer?: string;
    device: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
    location?: string;
  }): VisitorProfile => {
    const visitors = readData<Record<string, VisitorProfile>>(getVisitorsFilePath(), {});
    const now = new Date().toISOString();
    const nowMs = Date.now();

    let visitor = visitors[params.visitorId];
    const isNewVisitor = !visitor;

    if (isNewVisitor) {
      visitor = {
        visitorId: params.visitorId,
        firstSeen: now,
        lastSeen: now,
        totalVisits: 1,
        totalSessions: 1,
        totalPageViews: 1,
        isReturning: false,
        engagementLabel: 'New Visitor',
        pagesVisited: [params.path],
        projectPagesVisited: [],
        deviceCategory: params.device,
        browserCategory: params.browser || 'Unknown',
        osCategory: params.os || 'Unknown',
        trafficSource: params.referrer && !params.referrer.includes('nileshbarela') ? 'Referral' : 'Direct / Organic',
        referrer: params.referrer,
        location: params.location || 'India (Approximate)',
        sessions: [
          {
            sessionId: params.sessionId,
            startedAt: now,
            endedAt: now,
            durationSeconds: 1,
            entryPath: params.path,
            exitPath: params.path,
            pageviews: 1,
            pages: [params.path],
            projects: [],
          },
        ],
        interactions: [],
        conversions: [],
      };
    } else {
      // Returning visitor
      const lastSeenMs = new Date(visitor.lastSeen).getTime();
      const thirtyMinutesMs = 30 * 60 * 1000;
      const isNewSession = nowMs - lastSeenMs > thirtyMinutesMs;

      visitor.lastSeen = now;
      visitor.totalPageViews += 1;

      // Update pages visited list
      if (!visitor.pagesVisited.includes(params.path)) {
        visitor.pagesVisited.push(params.path);
      }

      // Check if project path
      if (params.path.includes('/portfolio/') || params.path.includes('hospital') || params.path.includes('leadsaathi')) {
        const seg = params.path.split('/').filter(Boolean).pop() || params.path;
        if (!visitor.projectPagesVisited.includes(seg)) {
          visitor.projectPagesVisited.push(seg);
        }
      }

      // Check session
      let currentSession = visitor.sessions.find((s) => s.sessionId === params.sessionId);
      if (!currentSession || isNewSession) {
        visitor.totalVisits += 1;
        visitor.totalSessions += 1;
        visitor.isReturning = true;
        currentSession = {
          sessionId: params.sessionId,
          startedAt: now,
          endedAt: now,
          durationSeconds: 1,
          entryPath: params.path,
          exitPath: params.path,
          pageviews: 1,
          pages: [params.path],
          projects: [],
        };
        visitor.sessions.unshift(currentSession);
      } else {
        currentSession.endedAt = now;
        currentSession.exitPath = params.path;
        currentSession.pageviews += 1;
        if (!currentSession.pages.includes(params.path)) {
          currentSession.pages.push(params.path);
        }
        const sessionStartMs = new Date(currentSession.startedAt).getTime();
        currentSession.durationSeconds = Math.max(1, Math.round((nowMs - sessionStartMs) / 1000));
      }

      // Recalculate engagement label
      if (visitor.conversions.length > 0) {
        const lastConv = visitor.conversions[visitor.conversions.length - 1];
        if (lastConv.formType === 'appointment') visitor.engagementLabel = 'Appointment Booked';
        else if (lastConv.formType === 'quote') visitor.engagementLabel = 'Quote Requested';
        else visitor.engagementLabel = 'Inquiry Submitted';
      } else if (visitor.totalVisits >= 3 || visitor.totalPageViews >= 6) {
        visitor.engagementLabel = 'Engaged Visitor';
      } else if (visitor.totalVisits > 1) {
        visitor.engagementLabel = 'Returning Visitor';
      } else {
        visitor.engagementLabel = 'New Visitor';
      }
    }

    visitors[params.visitorId] = visitor;
    writeData(getVisitorsFilePath(), visitors);
    return visitor;
  },

  /**
   * Records user interaction clicks (WhatsApp, Call, Email, Demo link).
   */
  recordInteraction: (params: {
    visitorId: string;
    type: VisitorInteraction['type'];
    targetUrl: string;
    page: string;
  }): void => {
    const visitors = readData<Record<string, VisitorProfile>>(getVisitorsFilePath(), {});
    const visitor = visitors[params.visitorId];
    if (!visitor) return;

    const interaction: VisitorInteraction = {
      id: `int-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`,
      type: params.type,
      targetUrl: params.targetUrl,
      page: params.page,
      timestamp: new Date().toISOString(),
    };

    visitor.interactions.unshift(interaction);
    if (visitor.interactions.length > 50) visitor.interactions.length = 50;

    // Upgrade to engaged visitor if clicking CTA
    if (visitor.engagementLabel === 'New Visitor' || visitor.engagementLabel === 'Returning Visitor') {
      visitor.engagementLabel = 'Engaged Visitor';
    }

    visitors[params.visitorId] = visitor;
    writeData(getVisitorsFilePath(), visitors);
  },

  /**
   * Records form conversion lifecycle stages: viewed -> started -> abandoned -> submitted / failed.
   */
  recordFormStage: (params: {
    visitorId: string;
    sessionId: string;
    formType: 'appointment' | 'enquiry' | 'quote';
    formPage: string;
    stage: 'viewed' | 'started' | 'abandoned' | 'submitted' | 'failed';
    leadId?: string;
  }): FormConversionRecord => {
    const conversions = readData<FormConversionRecord[]>(getConversionsFilePath(), []);
    const record: FormConversionRecord = {
      id: `conv-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`,
      visitorId: params.visitorId,
      sessionId: params.sessionId,
      formType: params.formType,
      formPage: params.formPage,
      stage: params.stage,
      leadId: params.leadId,
      timestamp: new Date().toISOString(),
    };

    conversions.unshift(record);
    if (conversions.length > 5000) conversions.length = 5000;
    writeData(getConversionsFilePath(), conversions);

    // If successfully submitted, link conversion to the visitor's profile!
    if (params.stage === 'submitted' && params.leadId) {
      const visitors = readData<Record<string, VisitorProfile>>(getVisitorsFilePath(), {});
      const visitor = visitors[params.visitorId];
      if (visitor) {
        visitor.conversions.unshift({
          id: record.id,
          formType: params.formType,
          leadId: params.leadId,
          timestamp: record.timestamp,
        });

        if (params.formType === 'appointment') visitor.engagementLabel = 'Appointment Booked';
        else if (params.formType === 'quote') visitor.engagementLabel = 'Quote Requested';
        else visitor.engagementLabel = 'Inquiry Submitted';

        visitors[params.visitorId] = visitor;
        writeData(getVisitorsFilePath(), visitors);
      }
    }

    return record;
  },

  /**
   * Fetches visitors list with comprehensive filtering.
   */
  getVisitorsList: (filters?: {
    status?: 'all' | 'new' | 'returning' | 'engaged' | 'converted';
    visitCount?: 'all' | '1' | '2-5' | '6+';
    formFilter?: 'all' | 'submitted' | 'not_submitted' | 'appointment' | 'quote' | 'enquiry';
    range?: 'today' | '7d' | '30d' | '90d' | 'all';
    search?: string;
  }): VisitorProfile[] => {
    const visitorsMap = readData<Record<string, VisitorProfile>>(getVisitorsFilePath(), {});
    let list = Object.values(visitorsMap);

    // Date range filter
    if (filters?.range && filters.range !== 'all') {
      const now = new Date();
      let cutoff = new Date(0);
      if (filters.range === 'today') {
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filters.range === '7d') {
        cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (filters.range === '30d') {
        cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (filters.range === '90d') {
        cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      }
      list = list.filter((v) => new Date(v.lastSeen) >= cutoff);
    }

    // Status filter
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'new') list = list.filter((v) => v.engagementLabel === 'New Visitor');
      else if (filters.status === 'returning') list = list.filter((v) => v.isReturning);
      else if (filters.status === 'engaged') list = list.filter((v) => v.engagementLabel === 'Engaged Visitor');
      else if (filters.status === 'converted') list = list.filter((v) => v.conversions.length > 0);
    }

    // Visit count filter
    if (filters?.visitCount && filters.visitCount !== 'all') {
      if (filters.visitCount === '1') list = list.filter((v) => v.totalVisits === 1);
      else if (filters.visitCount === '2-5') list = list.filter((v) => v.totalVisits >= 2 && v.totalVisits <= 5);
      else if (filters.visitCount === '6+') list = list.filter((v) => v.totalVisits >= 6);
    }

    // Form conversion filter
    if (filters?.formFilter && filters.formFilter !== 'all') {
      if (filters.formFilter === 'submitted') list = list.filter((v) => v.conversions.length > 0);
      else if (filters.formFilter === 'not_submitted') list = list.filter((v) => v.conversions.length === 0);
      else if (filters.formFilter === 'appointment') list = list.filter((v) => v.conversions.some((c) => c.formType === 'appointment'));
      else if (filters.formFilter === 'quote') list = list.filter((v) => v.conversions.some((c) => c.formType === 'quote'));
      else if (filters.formFilter === 'enquiry') list = list.filter((v) => v.conversions.some((c) => c.formType === 'enquiry'));
    }

    // Search query
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.visitorId.toLowerCase().includes(q) ||
          v.deviceCategory.toLowerCase().includes(q) ||
          v.browserCategory.toLowerCase().includes(q) ||
          v.pagesVisited.some((p) => p.toLowerCase().includes(q))
      );
    }

    // Sort by latest seen
    return list.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
  },

  /**
   * Fetches single visitor detail by ID.
   */
  getVisitorById: (visitorId: string): VisitorProfile | null => {
    const visitorsMap = readData<Record<string, VisitorProfile>>(getVisitorsFilePath(), {});
    return visitorsMap[visitorId] || null;
  },

  /**
   * Calculates Form Funnel conversion metrics.
   */
  getFunnelStats: () => {
    const conversions = readData<FormConversionRecord[]>(getConversionsFilePath(), []);
    
    const types: ('appointment' | 'enquiry' | 'quote')[] = ['appointment', 'enquiry', 'quote'];
    const funnel: Record<string, { viewed: number; started: number; abandoned: number; submitted: number; rate: number }> = {};

    types.forEach((t) => {
      const records = conversions.filter((c) => c.formType === t);
      const viewed = records.filter((c) => c.stage === 'viewed').length;
      const started = records.filter((c) => c.stage === 'started').length;
      const abandoned = records.filter((c) => c.stage === 'abandoned').length;
      const submitted = records.filter((c) => c.stage === 'submitted').length;
      const rate = viewed > 0 ? Math.round((submitted / viewed) * 100) : 0;
      funnel[t] = { viewed, started, abandoned, submitted, rate };
    });

    return funnel;
  },
};
