export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  client: string;
  market: string;
  problemSolved: string;
  mainFeatures: string[];
  techStack: string[];
  image: string;
  demoUrl?: string;
  hasDemo: boolean;
  status: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "proj-1",
    slug: "hospital-management-system",
    title: "HackifyPro Hospital Management System (HMS)",
    category: "HealthTech & Web Applications",
    summary: "An integrated healthcare operations and clinical records platform managing OPD/IPD workflows, doctor scheduling, electronic medical records, laboratory orders, and centralized billing.",
    client: "Healthcare Clinics & Nursing Homes",
    market: "Maharashtra, India",
    problemSolved: "Clinics and nursing homes struggled with misplaced physical case files, slow OPD registration queues, disconnected pharmacy billing, and lack of real-time bed occupancy visibility.",
    mainFeatures: [
      "Digital Patient EMR with historical diagnosis and prescription records.",
      "Live doctor OPD queue token system reducing reception bottlenecks.",
      "IPD bed allocation, daily nursing logs, and automated room tariff calculation.",
      "Integrated pharmacy dispensing and laboratory report management.",
      "Single-invoice settlement compiling consultations, lab tests, and medications."
    ],
    techStack: ["React", "TypeScript", "FastAPI (Python)", "SQLite / PostgreSQL", "Tailwind CSS"],
    image: "/assets/hackifypro-workspace.png",
    demoUrl: "/appointment?service=hospital-management-software",
    hasDemo: true,
    status: "Live & Deployed Demonstration"
  },
  {
    id: "proj-2",
    slug: "leadsaathi-pro",
    title: "LeadSaathi PRO – Local Business Discovery & Outreach Suite",
    category: "Business Automation & CRM",
    summary: "Full-stack prospecting and pipeline automation application empowering digital agencies to identify local businesses lacking websites and manage compliant WhatsApp outreach.",
    client: "Digital Agencies & Freelance Developers",
    market: "India",
    problemSolved: "Agencies spent hours manually scouring search engines for local businesses, tracking outreach on chaotic spreadsheets, and facing phone number bans from unapproved scraping scripts.",
    mainFeatures: [
      "Targeted local business filtering by category and city (Nashik, Pune, Mumbai, etc.).",
      "Automated detection of businesses lacking online websites in public listings.",
      "Official Meta WhatsApp Business Cloud API integration ensuring 100% compliance.",
      "Automated STOP / Opt-Out consent handling to protect sender reputation.",
      "Interactive pipeline CRM with stages from New Lead to Proposal Won."
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Meta Cloud API", "Google Gemini AI"],
    image: "/assets/hackifypro-office.png",
    demoUrl: "/appointment?service=business-automation",
    hasDemo: true,
    status: "Functional Internal System"
  },
  {
    id: "proj-3",
    slug: "hackifypro-commercial-platform",
    title: "HackifyPro High-Performance Web Ecosystem",
    category: "Web Engineering & SEO",
    summary: "The official production website ecosystem for HackifyPro, featuring automated lead capture, Google Ads conversion tracking, and comprehensive Schema.org structured data.",
    client: "HackifyPro",
    market: "Nashik, Maharashtra & Global",
    problemSolved: "Bridging the gap between software development commercial services and technical education identity while delivering sub-second load times and zero-friction client conversion.",
    mainFeatures: [
      "Sub-second Core Web Vitals performance with server-rendered React & Next.js.",
      "Automated appointment booking, lead qualification, and instant rate-limited forms.",
      "Duplicate-prevention Google Ads and GA4 conversion tracking architecture.",
      "Rich JSON-LD schemas for Organization, Founder, Services, and Software Products.",
      "Integrated secure admin dashboard with status management and authorized CSV export."
    ],
    techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Node.js API", "JSON Database"],
    image: "/assets/hackifypro-storefront.png",
    demoUrl: "https://nileshbarela.site",
    hasDemo: true,
    status: "Production Ready"
  }
];
