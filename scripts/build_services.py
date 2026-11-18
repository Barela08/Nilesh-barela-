import os

services = [
    ('website-development', 'Website Development Company in Nashik | HackifyPro', 'Professional website development services in Nashik and Maharashtra by HackifyPro. Fast, secure, mobile-first, and search-optimized business websites.'),
    ('android-app-development', 'Android App Development in Nashik | Mobile Apps | HackifyPro', 'Custom Android app development in Nashik and Maharashtra by HackifyPro. Secure, feature-rich, high-performance mobile apps for businesses and startups.'),
    ('web-application-development', 'Web Application Development Company in Nashik | HackifyPro', 'Custom web application development in Nashik, Maharashtra by HackifyPro. Enterprise SaaS, admin portals, and multi-user workflow systems.'),
    ('custom-software-development', 'Custom Software Development in Nashik | HackifyPro', 'Custom software development in Nashik & Maharashtra by HackifyPro. Bespoke management software, workflow automation, and specialized business tools.'),
    ('business-automation', 'Business Automation Services in Nashik | HackifyPro', 'Streamline operations with custom business automation solutions in Nashik by HackifyPro. Automated WhatsApp messaging, lead routing, and CRM sync.'),
    ('software-maintenance', 'Software Maintenance & Support in Nashik | HackifyPro', 'Comprehensive software maintenance services in Nashik by HackifyPro. Security patches, performance tuning, bug fixing, and continuous technical support.'),
    ('ui-ux-design', 'UI/UX Design Services in Nashik | HackifyPro', 'Professional UI/UX design services in Nashik and Maharashtra by HackifyPro. User research, mobile-first wireframing, design systems, and conversion UI.')
]

for slug, title, desc in services:
    d = os.path.join('src', 'app', slug)
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, 'page.tsx')
    content = f"""import React from 'react';
import type {{ Metadata }} from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import {{ servicesData }} from '@/data/services';
import {{ notFound }} from 'next/navigation';

export const metadata: Metadata = {{
  title: '{title}',
  description: '{desc}',
  alternates: {{
    canonical: 'https://nileshbarela.site/{slug}',
  }},
}};

export default function Page() {{
  const service = servicesData.find((s) => s.slug === '{slug}');
  if (!service) notFound();
  return <ServicePageTemplate service={{service}} />;
}}
"""
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated service route: {slug}")

# Services Hub
os.makedirs('src/app/services', exist_ok=True)
hub_content = """import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Smartphone, Laptop, Cpu, Zap, Wrench, Palette, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/data/services';

export const metadata: Metadata = {
  title: 'Software Development & IT Services | HackifyPro',
  description: 'Explore the full suite of software development, mobile application, web engineering, and automation services offered by HackifyPro.',
  alternates: {
    canonical: 'https://nileshbarela.site/services',
  },
};

export default function ServicesHubPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Comprehensive Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Our Software Development Services
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            From custom business websites and native Android apps to enterprise web applications and workflow automation, HackifyPro builds scalable digital solutions engineered for reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((svc) => (
            <div 
              key={svc.slug}
              className="p-8 rounded-2xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080B12] border border-[#1E293B] flex items-center justify-center text-[#00E676] mb-5 group-hover:scale-110 transition-transform">
                  {svc.slug === 'website-development' && <Globe className="w-6 h-6" />}
                  {svc.slug === 'android-app-development' && <Smartphone className="w-6 h-6" />}
                  {svc.slug === 'web-application-development' && <Laptop className="w-6 h-6" />}
                  {svc.slug === 'custom-software-development' && <Cpu className="w-6 h-6" />}
                  {svc.slug === 'business-automation' && <Zap className="w-6 h-6" />}
                  {svc.slug === 'software-maintenance' && <Wrench className="w-6 h-6" />}
                  {svc.slug === 'ui-ux-design' && <Palette className="w-6 h-6" />}
                </div>

                <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#00E676] transition-colors">
                  {svc.title}
                </h2>

                <p className="text-sm text-[#9AA3B8] mt-2.5 leading-relaxed">
                  {svc.shortDesc}
                </p>

                <div className="mt-5 space-y-1.5">
                  {svc.features.slice(0, 3).map((f) => (
                    <div key={f.title} className="text-xs text-[#E8EDF5] flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                      <span>{f.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                <Link
                  href={svc.path}
                  className="text-xs font-mono font-bold text-[#00E676] hover:underline flex items-center"
                >
                  <span>Read Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  href={`/request-quote?service=${svc.slug}`}
                  className="text-xs font-mono text-[#9AA3B8] hover:text-white"
                >
                  Get Quote &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
"""
with open('src/app/services/page.tsx', 'w', encoding='utf-8') as f:
    f.write(hub_content)
print("Generated /services hub successfully.")
