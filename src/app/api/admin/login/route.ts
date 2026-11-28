import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyPassword, 
  generateAdminSessionToken, 
  getClientIp, 
  cleanText, 
  isValidEmail,
  getAdminUsers,
  AdminUser
} from '@/lib/security';
import { checkLoginBruteForce, recordLoginAttempt } from '@/lib/rateLimit';
import { dbAdminActivity } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const email = cleanText(body.email, 120).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    }

    // 1. Check Anti-Brute-Force & Progressive Cooldown
    const bruteStatus = checkLoginBruteForce(ip, email);
    if (bruteStatus.locked) {
      dbAdminActivity.log({
        action: 'BRUTE_FORCE_LOCKOUT',
        targetType: 'auth',
        description: `Login blocked by progressive cooldown for IP: ${ip} (cooldown: ${bruteStatus.retryAfterSeconds}s)`,
        adminEmail: email,
        ipAddress: ip,
      });

      return NextResponse.json(
        { 
          error: `Access temporarily locked due to repeated failed attempts. Please retry in ${bruteStatus.retryAfterSeconds} second(s).`,
          retryAfterSeconds: bruteStatus.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Lookup Admin User (process.env.ADMIN_PASSWORD overrides when configured)
    const users = getAdminUsers();
    let matchedUser: AdminUser | undefined = users.find((u) => u.email === email);

    const envEmail = (process.env.ADMIN_EMAIL || 'hackifypro@gmail.com').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || '';
    let isPasswordValid = false;

    if (envPass && email === envEmail) {
      isPasswordValid = await verifyPassword(password, envPass);
      if (isPasswordValid && !matchedUser) {
        matchedUser = {
          id: 'usr-owner-env',
          email: envEmail,
          role: 'owner',
          passwordHash: '',
          name: 'Nilesh Barela (Owner)',
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (!isPasswordValid && matchedUser) {
      isPasswordValid = await verifyPassword(password, matchedUser.passwordHash);
    }

    if (matchedUser && isPasswordValid) {
      // Clear failed attempts
      recordLoginAttempt(ip, email, true);

      // Generate cryptographically signed HMAC SHA-256 session token with unique Session ID
      const session = generateAdminSessionToken(matchedUser.email, matchedUser.role, 24);

      dbAdminActivity.log({
        action: 'LOGIN_SUCCESS',
        targetType: 'auth',
        targetId: matchedUser.id,
        description: `Admin login successful (${matchedUser.role}) from IP: ${ip}`,
        adminEmail: matchedUser.email,
        ipAddress: ip,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        user: { 
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email, 
          role: matchedUser.role 
        },
        token: session.token,
      });

      response.cookies.set('hp_admin_auth', session.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      response.cookies.set('hp_gate_pass', 'authorized', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 3. Failed Login Handling (Safe generic error)
    recordLoginAttempt(ip, email, false);

    dbAdminActivity.log({
      action: 'LOGIN_FAILED',
      targetType: 'auth',
      description: `Failed login attempt for account "${email}" from IP: ${ip}`,
      adminEmail: email,
      ipAddress: ip,
    });

    return NextResponse.json(
      { error: 'Invalid credentials provided. Please check your email and password.' },
      { status: 401 }
    );
  } catch (err: any) {
    console.error('Login route error:', err);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
