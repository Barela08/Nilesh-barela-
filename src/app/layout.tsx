import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleTag from '@/components/shared/GoogleTag';
import FirebaseAnalytics from '@/components/shared/FirebaseAnalytics';
import WhatsAppFloating from '@/components/shared/WhatsAppFloating';
import DPDPConsentBanner from '@/components/shared/DPDPConsentBanner';
import { company } from '@/data/company';

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: 'HackifyPro | Website, Android App & Custom Software Development Company',
    template: '%s | HackifyPro',
  },
  description:
    'HackifyPro is a premier software development company in Nashik, Maharashtra founded by Nilesh Barela. We build fast websites, Android mobile apps, web applications, and management software (Hospital, Restaurant POS, Car Rental & Gym).',
  keywords: [
    'HackifyPro',
    'Nilesh Barela',
    'Nilesh Barela Founder of HackifyPro',
    'Website Development Company in Nashik',
    'Software Development Company in Nashik',
    'Android App Development in Nashik',
    'Custom Software Development in Nashik',
    'IT Solutions for Businesses in Nashik',
    'Web Application Development Maharashtra',
    'Hospital Management Software',
    'Car Rental Software',
    'Restaurant POS Software',
    'Gym Management Software',
    'Driving School Software',
    'Full Stack Web Applications',
    'Cybersecurity Education',
    'SECURE LEARN INNOVATE',
  ],
  authors: [{ name: 'Nilesh Barela', url: 'https://nileshbarela.site/nilesh-barela' }],
  creator: 'Nilesh Barela',
  publisher: 'HackifyPro',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googledbca3e63ac5f841c',
    other: {
      'google-site-verification': 'googledbca3e63ac5f841c',
      'msvalidate.01': 'googledbca3e63ac5f841c',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: company.websiteUrl,
    siteName: 'HackifyPro',
    title: 'HackifyPro | Website, Android App & Custom Software Development Company',
    description:
      'HackifyPro provides website development, Android app development, web applications and custom software solutions for businesses. Discuss your project with Nilesh Barela and the team.',
    images: [
      {
        url: `${company.websiteUrl}/assets/hackifypro-banner.png`,
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
    title: 'HackifyPro | Website, Android App & Custom Software Development Company',
    description:
      'Building Powerful Digital Solutions for Modern Businesses. Websites, Android apps, custom software, and digital innovation in Nashik, Maharashtra.',
    images: [`${company.websiteUrl}/assets/hackifypro-banner.png`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
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

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${company.websiteUrl}/#localbusiness`,
    name: 'HackifyPro - Software & Website Development Company',
    url: company.websiteUrl,
    logo: `${company.websiteUrl}/assets/hackifypro-logo.png`,
    image: `${company.websiteUrl}/assets/hackifypro-banner.png`,
    telephone: company.contact.phone,
    email: company.contact.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.localSeo.city,
      addressRegion: company.localSeo.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.9975',
      longitude: '73.7898',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Nashik' },
      { '@type': 'AdministrativeArea', name: 'Maharashtra' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: [
      'Website Development',
      'Android App Development',
      'Custom Software Development',
      'Hospital Management Software',
      'Restaurant POS Software',
      'Web Application Development',
      'Cybersecurity and IT Solutions',
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="googledbca3e63ac5f841c" />
        <meta name="msvalidate.01" content="googledbca3e63ac5f841c" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Nashik" />
        <meta name="geo.position" content="19.9975;73.7898" />
        <meta name="ICBM" content="19.9975, 73.7898" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="bg-[#080B12] text-[#E8EDF5] min-h-screen flex flex-col antialiased">
        <GoogleTag />
        <FirebaseAnalytics />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloating />
        <DPDPConsentBanner />
      </body>
    </html>
  );
}
