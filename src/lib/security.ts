import crypto from 'crypto';
import { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'hackifypro_secret_session_key_2026';

/**
 * Escapes HTML characters to prevent Stored & Reflected XSS.
 */
export function sanitizeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Normalizes and strips dangerous control characters.
 */
export function cleanText(str: any, maxLength: number = 500): string {
  if (typeof str !== 'string') return '';
  // Remove control characters except newline and tab
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Validates email format according to RFC 5322 regex.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 120) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number to prevent command or URL injection.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string' || phone.length > 25) return false;
  // Allow numbers, spaces, hyphens, parentheses, and leading plus
  const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Sanitizes CSV cell to prevent CSV / Formula Injection in Excel/Sheets.
 * If text starts with =, +, -, @, tab, or carriage return, prepends a single quote.
 */
export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Performs constant-time string comparison to prevent timing attacks.
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a || '', 'utf8');
  const bufB = Buffer.from(b || '', 'utf8');
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to keep constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generates an HMAC SHA-256 signed tamper-proof admin session token.
 */
export function generateAdminSessionToken(email: string, expiresInHours: number = 24): string {
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt, v: 1 })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

/**
 * Verifies an HMAC SHA-256 admin session token.
 */
export function verifyAdminSessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');

  if (!safeCompare(signature, expectedSig)) {
    return { valid: false };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.expiresAt || Date.now() > data.expiresAt) {
      return { valid: false }; // Expired
    }
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Extracts and verifies admin authorization from NextRequest.
 * Checks Cookie (hp_admin_auth) and Header (Authorization: Bearer <token>).
 */
export function authenticateAdminRequest(req: NextRequest): boolean {
  // 1. Check Cookie
  const cookieToken = req.cookies.get('hp_admin_auth')?.value;
  if (cookieToken && verifyAdminSessionToken(cookieToken).valid) {
    return true;
  }

  // 2. Check Authorization Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7).trim();
    if (headerToken && verifyAdminSessionToken(headerToken).valid) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts true client IP behind Cloudflare, Nginx, or reverse proxies.
 */
export function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0].trim();
    if (first) return first;
  }

  return '127.0.0.1';
}
