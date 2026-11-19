import React from 'react';
import type { Metadata } from 'next';
import ProductPageTemplate from '@/components/shared/ProductPageTemplate';
import { productsData } from '@/data/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Driving School Management Software in Nashik | HackifyPro',
  description: 'Specialized Driving School Software by HackifyPro. Manage student registrations, practical driving slots, instructor assignments, and RTO test schedules.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/driving-school-software',
  },
};

export default function Page() {
  const product = productsData.find((p) => p.slug === 'driving-school-software');
  if (!product) notFound();
  return <ProductPageTemplate product={product} />;
}
