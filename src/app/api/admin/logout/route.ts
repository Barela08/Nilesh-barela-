import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, revokeSession, getClientIp } from '@/lib/security';
import { dbAdminActivity } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('hp_admin_auth')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const ip = getClientIp(req);

    if (token) {
      const verified = verifyAdminSessionToken(token);
      if (verified.sessionId) {
        revokeSession(verified.sessionId);
      }
      if (verified.email) {
        dbAdminActivity.log({
          action: 'LOGOUT',
          targetType: 'auth',
          description: `Admin logged out and session revoked (${verified.sessionId || 'token'})`,
          adminEmail: verified.email,
          ipAddress: ip,
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out and session revoked successfully',
    });

    response.cookies.set('hp_admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
