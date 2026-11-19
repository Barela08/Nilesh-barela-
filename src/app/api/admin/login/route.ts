import { NextRequest, NextResponse } from 'next/server';
import { safeCompare, generateAdminSessionToken, getClientIp, cleanText } from '@/lib/security';
import { checkLoginBruteForce, recordLoginAttempt } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Check Anti-Brute-Force Lockout
    const bruteStatus = checkLoginBruteForce(ip);
    if (bruteStatus.locked) {
      return NextResponse.json(
        { 
          error: `Too many failed attempts. Access locked for security. Please try again in ${Math.ceil(bruteStatus.retryAfterSeconds / 60)} minute(s).` 
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const email = cleanText(body.email, 120);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const expectedEmail = process.env.ADMIN_EMAIL || 'hackifypro@gmail.com';
    const expectedPass = process.env.ADMIN_PASSWORD || 'HackifyPro@2026!';

    // 2. Constant-time timing-safe credential verification
    const emailMatches = safeCompare(email.toLowerCase(), expectedEmail.toLowerCase());
    const passMatches = safeCompare(password, expectedPass);

    if (emailMatches && passMatches) {
      // Clear failed attempts upon successful login
      recordLoginAttempt(ip, true);

      // Generate cryptographically signed HMAC SHA-256 session token
      const token = generateAdminSessionToken(expectedEmail, 24);

      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        user: { email: expectedEmail, role: 'admin' },
        token,
      });

      response.cookies.set('hp_admin_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // Record failed attempt for brute-force tracking
    recordLoginAttempt(ip, false);

    return NextResponse.json(
      { error: 'Invalid administrator credentials.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}
