import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin',
          '/appointment-confirmation',
          '/enquiry-confirmation',
          '/request-received',
          '/confirmation',
        ],
      },
    ],
    sitemap: 'https://nileshbarela.site/sitemap.xml',
  };
}
