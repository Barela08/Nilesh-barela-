import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Business Automation Services in Nashik | HackifyPro',
  description: 'Streamline operations with custom business automation solutions in Nashik by HackifyPro. Automated WhatsApp messaging, lead routing, and CRM sync.',
  alternates: {
    canonical: 'https://nileshbarela.site/business-automation',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'business-automation');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
