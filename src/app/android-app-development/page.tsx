import React from 'react';
import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/shared/ServicePageTemplate';
import { servicesData } from '@/data/services';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Android App Development in Nashik | Mobile Apps | HackifyPro',
  description: 'Custom Android app development in Nashik and Maharashtra by HackifyPro. Secure, feature-rich, high-performance mobile apps for businesses and startups.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/android-app-development',
  },
};

export default function Page() {
  const service = servicesData.find((s) => s.slug === 'android-app-development');
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
