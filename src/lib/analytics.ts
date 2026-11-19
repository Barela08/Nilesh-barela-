// Analytics & Conversion Tracking Module for HackifyPro

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-3EWJFLZ3QZ';
export const ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || '';

export type ConversionType = 'appointment' | 'enquiry' | 'quote' | 'signup';

const CONVERSION_LABELS: Record<ConversionType, string> = {
  appointment: process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL_APPOINTMENT || '',
  enquiry: process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL_ENQUIRY || '',
  quote: process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL_QUOTE || '',
  signup: process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL_SIGNUP || '',
};

/**
 * Fires a general GA4 event
 * Ensures no personally identifiable information (PII) is included.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Filter out any potential PII keys
  const safeParams: Record<string, any> = {};
  const prohibitedKeys = ['name', 'fullname', 'email', 'phone', 'address', 'password', 'notes', 'message'];

  for (const [key, value] of Object.entries(params)) {
    if (!prohibitedKeys.includes(key.toLowerCase())) {
      safeParams[key] = value;
    }
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, safeParams);
    console.log(`[GA4 Event] ${eventName}:`, safeParams);
  } else {
    console.debug(`[GA4 Mock] Event '${eventName}' logged:`, safeParams);
  }
}

/**
 * Tracks WhatsApp button click
 */
export function trackWhatsAppClick(location: string) {
  trackEvent('whatsapp_click', {
    click_location: location,
    target: 'whatsapp_direct',
  });
}

/**
 * Tracks Phone call button click
 */
export function trackPhoneClick(location: string) {
  trackEvent('phone_call_click', {
    click_location: location,
    target: 'phone_direct',
  });
}

/**
 * Triggers a Google Ads conversion action only if validated and not previously fired for this transactionId
 */
export function trackConversion(type: ConversionType, transactionId: string, value: number = 0) {
  if (typeof window === 'undefined') return false;

  // Prevent repeat firing on page refresh
  const storageKey = `hp_conv_${type}_${transactionId}`;
  if (sessionStorage.getItem(storageKey)) {
    console.log(`[Conversion] Already fired for transaction ${transactionId}, skipping duplicate.`);
    return false;
  }

  // Record in session to lock against re-firing
  sessionStorage.setItem(storageKey, 'fired_' + Date.now());

  // 1. Fire GA4 custom event
  trackEvent(`conversion_${type}`, {
    transaction_id: transactionId,
    value: value,
    currency: 'INR',
  });

  // 2. Fire Google Ads conversion if configured
  const label = CONVERSION_LABELS[type];
  if (ADS_CONVERSION_ID && label && typeof window.gtag === 'function') {
    const sendTo = `${ADS_CONVERSION_ID}/${label}`;
    window.gtag('event', 'conversion', {
      send_to: sendTo,
      transaction_id: transactionId,
      value: value,
      currency: 'INR',
    });
    console.log(`[Google Ads Conversion] Fired ${type} to ${sendTo} with ID: ${transactionId}`);
  } else {
    console.info(
      `[Google Ads Conversion] Note: Google Ads conversion ID or label for '${type}' is awaiting configuration. (GA4 event tracked cleanly with Measurement ID ${GA_MEASUREMENT_ID}).`
    );
  }

  return true;
}
