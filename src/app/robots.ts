import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/appointment-confirmation',
          '/enquiry-confirmation',
          '/request-received',
          '/confirmation',
        ],
      },
    ],
    sitemap: 'https://www.nileshbarela.site/sitemap.xml',
  };
}
