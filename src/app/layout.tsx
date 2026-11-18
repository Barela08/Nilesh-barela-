import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleTag from '@/components/shared/GoogleTag';
import WhatsAppFloating from '@/components/shared/WhatsAppFloating';
import { company } from '@/data/company';

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: 'HackifyPro | Website, App & Custom Software Development',
    template: '%s | HackifyPro',
  },
  description:
    'HackifyPro provides website development, Android app development, web applications and custom software solutions for businesses. Discuss your project with our team.',
  keywords: [
    'HackifyPro',
    'Nilesh Barela',
    'Website Development Company in Nashik',
    'Software Development Company in Nashik',
    'Android App Development in Nashik',
    'Custom Software Development in Nashik',
    'IT Solutions for Businesses in Nashik',
    'Hospital Management Software',
    'Car Rental Software',
    'Restaurant POS Software',
    'Full Stack Web Applications',
    'Cybersecurity Education',
  ],
  authors: [{ name: 'Nilesh Barela', url: 'https://nileshbarela.site/nilesh-barela' }],
  creator: 'Nilesh Barela',
  publisher: 'HackifyPro',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: company.websiteUrl,
    siteName: 'HackifyPro',
    title: 'HackifyPro | Website, App & Custom Software Development',
    description:
      'HackifyPro provides website development, Android app development, web applications and custom software solutions for businesses.',
    images: [
      {
        url: `${company.websiteUrl}/assets/hackifypro-storefront.png`,
        width: 1200,
        height: 630,
        alt: 'HackifyPro IT Solutions & Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@NileshBarela6',
    creator: '@NileshBarela6',
    title: 'HackifyPro | Website, App & Custom Software Development',
    description:
      'Building Powerful Digital Solutions for Modern Businesses. Websites, Android apps, custom software, and digital innovation.',
    images: [`${company.websiteUrl}/assets/hackifypro-storefront.png`],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${company.websiteUrl}/#org`,
    name: 'HackifyPro',
    legalName: 'HackifyPro',
    url: company.websiteUrl,
    logo: `${company.websiteUrl}/assets/hackifypro-logo.png`,
    description: company.description,
    slogan: company.tagline,
    founder: {
      '@type': 'Person',
      '@id': `${company.websiteUrl}/nilesh-barela#person`,
      name: 'Nilesh Barela',
      jobTitle: 'Founder & Lead Developer',
      url: `${company.websiteUrl}/nilesh-barela`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.localSeo.city,
      addressRegion: company.localSeo.state,
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.contact.phone,
      contactType: 'customer support',
      email: company.contact.email,
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
    sameAs: [
      company.founder.socials.linkedin,
      company.founder.socials.instagram,
      company.founder.socials.x,
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${company.websiteUrl}/#website`,
    url: company.websiteUrl,
    name: 'HackifyPro',
    description: company.primaryPositioning,
    publisher: {
      '@id': `${company.websiteUrl}/#org`,
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-[#080B12] text-[#E8EDF5] min-h-screen flex flex-col antialiased">
        <GoogleTag />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
