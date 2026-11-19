import React from 'react';
import type { Metadata } from 'next';
import ProductPageTemplate from '@/components/shared/ProductPageTemplate';
import { productsData } from '@/data/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Restaurant POS & Management Software in Nashik | HackifyPro',
  description: 'All-in-one Restaurant POS and Management Software by HackifyPro. Features QR digital ordering, KDS, table management, recipe inventory, and GST billing.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/restaurant-management-software',
  },
};

export default function Page() {
  const product = productsData.find((p) => p.slug === 'restaurant-management-software');
  if (!product) notFound();
  return <ProductPageTemplate product={product} />;
}
