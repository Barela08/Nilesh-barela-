import { NextRequest, NextResponse } from 'next/server';
import { dbAnalytics } from '@/lib/db';
import { authenticateAdminRequest } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'view_analytics');
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
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
