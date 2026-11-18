export interface FAQCategory {
  category: string;
  items: { question: string; answer: string }[];
}

export const allFaqs: FAQCategory[] = [
  {
    category: "General & Company",
    items: [
      {
        question: "What is HackifyPro?",
        answer: "HackifyPro is a modern technology and software development company based in Maharashtra, India. We engineer high-performance business websites, web applications, custom Android applications, and enterprise management software that drive operational growth and digital transformation."
      },
      {
        question: "Who is the founder of HackifyPro?",
        answer: "HackifyPro was founded by Nilesh Barela, an Indian app developer, AI enthusiast, and cybersecurity learner passionate about programming, web and mobile engineering, and practical digital innovation."
      },
      {
        question: "What does the company motto 'SECURE | LEARN | INNOVATE' mean?",
        answer: "It reflects our three core values: prioritizing software security and data protection ('SECURE'), continuously learning and mastering cutting-edge technology ('LEARN'), and building practical, impactful digital products for businesses ('INNOVATE')."
      },
      {
        question: "Where is HackifyPro located and what areas do you serve?",
        answer: "We are based in Maharashtra, India, with our primary service market in Nashik and surrounding regions (Pune, Mumbai). We also collaborate with clients across India and internationally on custom software and web applications."
      }
    ]
  },
  {
    category: "Software & Web Development",
    items: [
      {
        question: "What technologies do you use for website and web application development?",
        answer: "We primarily build with modern, production-tested stacks including React, Next.js, TypeScript, Tailwind CSS, Python (FastAPI), Node.js, and relational databases like PostgreSQL and SQLite. We select frameworks based on client performance and SEO requirements."
      },
      {
        question: "How long does it take to develop a custom software solution or website?",
        answer: "A standard high-performance business website typically takes 1 to 2 weeks. Custom web applications and specialized management systems (like Hospital or Car Rental software) typically require 3 to 6 weeks depending on feature scope and workflow complexity."
      },
      {
        question: "Do you build native Android applications?",
        answer: "Yes, we develop native Android applications using Java/Kotlin as well as cross-platform mobile apps using React Native, complete with offline database support, push notifications, and Google Play Store deployment."
      },
      {
        question: "Will our website be optimized for Google Search (SEO)?",
        answer: "Absolutely. Every website we build includes pre-rendered semantic HTML, mobile-first responsive styling, Open Graph tags, XML sitemaps, robots.txt, and Schema.org JSON-LD structured data."
      }
    ]
  },
  {
    category: "Business Software Solutions",
    items: [
      {
        question: "Are the Hospital Management and Car Rental systems ready for demonstration?",
        answer: "Yes! Both our Hospital Management System (HMS) and Car Rental Management Software are fully developed and available for live interactive demonstration. You can schedule a demo session through our Appointment page."
      },
      {
        question: "Can existing products like the Restaurant or Gym software be customized for our business?",
        answer: "Yes, all our software solutions are modular. We tailor workflows, receipt formats, user roles, and reporting metrics to match your exact business operational procedures."
      },
      {
        question: "Do you offer post-launch maintenance and technical support?",
        answer: "Yes, we provide continuous software maintenance retainers covering security updates, server backups, bug fixes, uptime monitoring, and ongoing feature enhancements."
      }
    ]
  },
  {
    category: "Pricing, Quotes & Appointments",
    items: [
      {
        question: "How do I get an estimate for my software project?",
        answer: "You can submit your project requirements via our 'Request a Quote' form (/request-quote) or book a free discovery consultation on our 'Appointment' page (/appointment). We evaluate your scope and provide a transparent quotation within 24 business hours."
      },
      {
        question: "Can we connect directly on WhatsApp?",
        answer: "Yes, you can click the WhatsApp button anywhere on our website or message us directly at +91 7414935405 for quick inquiries and project discussions."
      }
    ]
  }
];
