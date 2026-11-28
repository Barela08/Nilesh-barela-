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
      return new NextResponse('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }
  }

  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || '';
  const configuredSlug = (process.env.ADMIN_SECRET_SLUG || '').trim().replace(/^\/+|\/+$/g, '');
  const allowedAdminSlugs = new Set<string>(['5659']);
  if (configuredSlug) {
    allowedAdminSlugs.add(configuredSlug);
  }
  const cleanPathname = pathname.replace(/^\/+|\/+$/g, '');

  const gatePassCookie = req.cookies.get('hp_gate_pass')?.value;
  const adminAuthCookie = req.cookies.get('hp_admin_auth')?.value;
  const authHeader = req.headers.get('authorization');
  const passkeyParam = searchParams.get('key');

  const hasGatePass = gatePassCookie === 'authorized';
  const hasAdminSession = Boolean(adminAuthCookie && adminAuthCookie.length > 20);
  const hasAuthHeader = Boolean(authHeader && authHeader.startsWith('Bearer '));
  const hasValidPasskey = Boolean(ADMIN_SECRET_KEY && passkeyParam && passkeyParam === ADMIN_SECRET_KEY);

  // 2. Secret Slug Entry Point (/5659)
  if (allowedAdminSlugs.has(cleanPathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';

    const res = NextResponse.rewrite(url);
    res.cookies.set('hp_gate_pass', 'authorized', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return res;
  }

  // 3. Cloak direct /admin access unless arriving via /5659 gatepass, valid passkey, or active session
  if (pathname === '/admin' || pathname === '/admin/') {
    if (hasGatePass || hasAdminSession || hasValidPasskey) {
      const res = NextResponse.next();
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  // 4. Protect /api/admin/* routes from unauthenticated scanners
  if (pathname.startsWith('/api/admin')) {
    if (hasGatePass || hasAdminSession || hasAuthHeader) {
      return NextResponse.next();
    }

    if (
      pathname === '/api/admin/login' ||
      pathname === '/api/admin/unlock' ||
      pathname === '/api/admin/session'
    ) {
      return NextResponse.next();
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|assets/|favicon.ico).*)',
  ],
};
