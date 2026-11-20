import { NextRequest, NextResponse } from 'next/server';
import { dbAnalytics } from '@/lib/db';
import { verifyAdminSessionToken } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing admin session token' }, { status: 401 });
    }

    const verification = verifyAdminSessionToken(token);
    if (!verification.valid) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired session' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get('range') || '7d';
    const validRanges = ['today', '7d', '30d', '90d', 'all'] as const;
    const range = validRanges.includes(rangeParam as any) ? (rangeParam as any) : '7d';

    const stats = dbAnalytics.getStats(range);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    console.error('Admin analytics API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
