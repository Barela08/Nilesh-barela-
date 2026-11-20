import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'hackifypro_secret_session_key_2026';
const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// 1. ROLE & PERMISSION DEFINITIONS
// -------------------------------------------------------------
export type AdminRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  passwordHash: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  owner: [
    '*', // full super admin access
    'manage_projects',
    'manage_media',
    'manage_content',
    'manage_leads',
    'delete_leads',
    'manage_security',
    'view_analytics',
    'export_data',
  ],
  admin: [
    'manage_projects',
    'manage_media',
    'manage_content',
    'manage_leads',
    'view_analytics',
    'export_data',
  ],
  editor: [
    'manage_projects',
    'manage_media',
    'manage_content',
    'view_leads',
    'view_analytics',
  ],
  viewer: [
    'view_analytics',
    'view_projects',
    'view_leads',
  ],
};

export function hasPermission(role: AdminRole, permission: string): boolean {
  if (role === 'owner') return true;
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}

// -------------------------------------------------------------
// 2. PASSWORD HASHING (BCRYPT)
// -------------------------------------------------------------
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashOrPlain: string): Promise<boolean> {
  if (!plainText || !hashOrPlain) return false;
  // If already a bcrypt hash (starts with $2a$, $2b$, etc.)
  if (hashOrPlain.startsWith('$2')) {
    try {
      return await bcrypt.compare(plainText, hashOrPlain);
    } catch {
      return false;
    }
  }
  // Fallback for initial bootstrap plain text equality check
  return safeCompare(plainText, hashOrPlain);
}

// -------------------------------------------------------------
// 3. ADMIN USERS PERSISTENCE
// -------------------------------------------------------------
function getUsersFilePath(): string {
  return path.join(DATA_DIR, 'admin_users.json');
}

export function getAdminUsers(): AdminUser[] {
  try {
    const filePath = getUsersFilePath();
    if (!fs.existsSync(filePath)) {
      // Seed default owner with hashed password
      const defaultPass = process.env.ADMIN_PASSWORD || 'HackifyPro@2026!';
      const salt = bcrypt.genSaltSync(12);
      const defaultHash = bcrypt.hashSync(defaultPass, salt);
      const initialUsers: AdminUser[] = [
        {
          id: 'usr-owner-01',
          email: (process.env.ADMIN_EMAIL || 'hackifypro@gmail.com').toLowerCase(),
          role: 'owner',
          passwordHash: defaultHash,
          name: 'Nilesh Barela (Owner)',
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(filePath, JSON.stringify(initialUsers, null, 2), 'utf-8');
      return initialUsers;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin users:', err);
    return [];
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    const filePath = getUsersFilePath();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin users:', err);
  }
}

// -------------------------------------------------------------
// 4. SESSION REVOCATION STORE
// -------------------------------------------------------------
function getRevocationFilePath(): string {
  return path.join(DATA_DIR, 'revoked_sessions.json');
}

function getRevokedSessions(): Set<string> {
  try {
    const filePath = getRevocationFilePath();
    if (!fs.existsSync(filePath)) return new Set();
    const raw = fs.readFileSync(filePath, 'utf-8');
    const list: string[] = JSON.parse(raw);
    return new Set(list);
  } catch {
    return new Set();
  }
}

export function revokeSession(sessionId: string): void {
  try {
    const filePath = getRevocationFilePath();
    const revoked = getRevokedSessions();
    revoked.add(sessionId);
    fs.writeFileSync(filePath, JSON.stringify(Array.from(revoked)), 'utf-8');
  } catch (err) {
    console.error('Error revoking session:', err);
  }
}

// -------------------------------------------------------------
// 5. SESSION TOKEN GENERATION & VERIFICATION
// -------------------------------------------------------------
export function generateAdminSessionToken(
  email: string,
  role: AdminRole = 'owner',
  expiresInHours: number = 24
): { token: string; sessionId: string; expiresAt: number } {
  const sessionId = `sess_${Date.now().toString(36)}_${crypto.randomBytes(8).toString('hex')}`;
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  
  const payload = Buffer.from(
    JSON.stringify({ sessionId, email: email.toLowerCase(), role, expiresAt, v: 2 })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');

  return {
    token: `${payload}.${signature}`,
    sessionId,
    expiresAt,
  };
}

export function verifyAdminSessionToken(token: string): {
  valid: boolean;
  email?: string;
  role?: AdminRole;
  sessionId?: string;
  error?: string;
} {
  if (!token || typeof token !== 'string') return { valid: false, error: 'Missing token' };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, error: 'Malformed token' };

  const [payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');

  if (!safeCompare(signature, expectedSig)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.expiresAt || Date.now() > data.expiresAt) {
      return { valid: false, error: 'Session expired' };
    }

    // Check if session has been explicitly revoked upon logout
    if (data.sessionId && getRevokedSessions().has(data.sessionId)) {
      return { valid: false, error: 'Session has been revoked / logged out' };
    }

    return {
      valid: true,
      email: data.email,
      role: (data.role as AdminRole) || 'owner',
      sessionId: data.sessionId,
    };
  } catch {
    return { valid: false, error: 'Invalid token payload' };
  }
}

/**
 * Extracts and verifies admin authorization from NextRequest.
 */
export function authenticateAdminRequest(
  req: NextRequest,
  requiredPermission?: string
): { authenticated: boolean; user?: { email: string; role: AdminRole; sessionId?: string }; error?: string; status?: number } {
  const token = req.cookies.get('hp_admin_auth')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return { authenticated: false, error: 'Unauthorized: Missing session token', status: 401 };
  }

  const verified = verifyAdminSessionToken(token);
  if (!verified.valid || !verified.email) {
    return { authenticated: false, error: verified.error || 'Unauthorized: Invalid session', status: 401 };
  }

  const role: AdminRole = verified.role || 'owner';

  // Permission check
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return {
      authenticated: false,
      error: 'ACCESS_RESTRICTED',
      user: { email: verified.email, role, sessionId: verified.sessionId },
      status: 403,
    };
  }

  return {
    authenticated: true,
    user: { email: verified.email, role, sessionId: verified.sessionId },
  };
}

// -------------------------------------------------------------
// 6. SANITIZATION & INPUT VALIDATION
// -------------------------------------------------------------
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

export function cleanText(str: any, maxLength: number = 500): string {
  if (typeof str !== 'string') return '';
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 120) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string' || phone.length > 25) return false;
  const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a || '', 'utf8');
  const bufB = Buffer.from(b || '', 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

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
