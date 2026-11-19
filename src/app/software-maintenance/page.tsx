import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Software Maintenance & Support in Nashik | HackifyPro',
  description: 'Comprehensive software maintenance services in Nashik by HackifyPro. Security patches, performance tuning, bug fixing, and continuous technical support.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/software-maintenance',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'software-maintenance');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
