import React from 'react';
import type { Metadata } from 'next';
import ProductPageTemplate from '@/components/shared/ProductPageTemplate';
import { productsData } from '@/data/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Hospital Management Software (HMS) | HackifyPro',
  description: 'Comprehensive Hospital Management Software by HackifyPro. Manage OPD, IPD, doctor scheduling, electronic medical records, pharmacy, and patient billing.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/hospital-management-software',
  },
};

export default function Page() {
  const product = productsData.find((p) => p.slug === 'hospital-management-software');
  if (!product) notFound();
  return <ProductPageTemplate product={product} />;
}
