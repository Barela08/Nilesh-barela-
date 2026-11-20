import { NextRequest, NextResponse } from 'next/server';
import { dbVisitorIntelligence } from '@/lib/visitorIntelligence';
import { authenticateAdminRequest } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req, 'view_analytics');
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error, requiredRole: 'viewer or above', currentRole: auth.user?.role },
        { status: auth.status || 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const visitorId = searchParams.get('id');
    const wantFunnel = searchParams.get('funnel') === 'true';

    // 1. Single Visitor Detail
    if (visitorId) {
      const profile = dbVisitorIntelligence.getVisitorById(visitorId);
      if (!profile) {
        return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, profile });
    }

    // 2. Funnel Conversion Metrics
    if (wantFunnel) {
      const funnel = dbVisitorIntelligence.getFunnelStats();
      return NextResponse.json({ success: true, funnel });
    }

    // 3. Filtered Visitors List
    const status = (searchParams.get('status') || 'all') as any;
    const visitCount = (searchParams.get('visitCount') || 'all') as any;
    const formFilter = (searchParams.get('formFilter') || 'all') as any;
    const range = (searchParams.get('range') || '7d') as any;
    const search = searchParams.get('search') || undefined;

    const visitors = dbVisitorIntelligence.getVisitorsList({
      status,
      visitCount,
      formFilter,
      range,
      search,
    });

    const funnel = dbVisitorIntelligence.getFunnelStats();

    return NextResponse.json({
      success: true,
      visitors,
      total: visitors.length,
      funnel,
    });
  } catch (err: any) {
    console.error('Admin visitors API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
