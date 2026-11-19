import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Web Application Development Company in Nashik | HackifyPro',
  description: 'Custom web application development in Nashik, Maharashtra by HackifyPro. Enterprise SaaS, admin portals, and multi-user workflow systems.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/web-application-development',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'web-application-development');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
