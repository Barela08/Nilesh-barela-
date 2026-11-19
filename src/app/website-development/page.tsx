import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Website Development Company in Nashik | HackifyPro',
  description: 'Professional website development services in Nashik and Maharashtra by HackifyPro. Fast, secure, mobile-first, and search-optimized business websites.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/website-development',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'website-development');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
