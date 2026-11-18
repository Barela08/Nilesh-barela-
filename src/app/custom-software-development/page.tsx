import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Custom Software Development in Nashik | HackifyPro',
  description: 'Custom software development in Nashik & Maharashtra by HackifyPro. Bespoke management software, workflow automation, and specialized business tools.',
  alternates: {
    canonical: 'https://nileshbarela.site/custom-software-development',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'custom-software-development');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
