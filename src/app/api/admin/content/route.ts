import { NextRequest, NextResponse } from 'next/server';
import { dbSiteContent, dbAdminActivity } from '@/lib/db';
import { verifyAdminSessionToken } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const content = dbSiteContent.get();
    return NextResponse.json({
      success: true,
      content,
    });
  } catch (err: any) {
    console.error('Content GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
    const authCheck = verifyAdminSessionToken(token || '');

    if (!token || !authCheck.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updated = dbSiteContent.update(body);

    dbAdminActivity.log({
      action: 'UPDATE_SITE_CONTENT',
      targetType: 'content',
      description: 'Updated website content, links, services, or section visibility',
      adminEmail: authCheck.email || 'admin@hackifypro.com',
    });

    return NextResponse.json({
      success: true,
      content: updated,
      message: 'Website content updated successfully',
    });
  } catch (err: any) {
    console.error('Content PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
