import { NextRequest, NextResponse } from 'next/server';
import { dbSiteContent, dbAdminActivity } from '@/lib/db';
import { authenticateAdminRequest } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
    }

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
    const auth = authenticateAdminRequest(req, 'manage_content');
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
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
      adminEmail: auth.user.email || 'admin@hackifypro.com',
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
