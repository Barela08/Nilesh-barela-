import { NextRequest, NextResponse } from 'next/server';
import { safeCompare, cleanText, getClientIp } from '@/lib/security';
import { unlockAdminAccount } from '@/lib/rateLimit';
import { dbAdminActivity } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const recoveryKey = cleanText(body.recoveryKey, 200);
    const identifier = cleanText(body.identifier, 120);

    const expectedKey = process.env.ADMIN_SECRET_KEY || 'hackifypro_secret_session_key_2026';

    if (!safeCompare(recoveryKey, expectedKey)) {
      return NextResponse.json({ error: 'Invalid recovery key.' }, { status: 403 });
    }

    // Unlock IP and Account
    unlockAdminAccount(ip);
    if (identifier) {
      unlockAdminAccount(identifier);
    } else {
      unlockAdminAccount(); // Clear all if no specific identifier
    }

    dbAdminActivity.log({
      action: 'SECURITY_UNLOCK',
      targetType: 'system',
      description: `Security lockout manually lifted for: ${identifier || ip}`,
      adminEmail: 'system_recovery@hackifypro.com',
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Lockout successfully lifted for ${identifier || ip}. You may now log in.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Unlock failed' }, { status: 500 });
  }
}
