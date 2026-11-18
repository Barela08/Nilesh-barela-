export interface ServiceItem {
  slug: string;
  path: string;
  title: string;
  h1: string;
  shortDesc: string;
  iconName: string;
  metaTitle: string;
  metaDesc: string;
  problemsSolved: string[];
  solutionOverview: string;
  features: { title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  techStack: string[];
  useCases: { title: string; target: string; outcome: string }[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: "website-development",
    path: "/website-development",
    title: "Website Development",
    h1: "High-Performance Website Development for Modern Businesses",
    shortDesc: "Fast, responsive, and SEO-engineered corporate websites, business portals, and conversion-optimized landing pages.",
    iconName: "Globe",
    metaTitle: "Website Development Company in Nashik | HackifyPro",
    metaDesc: "Professional website development services in Nashik and Maharashtra by HackifyPro. Fast, secure, mobile-first, and search-optimized business websites.",
    problemsSolved: [
      "Outdated, slow websites that fail to convert visitors into paying clients.",
      "Lack of mobile responsiveness resulting in high bounce rates and lost mobile traffic.",
      "Poor technical SEO foundations preventing local businesses from ranking on Google.",
      "Rigid codebases that make updating content and adding new pages difficult."
    ],
    solutionOverview: "We architect and develop high-speed, modern websites using clean semantic HTML, modern frameworks (React, Next.js), and lightweight CSS. Every website is built with mobile-first responsiveness, technical SEO best practices, structured JSON-LD data, and intuitive navigation.",
    features: [
      { title: "Custom Business & Corporate Sites", desc: "Tailored brand presentation highlighting your services, expertise, and credibility." },
      { title: "High-Converting Landing Pages", desc: "Focused sales and lead-generation pages engineered with strategic call-to-actions." },
      { title: "Mobile-First Responsive Layouts", desc: "Flawless rendering and user experience across smartphones, tablets, and 4K displays." },
      { title: "Technical SEO & Schema Markup", desc: "Pre-rendered metadata, Open Graph, sitemaps, and Schema.org structured data out of the box." },
      { title: "Lead Capture & WhatsApp Integration", desc: "Integrated booking forms, direct click-to-WhatsApp buttons, and automated CRM routing." },
      { title: "Speed & Core Web Vitals Optimization", desc: "Sub-second load times, optimized image compression, and zero layout shifts." }
    ],
    benefits: [
      { title: "Higher Conversion Rates", desc: "Frictionless forms and strategic hierarchy turn passive visitors into qualified leads." },
      { title: "Dominant Search Visibility", desc: "Built specifically to satisfy Google's mobile-first indexing and Core Web Vitals guidelines." },
      { title: "Rock-Solid Reliability", desc: "Zero vulnerability to common CMS exploit vectors with secure modern frontend stacks." }
    ],
    process: [
      { step: "01", title: "Discovery & Architecture", desc: "Understanding your business goals, target audience, and site hierarchy." },
      { step: "02", title: "Wireframing & UI Design", desc: "Interactive mockups aligning with your visual brand identity and conversion goals." },
      { step: "03", title: "Full-Stack Development", desc: "Clean, modular code built on Next.js, TypeScript, and responsive Tailwind CSS." },
      { step: "04", title: "SEO & Speed Audit", desc: "Rigorous testing of lighthouse scores, accessibility, mobile usability, and schema." },
      { step: "05", title: "Deployment & Launch", desc: "Configuring custom domain, SSL, CDN caching, and Google Search Console registration." }
    ],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 Semantic", "Vercel / Cloudflare"],
    useCases: [
      { title: "Local Service Businesses", target: "Doctors, Lawyers, Consultants, Contractors in Nashik", outcome: "3x increase in direct phone and WhatsApp enquiries." },
      { title: "B2B Manufacturers & Distributors", target: "Industrial units in MIDC Nashik & Maharashtra", outcome: "Professional global catalog showcasing capability to international buyers." }
    ],
    faqs: [
      { question: "How long does it take to develop a professional website?", answer: "A standard high-performance business website typically takes 1 to 2 weeks from requirement finalization to deployment." },
      { question: "Will my website work smoothly on mobile phones?", answer: "Yes, every website is developed using a strict mobile-first architecture and tested across diverse screen resolutions." },
      { question: "Is SEO included with website development?", answer: "Yes, on-page technical SEO, metadata, sitemaps, robots.txt, and JSON-LD structured data are built directly into the site." }
    ]
  },
  {
    slug: "android-app-development",
    path: "/android-app-development",
    title: "Android App Development",
    h1: "Native & Hybrid Android App Development for Scalable Businesses",
    shortDesc: "Robust, intuitive, and secure Android applications designed for modern consumer experiences and enterprise field operations.",
    iconName: "Smartphone",
    metaTitle: "Android App Development in Nashik | Mobile Apps | HackifyPro",
    metaDesc: "Custom Android app development in Nashik and Maharashtra by HackifyPro. Secure, feature-rich, high-performance mobile apps for businesses and startups.",
    problemsSolved: [
      "Lack of mobile presence limiting daily customer engagement and repeat transactions.",
      "Inefficient manual field operations, paper-based tracking, and delayed reporting.",
      "Poorly engineered legacy mobile apps that crash, drain battery, or lack security."
    ],
    solutionOverview: "We build intuitive, robust Android applications that run smoothly across the fragmented Android device ecosystem. From customer-facing service apps to internal field-force automation tools, we deliver performant code, clean UI, and secure API integrations.",
    features: [
      { title: "Custom Business & Consumer Apps", desc: "Feature-rich mobile applications tailored to your exact business workflow." },
      { title: "Real-Time API & Cloud Sync", desc: "Instant bi-directional data synchronization with central cloud databases." },
      { title: "Push Notifications & Alerts", desc: "Targeted messaging via Firebase Cloud Messaging (FCM) to drive user retention." },
      { title: "Offline Data Support", desc: "Local SQLite caching allowing staff to work without constant internet connectivity." },
      { title: "Role-Based Security & Auth", desc: "Encrypted token authentication, biometric login, and strict authorization layers." },
      { title: "Play Store Deployment & Maintenance", desc: "Full assistance with Google Play Console compliance, app signing, and release management." }
    ],
    benefits: [
      { title: "Direct Customer Touchpoint", desc: "Stay on your customers' home screens with instant updates and one-touch ordering." },
      { title: "Operational Automation", desc: "Automate field staff attendance, order dispatch, and inventory counts in real time." },
      { title: "High Stability & Security", desc: "Built with defensive coding practices to prevent crashes and unauthorized data access." }
    ],
    process: [
      { step: "01", title: "App Concept & Flow Analysis", desc: "Mapping user journeys, screen states, and offline requirements." },
      { step: "02", title: "Mobile UI/UX Prototyping", desc: "Designing intuitive touchscreen interactions and Material Design interfaces." },
      { step: "03", title: "App & API Engineering", desc: "Developing native/hybrid mobile frontend and robust RESTful backend APIs." },
      { step: "04", title: "Device & Stress Testing", desc: "Testing across multiple Android versions, screen densities, and low-network conditions." },
      { step: "05", title: "Play Store Release", desc: "Preparing store assets, privacy policies, target SDK compliance, and publishing." }
    ],
    techStack: ["Android SDK", "Java / Kotlin", "React Native", "Firebase", "REST APIs", "SQLite"],
    useCases: [
      { title: "Delivery & Booking Fleet", target: "Car rentals, logistics, and local couriers", outcome: "Real-time driver assignment and live status verification." },
      { title: "Member & Customer Portals", target: "Gyms, coaching institutes, and healthcare clinics", outcome: "Self-service booking, fee reminders, and attendance check-in." }
    ],
    faqs: [
      { question: "Can you publish the application to the Google Play Store?", answer: "Yes, we handle the entire release process including app bundles, privacy policy compliance, store graphics, and submission." },
      { question: "Will the app work offline?", answer: "Yes, we architect offline-first caching for critical functions so users can record data and sync when reconnected." }
    ]
  },
  {
    slug: "web-application-development",
    path: "/web-application-development",
    title: "Web Application Development",
    h1: "Enterprise Web Applications & SaaS Engineering",
    shortDesc: "Scalable, secure, and interactive cloud web applications, client portals, and bespoke SaaS platforms.",
    iconName: "Laptop",
    metaTitle: "Web Application Development Company in Nashik | HackifyPro",
    metaDesc: "Custom web application development in Nashik, Maharashtra by HackifyPro. Enterprise SaaS, admin portals, and multi-user workflow systems.",
    problemsSolved: [
      "Disjointed spreadsheets and legacy desktop software that cannot scale with growing operations.",
      "Lack of centralized multi-user access across different branches or remote teams.",
      "High licensing costs for off-the-shelf software that doesn't fit specific operational workflows."
    ],
    solutionOverview: "We engineer cloud-native web applications that serve as the digital backbone of your organization. Featuring multi-tenant architectures, granular role permissions, real-time dashboards, and secure REST/GraphQL APIs, our web apps are built to handle complex enterprise logic.",
    features: [
      { title: "Multi-Role Admin Dashboards", desc: "Distinct interfaces and permissions for admins, managers, accountants, and staff." },
      { title: "Bespoke SaaS Architecture", desc: "Scalable multi-tenant databases designed for software-as-a-service distribution." },
      { title: "Database & Cloud Architecture", desc: "High-performance PostgreSQL, MySQL, and SQLite integration with automated backups." },
      { title: "Automated Workflows & Queues", desc: "Background job processing for PDF generation, email dispatches, and reports." },
      { title: "Audit Logging & Security Controls", desc: "Complete historical tracking of user actions, logins, and data modifications." },
      { title: "Third-Party API Integration", desc: "Seamless connection with payment gateways, SMS/WhatsApp APIs, and accounting tools." }
    ],
    benefits: [
      { title: "Anywhere, Anytime Access", desc: "Manage company operations securely from any browser, laptop, or tablet worldwide." },
      { title: "Full Code Ownership", desc: "Eliminate ongoing per-user monthly SaaS fees with a custom software asset you own." },
      { title: "Seamless Team Collaboration", desc: "Real-time updates ensure all departments work from a unified source of truth." }
    ],
    process: [
      { step: "01", title: "Domain & Data Modeling", desc: "Defining business entities, relational schemas, and state transitions." },
      { step: "02", title: "Architecture & Security Planning", desc: "Establishing auth tokens, role boundaries, and API contracts." },
      { step: "03", title: "Full-Stack Sprint Execution", desc: "Developing frontend components and backend API endpoints with validation." },
      { step: "04", title: "Integration & Load Testing", desc: "Validating data integrity, concurrent access, and response latencies." },
      { step: "05", title: "Production Hardening", desc: "Configuring SSL, automated database snapshots, and uptime monitoring." }
    ],
    techStack: ["Next.js", "React", "Node.js", "Python FastAPI", "PostgreSQL", "Tailwind CSS"],
    useCases: [
      { title: "Custom ERP & Operations Suite", target: "Multi-branch trading and manufacturing firms", outcome: "Consolidated billing, inventory, and ledger across all branches." },
      { title: "Customer Account Portals", target: "Service providers and educational agencies", outcome: "Clients securely submit documents, review statuses, and pay invoices." }
    ],
    faqs: [
      { question: "Can the web application integrate with our existing database?", answer: "Yes, we build secure API adapters to integrate with your existing SQL databases, CRM, or accounting software." },
      { question: "How is data security handled?", answer: "We enforce HTTPS, parameterized SQL queries, bcrypt password hashing, JWT session controls, and strict CSRF/CORS protections." }
    ]
  },
  {
    slug: "custom-software-development",
    path: "/custom-software-development",
    title: "Custom Software Development",
    h1: "Tailored Custom Software Development for Business Efficiency",
    shortDesc: "End-to-end custom software designed around your specific business logic, eliminating operational bottlenecks.",
    iconName: "Cpu",
    metaTitle: "Custom Software Development in Nashik | HackifyPro",
    metaDesc: "Custom software development in Nashik & Maharashtra by HackifyPro. Bespoke management software, workflow automation, and specialized business tools.",
    problemsSolved: [
      "Off-the-shelf software containing unnecessary bloat while missing critical custom features.",
      "Fragmented business processes requiring manual data re-entry between multiple programs.",
      "Lack of proprietary software assets reducing company valuation and competitive advantage."
    ],
    solutionOverview: "Every business has unique operational advantages that generic software fails to support. HackifyPro builds custom software specifically tailored to your company's exact operational rules, inventory flows, calculation formulas, and approval hierarchies.",
    features: [
      { title: "Tailored Business Logic", desc: "Software mapped 100% to your existing workflows instead of forcing you to adapt." },
      { title: "Centralized Data Repository", desc: "A unified, single source of operational truth replacing scattered offline files." },
      { title: "Granular Role & Branch Access", desc: "Control exactly what each branch manager, clerk, or operator can see and do." },
      { title: "Custom PDF & Invoice Generation", desc: "Automated branded tax invoices, delivery challans, and operational reports." },
      { title: "Comprehensive Audit Trails", desc: "Track every record creation, edit, and deletion with user timestamps." },
      { title: "Future-Proof Architecture", desc: "Modular codebase engineered to easily accommodate new features as you scale." }
    ],
    benefits: [
      { title: "Maximized Operational Speed", desc: "Automate repetitive daily calculations and tasks, saving hours of staff time." },
      { title: "Zero Subscription Lock-In", desc: "Own your technology stack without rising recurring per-seat subscription penalties." },
      { title: "Competitive Differentiation", desc: "Operate faster and with higher precision than competitors using rigid generic software." }
    ],
    process: [
      { step: "01", title: "Operational Deep Dive", desc: "Shadowing existing workflows to map operational bottlenecks and exact data requirements." },
      { step: "02", title: "System Architecture Design", desc: "Designing database schemas, workflow state machines, and reporting models." },
      { step: "03", title: "Iterative Module Builds", desc: "Developing and reviewing individual operational modules with key stakeholders." },
      { step: "04", title: "User Acceptance & Pilot Testing", desc: "Running parallel with existing systems to verify numerical accuracy and ease of use." },
      { step: "05", title: "Full Deployment & Staff Training", desc: "Live transition, operator training, and continuous technical support." }
    ],
    techStack: ["TypeScript", "Python", "PostgreSQL", "SQLite", "React", "Next.js"],
    useCases: [
      { title: "Specialized Inventory & Rental Engine", target: "Equipment and vehicle rental operators", outcome: "Automated availability calendars, deposit tracking, and return checklists." },
      { title: "Custom Billing & Production Tracker", target: "Job-work factories and packaging firms", outcome: "Accurate tracking of batch progress and automated challan generation." }
    ],
    faqs: [
      { question: "Do we own the software code upon completion?", answer: "Yes, you receive full intellectual property ownership and deployment rights for custom software developed for your business." },
      { question: "What happens if we need new features later?", answer: "Our modular architecture allows seamless expansion. We provide ongoing support plans or standalone feature additions." }
    ]
  },
  {
    slug: "business-automation",
    path: "/business-automation",
    title: "Business Automation",
    h1: "Intelligent Business Automation & Workflow Systems",
    shortDesc: "Automate manual tasks, WhatsApp notifications, lead processing, and repetitive administrative workflows.",
    iconName: "Zap",
    metaTitle: "Business Automation Services in Nashik | HackifyPro",
    metaDesc: "Streamline operations with custom business automation solutions in Nashik by HackifyPro. Automated WhatsApp messaging, lead routing, and CRM sync.",
    problemsSolved: [
      "Hours wasted daily on manual data entry, copy-pasting, and sending repetitive status updates.",
      "Slow response times to new customer enquiries leading to lost sales opportunities.",
      "Human error in scheduling, billing calculations, and client follow-ups."
    ],
    solutionOverview: "HackifyPro engineers intelligent automation pipelines that connect your website, customer messages, CRM, and databases into a synchronized ecosystem. From instant WhatsApp lead acknowledgments to automated invoice dispatch, we eliminate manual friction.",
    features: [
      { title: "Instant WhatsApp Business Notifications", desc: "Official WhatsApp Cloud API triggers for order updates, receipts, and appointment alerts." },
      { title: "Lead Routing & CRM Sync", desc: "Automatic capture of website enquiries, instant alerts to sales reps, and CRM logging." },
      { title: "Automated Invoice & Document Generation", desc: "Instant PDF rendering and dispatch to clients upon job or milestone completion." },
      { title: "Scheduled Data Reports & Backups", desc: "Automated daily operational summaries sent directly to owner WhatsApp or email." },
      { title: "AI-Powered Lead Classification", desc: "Intelligent triage of incoming requests by budget, urgency, and service category." },
      { title: "Third-Party Webhook Orchestration", desc: "Connecting payment gateways, Google Sheets, calendars, and backend databases." }
    ],
    benefits: [
      { title: "Sub-Second Lead Response", desc: "Engage prospects within seconds of form submission when their purchase intent is highest." },
      { title: "Reduced Administrative Payroll", desc: "Free your team from tedious data entry so they can focus on revenue-generating sales." },
      { title: "Zero Dropped Leads", desc: "Every customer enquiry is systematically logged, tracked, and followed up automatically." }
    ],
    process: [
      { step: "01", title: "Workflow Audit", desc: "Identifying high-friction manual tasks and calculating automation ROI." },
      { step: "02", title: "Trigger & Logic Mapping", desc: "Defining event conditions, data transformations, and fallback alerts." },
      { step: "03", title: "API & Webhook Integration", desc: "Connecting systems securely with rate-limiting and failure retry logic." },
      { step: "04", title: "End-to-End Simulation", desc: "Thorough testing with edge cases to ensure 100% message deliverability." },
      { step: "05", title: "Live Activation & Monitoring", desc: "Deploying automated pipelines with real-time error telemetry." }
    ],
    techStack: ["Node.js", "Python", "Meta WhatsApp Cloud API", "Webhooks", "Cron Jobs", "PostgreSQL"],
    useCases: [
      { title: "Customer Enquiry Auto-Response", target: "High-volume service providers", outcome: "Prospects receive instant WhatsApp brochures within 5 seconds of form submission." },
      { title: "Payment & Expiry Reminders", target: "Gyms, coaching institutes, rental companies", outcome: "Automated WhatsApp payment alerts reducing late fees by 65%." }
    ],
    faqs: [
      { question: "Is WhatsApp automation compliant with Meta policies?", answer: "Yes, we exclusively utilize the official Meta WhatsApp Business Cloud API with pre-approved message templates and opt-out support." },
      { question: "Can automation connect to our existing Google Sheets or software?", answer: "Yes, we build secure webhook connections to sync data between Google Sheets, databases, and third-party tools." }
    ]
  },
  {
    slug: "software-maintenance",
    path: "/software-maintenance",
    title: "Software Maintenance & Support",
    h1: "Proactive Software Maintenance, Security Updates & Technical Support",
    shortDesc: "Keep your websites and applications fast, secure, backed up, and bug-free with dedicated maintenance retainers.",
    iconName: "Wrench",
    metaTitle: "Software Maintenance & Support in Nashik | HackifyPro",
    metaDesc: "Comprehensive software maintenance services in Nashik by HackifyPro. Security patches, performance tuning, bug fixing, and continuous technical support.",
    problemsSolved: [
      "Websites breaking due to outdated dependencies, server configuration shifts, or expired SSL.",
      "Vulnerability to malware, automated brute-force attacks, and data breaches.",
      "Slow degradation of database query performance and accumulation of orphaned files."
    ],
    solutionOverview: "Software requires ongoing care to remain secure and performant. HackifyPro provides dedicated maintenance agreements covering security patch deployment, regular offsite backups, uptime monitoring, bug remediation, and continuous speed optimization.",
    features: [
      { title: "Security Patches & Vulnerability Audits", desc: "Proactive updating of software packages to patch newly disclosed CVEs." },
      { title: "Automated Daily Offsite Backups", desc: "Encrypted snapshots stored in secure independent cloud storage for instant recovery." },
      { title: "24/7 Uptime & Health Monitoring", desc: "Immediate notifications and rapid response upon any server or endpoint downtime." },
      { title: "Database Optimization & Pruning", desc: "Index maintenance, query tuning, and cache invalidation for sustained speed." },
      { title: "Bug Fixing & Feature Tweaks", desc: "Dedicated monthly development hours for resolving issues and implementing minor updates." },
      { title: "SSL & Domain Health Management", desc: "Continuous verification of SSL certificate validity, DNS records, and email deliverability." }
    ],
    benefits: [
      { title: "Zero Disruption Peace of Mind", desc: "Rest easy knowing your commercial web platforms are monitored and protected round the clock." },
      { title: "Guaranteed Incident Response", desc: "Direct access to technical engineers who know your codebase inside and out." },
      { title: "Sustained High Performance", desc: "Prevent the gradual slowdowns that plague neglected web systems over time." }
    ],
    process: [
      { step: "01", title: "Codebase & Server Audit", desc: "Evaluating current dependencies, server logs, security headers, and backup validity." },
      { step: "02", title: "Hardening & Backup Setup", desc: "Implementing automated backup scripts, firewall rules, and uptime telemetry." },
      { step: "03", title: "Continuous Monitoring", desc: "Active monitoring for security alerts, dependency deprecations, and server load spikes." },
      { step: "04", title: "Monthly Maintenance Cycles", desc: "Applying non-breaking updates, reviewing audit logs, and running database cleanups." },
      { step: "05", title: "Transparent Health Reports", desc: "Delivering monthly summaries of uptime, security status, and completed tasks." }
    ],
    techStack: ["Linux", "Docker", "Node.js", "Python", "PostgreSQL", "Cloudflare", "Uptime Kuma"],
    useCases: [
      { title: "E-Commerce & High-Traffic Portals", target: "Online stores and customer booking engines", outcome: "99.9% uptime with zero unscheduled downtime during peak promotions." },
      { title: "Corporate Business Websites", target: "Institutions requiring guaranteed security compliance", outcome: "Clean security record with automated daily offsite recovery snapshots." }
    ],
    faqs: [
      { question: "What is included in a monthly maintenance plan?", answer: "Plans include security updates, automated cloud backups, 24/7 uptime checks, performance tuning, and allocated hours for content and feature adjustments." },
      { question: "How quickly do you respond if our website goes down?", answer: "Critical downtime issues are addressed with high-priority emergency response, usually within 1 to 2 hours." }
    ]
  },
  {
    slug: "ui-ux-design",
    path: "/ui-ux-design",
    title: "UI/UX Design",
    h1: "Intuitive UI/UX Design & High-Conversion Digital Interfaces",
    shortDesc: "User-centric interface design, wireframes, and scalable design systems that delight users and drive conversions.",
    iconName: "Palette",
    metaTitle: "UI/UX Design Services in Nashik | HackifyPro",
    metaDesc: "Professional UI/UX design services in Nashik and Maharashtra by HackifyPro. User research, mobile-first wireframing, design systems, and conversion UI.",
    problemsSolved: [
      "Cluttered, confusing interfaces causing user frustration and high drop-off rates.",
      "Inconsistent visual design across platforms hurting brand credibility and perceived value.",
      "Poor accessibility and contrast preventing users from easily navigating the software."
    ],
    solutionOverview: "Great software starts with exceptional design. HackifyPro blends aesthetic elegance with psychological conversion principles to craft user interfaces that are intuitive, accessible, and aligned with your business objectives.",
    features: [
      { title: "User Journey & Flow Mapping", desc: "Streamlining navigation paths so users achieve their goals with minimum clicks." },
      { title: "High-Fidelity Interactive Prototypes", desc: "Clickable visual models allowing you to test and refine the UX before writing code." },
      { title: "Design Systems & Component Libraries", desc: "Reusable UI components ensuring visual consistency across your entire product ecosystem." },
      { title: "Mobile-First Responsive Layouts", desc: "Dedicated mobile interface optimization prioritizing touch targets and thumb ergonomics." },
      { title: "Accessibility (WCAG) Compliance", desc: "High-contrast typography, semantic color palettes, and accessible focus states." },
      { title: "Developer-Ready Design Tokens", desc: "Exact CSS specs, icon assets, and layout tokens ready for direct frontend implementation." }
    ],
    benefits: [
      { title: "Higher User Adoption & Retention", desc: "Intuitive interfaces require less onboarding and reduce client training time." },
      { title: "Reduced Development Costs", desc: "Solving UX friction in design saves costly engineering rewrites during development." },
      { title: "Premium Brand Perception", desc: "A polished, modern interface establishes immediate authority and customer trust." }
    ],
    process: [
      { step: "01", title: "User Research & Benchmarking", desc: "Analyzing user behavior, competitor standards, and specific domain workflows." },
      { step: "02", title: "Information Architecture", desc: "Structuring pages, navigation menus, and content hierarchy for effortless browsing." },
      { step: "03", title: "Interactive Wireframing", desc: "Testing low-fidelity interaction models to confirm core workflow efficiency." },
      { step: "04", title: "Visual Design & Tokens", desc: "Applying color palettes, typography, card elevation, and branded assets." },
      { step: "05", title: "Handoff & Implementation Review", desc: "Delivering production-ready tokens and reviewing frontend builds for 100% design fidelity." }
    ],
    techStack: ["Figma", "Tailwind CSS", "Design Tokens", "Material Design", "WCAG 2.1"],
    useCases: [
      { title: "Complex Admin Dashboards", target: "Enterprise management and analytics software", outcome: "Dense metrics organized into clear, actionable, high-contrast visual cards." },
      { title: "Consumer Mobile Applications", target: "Service booking and shopping platforms", outcome: "Checkout drop-off reduced through a simplified 2-step ordering flow." }
    ],
    faqs: [
      { question: "Do you provide design prototypes before development?", answer: "Yes, we produce interactive design prototypes so you can experience and approve the full user flow prior to development." },
      { question: "Can you redesign an existing outdated software interface?", answer: "Yes, we specialize in modernizing legacy software interfaces to make them contemporary, responsive, and easy to navigate." }
    ]
  }
];
