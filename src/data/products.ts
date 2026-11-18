export interface ProductItem {
  slug: string;
  path: string;
  title: string;
  tagline: string;
  badge: string;
  status: 'Live & Demonstration Ready' | 'Available for Custom Deployment';
  iconName: string;
  metaTitle: string;
  metaDesc: string;
  overview: string;
  keyModules: { name: string; desc: string; icon: string }[];
  features: { title: string; desc: string }[];
  workflow: { step: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  demoAvailable: boolean;
  demoNotes: string;
}

export const productsData: ProductItem[] = [
  {
    slug: "hospital-management-software",
    path: "/hospital-management-software",
    title: "Hospital Management Software (HMS)",
    tagline: "Complete Digital Healthcare Administration, OPD/IPD & Clinical Records",
    badge: "Flagship HealthTech Solution",
    status: "Live & Demonstration Ready",
    iconName: "Activity",
    metaTitle: "Hospital Management Software (HMS) | HackifyPro",
    metaDesc: "Comprehensive Hospital Management Software by HackifyPro. Manage OPD, IPD, doctor scheduling, electronic medical records, pharmacy, and patient billing.",
    overview: "HackifyPro Hospital Management Software (HMS) is an integrated clinical and administrative management solution designed for hospitals, polyclinics, nursing homes, and diagnostic centers. Built with modular scalability and strict patient data privacy, it eliminates paper bottlenecks across every patient interaction.",
    keyModules: [
      { name: "Patient Registration & EMR", desc: "Digital patient records, medical history, past diagnoses, allergy notes, and visit timeline.", icon: "UserCheck" },
      { name: "Doctor Scheduling & OPD", desc: "Consultation slot management, live queue display, token generation, and doctor desk.", icon: "CalendarCheck" },
      { name: "IPD & Bed Allocation", desc: "Ward and bed occupancy tracking, nursing notes, daily rounding logs, and admission/discharge workflows.", icon: "Bed" },
      { name: "Digital Prescriptions", desc: "Fast Rx generator with built-in dosage templates, drug interaction alerts, and printable slips.", icon: "FileText" },
      { name: "Pharmacy & Stock Management", desc: "Dispensing module, batch number tracking, expiry date monitoring, and stock alerts.", icon: "Package" },
      { name: "Laboratory & Radiology", desc: "Test requisition, sample collection status, automated test report generation, and normal value ranges.", icon: "FlaskConical" },
      { name: "Billing & Insurance (TPA)", desc: "Consolidated billing for consultations, bed charges, tests, medicines, and discharge summaries.", icon: "CreditCard" },
      { name: "Management Analytics & Reports", desc: "Daily revenue reports, doctor revenue share, bed occupancy rates, and patient census statistics.", icon: "TrendingUp" }
    ],
    features: [
      { title: "Role-Based Staff Access", desc: "Strict separation of privileges for receptionists, nurses, doctors, lab technicians, and hospital administrators." },
      { title: "Multi-Department Routing", desc: "Smooth patient flow from front desk registration to doctor consultation, diagnostics, and pharmacy collection." },
      { title: "Fast OPD Slip Printing", desc: "Thermal or A4 receipt printing with barcode/QR code for rapid patient identification." },
      { title: "Secure Local or Cloud Deployment", desc: "Deployable either on a secure local hospital intranet server or cloud infrastructure with encrypted backups." }
    ],
    workflow: [
      { step: "01", title: "Patient Walk-In / Booking", desc: "Front desk logs patient details and assigns a consultation token." },
      { step: "02", title: "Doctor Consultation & EMR", desc: "Physician reviews medical history and inputs digital prescription and lab orders." },
      { step: "03", title: "Diagnostics & Pharmacy", desc: "Lab and pharmacy automatically receive orders without manual paper shuttling." },
      { step: "04", title: "Consolidated Settlement", desc: "Single-window billing compiles all doctor fees, lab tests, and medications for checkout." }
    ],
    faqs: [
      { question: "Is this Hospital Management System available for live demonstration?", answer: "Yes, HackifyPro maintains a live working demo of the Hospital Management Software that can be demonstrated upon request." },
      { question: "Can the system be customized for specialized clinics?", answer: "Yes, the HMS is modular and can be tailored for dental clinics, eye hospitals, pediatric practices, or multi-specialty nursing homes." },
      { question: "Can it operate on local hospital Wi-Fi without internet?", answer: "Yes, we support on-premise local intranet server installation so hospital operations continue uninterrupted even during external internet outages." }
    ],
    demoAvailable: true,
    demoNotes: "Live interactive demonstration available upon appointment with our technical team."
  },
  {
    slug: "car-rental-software",
    path: "/car-rental-software",
    title: "Car Rental Management Software",
    tagline: "Fleet Scheduling, Online Bookings, Document Verification & Payment Tracking",
    badge: "Automotive Operations Engine",
    status: "Live & Demonstration Ready",
    iconName: "Car",
    metaTitle: "Car Rental Software & Fleet Management System | HackifyPro",
    metaDesc: "Comprehensive Car Rental Management Software by HackifyPro. Manage fleet availability, customer bookings, KYC verification, security deposits, and trip reports.",
    overview: "Engineered specifically for self-drive operators, chauffeur agencies, and commercial fleet businesses. HackifyPro Car Rental Software simplifies vehicle scheduling, customer driving license verification, contract generation, deposit tracking, and maintenance logs.",
    keyModules: [
      { name: "Fleet & Vehicle Inventory", desc: "Vehicle profiles, registration details, insurance/pollution validity alerts, and mileage logs.", icon: "Truck" },
      { name: "Live Availability Calendar", desc: "Color-coded visual matrix preventing double bookings and highlighting returned vehicles.", icon: "Calendar" },
      { name: "Customer KYC & Verification", desc: "Secure upload and verification of Aadhaar, Driving License, and address proof.", icon: "ShieldCheck" },
      { name: "Booking & Rental Contracts", desc: "Automated digital rental agreement generation with fuel levels, odometer reading, and terms.", icon: "FileCheck" },
      { name: "Security Deposit Management", desc: "Track refundable deposits, deductions for extra kilometers, toll charges, or vehicle damage.", icon: "DollarSign" },
      { name: "Payment Proof & Settlements", desc: "UPI, bank transfer, and card payment logging with receipt generation.", icon: "Receipt" },
      { name: "Maintenance & Service Alerts", desc: "Scheduled service reminders based on kilometer thresholds or calendar intervals.", icon: "Wrench" },
      { name: "Fleet Revenue Analytics", desc: "Vehicle-wise profitability, utilization percentage, maintenance cost ratio, and monthly revenue.", icon: "BarChart" }
    ],
    features: [
      { title: "Damage & Fuel Handover Checklist", desc: "Record vehicle condition photographs and fuel gauge levels at pickup and return." },
      { title: "Dynamic Hourly & Daily Pricing", desc: "Configure distinct tariff tiers for weekdays, weekends, holiday peak periods, and long-term hires." },
      { title: "WhatsApp Booking Confirmations", desc: "Automated WhatsApp notifications to customers with vehicle details and pickup location." }
    ],
    workflow: [
      { step: "01", title: "Reservation Selection", desc: "Customer or operator selects vehicle category, rental dates, and pickup time." },
      { step: "02", title: "KYC Document Verification", desc: "Staff validates driving license and collects security deposit." },
      { step: "03", title: "Vehicle Handover & Inspection", desc: "Record starting odometer and fuel reading on digital checklist." },
      { step: "04", title: "Return & Final Settlement", desc: "Verify return status, calculate extra mileage/fuel, and process deposit refund." }
    ],
    faqs: [
      { question: "Can customers book cars directly online?", answer: "Yes, we provide both an operator admin portal and an optional customer-facing booking website." },
      { question: "How does the software handle security deposits?", answer: "Deposits are segregated in the ledger, with quick deduction calculators for delayed returns, traffic fines, or extra kilometers." }
    ],
    demoAvailable: true,
    demoNotes: "Fully functional fleet scheduling and KYC demo ready for presentation."
  },
  {
    slug: "restaurant-management-software",
    path: "/restaurant-management-software",
    title: "Restaurant Management & POS Software",
    tagline: "Table Orders, Kitchen Display System (KDS), QR Menus & Fast Billing",
    badge: "Hospitality & POS Solution",
    status: "Available for Custom Deployment",
    iconName: "Utensils",
    metaTitle: "Restaurant POS & Management Software in Nashik | HackifyPro",
    metaDesc: "All-in-one Restaurant POS and Management Software by HackifyPro. Features QR digital ordering, KDS, table management, recipe inventory, and GST billing.",
    overview: "Designed for cafes, fine-dining restaurants, quick-service counters (QSR), and multi-outlet food chains. HackifyPro Restaurant Management Software synchronizes the dining floor with the kitchen and cash register to eliminate miscommunication and speed up table turnover.",
    keyModules: [
      { name: "Digital Menu & QR Ordering", desc: "Contactless QR code menus for table ordering with real-time item availability toggles.", icon: "QrCode" },
      { name: "Table & Floor Management", desc: "Interactive floor plan showing occupied tables, reserved spots, and dining durations.", icon: "LayoutGrid" },
      { name: "Kitchen Display System (KDS)", desc: "Live kitchen tickets categorized by preparation station to eliminate lost paper KOTs.", icon: "Monitor" },
      { name: "Captain & Waiter App", desc: "Mobile ordering application for waitstaff to punch orders directly at tableside.", icon: "Smartphone" },
      { name: "Split Billing & GST Invoicing", desc: "Quick bill settlement, itemized split bills, discounts, promo codes, and GST compliance.", icon: "Receipt" },
      { name: "Recipe & Raw Material Inventory", desc: "Automatic ingredient depletion based on recipes to prevent food waste and theft.", icon: "Boxes" },
      { name: "Online Aggregator Sync", desc: "Centralized interface to manage online orders alongside in-house dining.", icon: "ShoppingBag" },
      { name: "Sales & Shift Reports", desc: "End-of-day register closure, waiter sales metrics, top-selling dishes, and profit margins.", icon: "PieChart" }
    ],
    features: [
      { title: "Lightning-Fast Touch POS", desc: "Optimized for high-speed counter billing during rush hours with minimal clicks." },
      { title: "Real-Time KOT Dispatch", desc: "Orders instantly print in the kitchen or appear on kitchen screens as soon as placed." },
      { title: "Offline Resilience", desc: "Continue billing tables even if the internet drops, syncing automatically when restored." }
    ],
    workflow: [
      { step: "01", title: "Order Punching", desc: "Order taken via waiter tablet, counter POS, or customer QR scan." },
      { step: "02", title: "Kitchen Routing", desc: "Kitchen displays order with preparation timer and station allocation." },
      { step: "03", title: "Food Serving", desc: "Waitstaff notified when dish is marked ready on the KDS." },
      { step: "04", title: "Quick Settlement", desc: "Bill printed with cash, UPI QR, or card split options." }
    ],
    faqs: [
      { question: "Does the restaurant POS support thermal receipt printers?", answer: "Yes, it supports standard ESC/POS USB, Bluetooth, and network thermal printers (58mm & 80mm)." },
      { question: "Can we track raw material inventory like dairy, meat, and vegetables?", answer: "Yes, our recipe management module automatically deducts raw ingredient stocks whenever a dish is ordered." }
    ],
    demoAvailable: true,
    demoNotes: "Interactive POS, QR menu, and KOT demonstration available."
  },
  {
    slug: "gym-management-software",
    path: "/gym-management-software",
    title: "Gym & Fitness Studio Management Software",
    tagline: "Member Subscriptions, Biometric Attendance, Trainer Slots & Fee Alerts",
    badge: "Fitness Operations Suite",
    status: "Available for Custom Deployment",
    iconName: "Dumbbell",
    metaTitle: "Gym Management Software & Member Portal | HackifyPro",
    metaDesc: "Comprehensive Gym Management Software by HackifyPro. Manage member subscriptions, biometric attendance, renewal WhatsApp alerts, and trainer scheduling.",
    overview: "Built for fitness centers, CrossFit boxes, yoga studios, and personal training clubs. HackifyPro Gym Management Software automates membership renewals, tracks member visits, prevents unauthorized entries, and generates detailed revenue insights.",
    keyModules: [
      { name: "Member Profiles & Documents", desc: "Digital member files, emergency contacts, medical disclosures, and fitness goals.", icon: "Users" },
      { name: "Membership Plans & Packages", desc: "Configurable monthly, quarterly, annual, and personal training (PT) subscription packages.", icon: "Layers" },
      { name: "Attendance & Access Control", desc: "Integration with biometric fingerprint scanners, RFID cards, or QR check-in.", icon: "Scan" },
      { name: "WhatsApp Fee Renewal Alerts", desc: "Automated WhatsApp notifications sent 7, 3, and 1 days before membership expiry.", icon: "MessageCircle" },
      { name: "Trainer & Personal Training (PT)", desc: "Trainer commission tracking, client assignment, and workout session logging.", icon: "UserCheck" },
      { name: "Payment Ledger & Invoices", desc: "Installment tracking, pending fee follow-up lists, and branded digital receipts.", icon: "CreditCard" },
      { name: "Locker & Supplement Inventory", desc: "Manage locker allocations and retail sales of protein supplements or merchandise.", icon: "Package" },
      { name: "Retention & Churn Reports", desc: "Identify inactive members, renewal conversion rates, and revenue projections.", icon: "TrendingUp" }
    ],
    features: [
      { title: "Automated Expiry Alerts", desc: "Never lose membership dues again with automated WhatsApp reminder sequences." },
      { title: "Access Control Interlock", desc: "Optionally block turnstile access automatically if a member's fee is overdue." },
      { title: "Mobile Friendly Staff Desk", desc: "Manage admissions and check memberships directly from any mobile browser." }
    ],
    workflow: [
      { step: "01", title: "Member Enrollment", desc: "Capture details, select plan, snap photo, and assign access credentials." },
      { step: "02", title: "Daily Check-In", desc: "Member scans biometric or QR; system validates active subscription." },
      { step: "03", title: "Proactive Renewal", desc: "Automated WhatsApp reminder dispatches with direct payment link before expiry." },
      { step: "04", title: "Instant Renewal Slip", desc: "Payment received, plan extended, and invoice delivered to member's WhatsApp." }
    ],
    faqs: [
      { question: "Can it integrate with our existing biometric fingerprint device?", answer: "Yes, we integrate with common biometric hardware and access turnstiles via local bridge APIs." },
      { question: "How are renewal reminders sent?", answer: "Reminders are sent automatically via the official WhatsApp Business API directly to the member's mobile phone." }
    ],
    demoAvailable: true,
    demoNotes: "Member CRM and renewal notification demo available for booking."
  },
  {
    slug: "driving-school-software",
    path: "/driving-school-software",
    title: "Driving School Management Software",
    tagline: "Student Admissions, Slot Scheduling, Vehicle Rosters & RTO Progress",
    badge: "Motor Training Solution",
    status: "Available for Custom Deployment",
    iconName: "Shield",
    metaTitle: "Driving School Management Software in Nashik | HackifyPro",
    metaDesc: "Specialized Driving School Software by HackifyPro. Manage student registrations, practical driving slots, instructor assignments, and RTO test schedules.",
    overview: "Specially developed for motor driving schools and training institutes. HackifyPro Driving School Management Software streamlines student batching, practical driving session scheduling, instructor allocations, fee installment tracking, and RTO licensing timelines.",
    keyModules: [
      { name: "Student Registration & KYC", desc: "Learner profile, Aadhaar, age proof, LL (Learner License) details, and photo capture.", icon: "UserPlus" },
      { name: "Instructor & Car Assignment", desc: "Pair instructors with specific dual-control vehicles and assigned student rosters.", icon: "Car" },
      { name: "Practical Slot Scheduling", desc: "Time slot booking (morning/evening) preventing instructor and vehicle double-booking.", icon: "CalendarCheck" },
      { name: "Daily Driving Attendance", desc: "Track completed driving hours (e.g., 20 days course) with student digital signatures.", icon: "CheckSquare" },
      { name: "Fee Installment Ledger", desc: "Manage advance payments, RTO fee splits, pending dues, and computerized receipts.", icon: "Receipt" },
      { name: "RTO Test Tracking", desc: "Monitor Learner License (LL) test dates, Permanent License (DL) slot bookings, and test results.", icon: "Award" },
      { name: "SMS / WhatsApp Class Reminders", desc: "Send daily pickup reminders and RTO test documentation checklists to students.", icon: "Bell" },
      { name: "Vehicle Fuel & Fitness Logs", desc: "Track training car fuel expenditure, RTO fitness certificate renewals, and servicing.", icon: "Wrench" }
    ],
    features: [
      { title: "Visual Daily Time Slot Grid", desc: "Easily visualize available 30-minute or 1-hour driving slots across all training vehicles." },
      { title: "20-Day Course Progress Bar", desc: "Instant visual indicator showing how many practical driving lessons each student has completed." },
      { title: "RTO Date Expiry Warnings", desc: "Automated alerts when a student's Learner License is approaching its 6-month validity threshold." }
    ],
    workflow: [
      { step: "01", title: "Enrollment & LL Application", desc: "Enroll student, record batch preference, and initiate Learner License documentation." },
      { step: "02", title: "Session Scheduling", desc: "Assign daily driving time slot, car, and dedicated instructor." },
      { step: "03", title: "Practical Lesson Logging", desc: "Instructor marks daily lesson completion, maneuvers covered, and attendance." },
      { step: "04", title: "RTO Test & Certification", desc: "Schedule permanent driving test and issue course completion record upon passing." }
    ],
    faqs: [
      { question: "Can instructors update student attendance from their phones?", answer: "Yes, instructors can access a mobile-optimized interface to mark attendance and track lesson progress at the end of each session." },
      { question: "Does the software help prevent Learner License expiry?", answer: "Yes, automated dashboard alerts notify operators of students whose Learner Licenses are within 30 days of expiry." }
    ],
    demoAvailable: true,
    demoNotes: "Complete student batching and scheduling flow ready for demonstration."
  }
];
