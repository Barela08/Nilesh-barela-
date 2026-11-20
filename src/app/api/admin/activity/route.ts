import { NextRequest, NextResponse } from 'next/server';
import { dbAdminActivity } from '@/lib/db';
import { verifyAdminSessionToken } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;

    if (!token || !verifyAdminSessionToken(token).valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const logs = dbAdminActivity.getAll(limit);

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (err: any) {
    console.error('Activity logs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
