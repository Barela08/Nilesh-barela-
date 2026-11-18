'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID, ADS_CONVERSION_ID } from '@/lib/analytics';

export default function GoogleTag() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            ${
              ADS_CONVERSION_ID
                ? `gtag('config', '${ADS_CONVERSION_ID}');`
                : ''
            }
          `,
        }}
      />
    </>
  );
}
