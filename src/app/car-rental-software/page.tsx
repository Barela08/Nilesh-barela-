import React from 'react';
import type { Metadata } from 'next';
import ProductPageTemplate from '@/components/shared/ProductPageTemplate';
import { productsData } from '@/data/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Car Rental Software & Fleet Management System | HackifyPro',
  description: 'Comprehensive Car Rental Management Software by HackifyPro. Manage fleet availability, customer bookings, KYC verification, security deposits, and trip reports.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/car-rental-software',
  },
};

export default function Page() {
  const product = productsData.find((p) => p.slug === 'car-rental-software');
  if (!product) notFound();
  return <ProductPageTemplate product={product} />;
}
