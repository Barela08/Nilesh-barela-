import { NextRequest, NextResponse } from 'next/server';
import { dbMedia, dbAdminActivity } from '@/lib/db';
import { verifyAdminSessionToken, cleanText } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;

    if (!token || !verifyAdminSessionToken(token).valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    let items = dbMedia.getAll();

    if (type !== 'all') {
      items = items.filter((m) => m.mediaType === type);
    }

    if (q) {
      items = items.filter(
        (m) =>
          m.filename.toLowerCase().includes(q) ||
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.altText && m.altText.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      media: items,
      total: items.length,
    });
  } catch (err: any) {
    console.error('Media list API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
    const authCheck = verifyAdminSessionToken(token || '');

    if (!token || !authCheck.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Missing media ID' }, { status: 400 });
    }

    const id = cleanText(body.id, 64);
    const updates: any = {};
    if (body.title !== undefined) updates.title = cleanText(body.title, 150);
    if (body.altText !== undefined) updates.altText = cleanText(body.altText, 200);
    if (body.caption !== undefined) updates.caption = cleanText(body.caption, 300);

    const updated = dbMedia.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    dbAdminActivity.log({
      action: 'UPDATE_MEDIA_METADATA',
      targetType: 'media',
      targetId: id,
      description: `Updated metadata for media: ${updated.filename}`,
      adminEmail: authCheck.email || 'admin@hackifypro.com',
    });

    return NextResponse.json({ success: true, media: updated });
  } catch (err: any) {
    console.error('Media patch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
    const authCheck = verifyAdminSessionToken(token || '');

    if (!token || !authCheck.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Missing media ID' }, { status: 400 });
    }

    const item = dbMedia.getById(id);
    if (!item) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check if in use
    const usage = dbMedia.checkInUse(item.url);
    if (usage.inUse && !force) {
      return NextResponse.json({
        error: 'Media is currently in use on the website.',
        inUse: true,
        references: usage.references,
      }, { status: 409 });
    }

    const deleted = dbMedia.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }

    dbAdminActivity.log({
      action: 'DELETE_MEDIA',
      targetType: 'media',
      targetId: id,
      description: `Deleted media file: ${item.filename} (${item.url})`,
      adminEmail: authCheck.email || 'admin@hackifypro.com',
    });

    return NextResponse.json({ success: true, message: 'Media successfully deleted' });
  } catch (err: any) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
