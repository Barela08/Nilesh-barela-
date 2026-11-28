import { NextRequest, NextResponse } from 'next/server';
import { dbAdminActivity } from '@/lib/db';
import { authenticateAdminRequest } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
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
