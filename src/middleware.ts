import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * HACKIFYPRO SECURITY MIDDLEWARE
 * 1. Complete protection & blocking of .env, .git, data, configs, and debug files.
 * 2. Admin URL Cloaking / Stealth Gateway:
 *    - Direct /admin access returns 404 Not Found unless authorized.
 *    - Dedicated Secret Slug (default: /hp-portal-2026) or ?key= passkey grants gate access.
 *    - Sets secure httpOnly gatepass cookie 'hp_gate_pass'.
 */

// Forbidden patterns that should never be reachable via HTTP
const BLOCKED_PATTERNS = [
  /^\/\.env(\..+)?$/i,
  /^\/\.git(\/.*)?$/i,
  /^\/\.svn(\/.*)?$/i,
  /^\/data(\/.*)?$/i,
  /^\/package(-lock)?\.json$/i,
  /^\/tsconfig\.json$/i,
  /^\/\.vscode(\/.*)?$/i,
  /^\/test_.*$/i,
  /^\/.*\.log$/i,
  /^\/firebase-debug\.log.*$/i,
];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Block any direct probe to .env, .git, data directory, and config files
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      // Return genuine 404 Not Found to prevent reconnaissance
      return new NextResponse('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }
  }

  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'hackifypro_secret_session_key_2026';
  const ADMIN_SECRET_SLUG = (process.env.ADMIN_SECRET_SLUG || 'hp-portal-2026').replace(/^\//, '');

  const gatePassCookie = req.cookies.get('hp_gate_pass')?.value;
  const adminAuthCookie = req.cookies.get('hp_admin_auth')?.value;
  const authHeader = req.headers.get('authorization');
  const passkeyParam = searchParams.get('key');

  const hasGatePass = gatePassCookie === 'authorized';
  const hasAdminSession = Boolean(adminAuthCookie && adminAuthCookie.length > 20);
  const hasAuthHeader = Boolean(authHeader && authHeader.startsWith('Bearer '));
  const hasValidPasskey = Boolean(passkeyParam && passkeyParam === ADMIN_SECRET_KEY);

  // 2. Secret Slug Entry Point (e.g. /hp-portal-2026)
  if (pathname === `/${ADMIN_SECRET_SLUG}` || pathname === `/${ADMIN_SECRET_SLUG}/`) {
    // Authorized via secret slug! Rewrite to /admin and set gatepass cookie
    const url = req.nextUrl.clone();
    url.pathname = '/admin';

    const res = NextResponse.rewrite(url);
    res.cookies.set('hp_gate_pass', 'authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  }

  // 3. Direct /admin Route Cloaking
  if (pathname === '/admin' || pathname === '/admin/') {
    // If user provides valid passkey ?key=... on /admin, unlock immediately
    if (hasValidPasskey) {
      const url = req.nextUrl.clone();
      url.searchParams.delete('key'); // Clean key from address bar
      const res = NextResponse.redirect(url);
      res.cookies.set('hp_gate_pass', 'authorized', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    // If user has gatepass or active authenticated admin session, permit access
    if (hasGatePass || hasAdminSession) {
      return NextResponse.next();
    }

    // Unauthorized visitor or bot scanning /admin: Return 404 Not Found!
    const notFoundUrl = req.nextUrl.clone();
    notFoundUrl.pathname = '/_not-found';
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  // 4. Protect /api/admin/* routes from unauthenticated scanners
  if (pathname.startsWith('/api/admin')) {
    // If public login/unlock or has valid authorization, let through to API route
    if (hasGatePass || hasAdminSession || hasAuthHeader) {
      return NextResponse.next();
    }

    // Allow login and emergency unlock endpoints so admin can sign in
    if (pathname === '/api/admin/login' || pathname === '/api/admin/unlock') {
      return NextResponse.next();
    }

    // All other /api/admin/* endpoints: return 404 if accessed by unknown scanners
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static assets and image optimization
  matcher: [
    '/((?!_next/static|_next/image|assets/|favicon.ico).*)',
  ],
};
