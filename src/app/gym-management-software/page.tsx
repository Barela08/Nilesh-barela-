import React from 'react';
import type { Metadata } from 'next';
import ProductPageTemplate from '@/components/shared/ProductPageTemplate';
import { productsData } from '@/data/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Gym Management Software & Member Portal | HackifyPro',
  description: 'Comprehensive Gym Management Software by HackifyPro. Manage member subscriptions, biometric attendance, renewal WhatsApp alerts, and trainer scheduling.',
  alternates: {
    canonical: 'https://nileshbarela.site/gym-management-software',
  },
};

export default function Page() {
  const product = productsData.find((p) => p.slug === 'gym-management-software');
  if (!product) notFound();
  return <ProductPageTemplate product={product} />;
}
