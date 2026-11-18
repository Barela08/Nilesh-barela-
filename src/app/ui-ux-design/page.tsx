import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'UI/UX Design Services in Nashik | HackifyPro',
  description: 'Professional UI/UX design services in Nashik and Maharashtra by HackifyPro. User research, mobile-first wireframing, design systems, and conversion UI.',
  alternates: {
    canonical: 'https://nileshbarela.site/ui-ux-design',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'ui-ux-design');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
