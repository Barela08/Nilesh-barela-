import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments, dbEnquiries, dbQuotes, dbAdminActivity } from '@/lib/db';
import { authenticateAdminRequest, verifyAdminSessionToken, cleanText } from '@/lib/security';

function getAdminEmail(req: NextRequest): string {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || req.cookies.get('hp_admin_auth')?.value;
  if (token) {
    const verified = verifyAdminSessionToken(token);
    if (verified.valid && verified.email) return verified.email;
  }
  return 'admin@hackifypro.com';
}

export async function GET(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const appointments = dbAppointments.getAll();
    const enquiries = dbEnquiries.getAll();
    const quotes = dbQuotes.getAll();

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        enquiries,
        quotes,
        metrics: {
          totalLeads: appointments.length + enquiries.length + quotes.length,
          totalAppointments: appointments.length,
          totalEnquiries: enquiries.length,
          totalQuotes: quotes.length,
          newAppointments: appointments.filter((a) => a.status === 'new').length,
          newEnquiries: enquiries.filter((e) => e.status === 'new').length,
          newQuotes: quotes.filter((q) => q.status === 'new').length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const type = cleanText(body.type, 20).toLowerCase();
    const id = cleanText(body.id, 50);

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    const updates: any = {};
    if (body.status !== undefined) updates.status = cleanText(body.status, 30);
    if (body.notes !== undefined) updates.notes = cleanText(body.notes, 1000);
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.followUpDate !== undefined) updates.followUpDate = cleanText(body.followUpDate, 50);
    if (body.meetingLink !== undefined) updates.meetingLink = cleanText(body.meetingLink, 300);
    if (body.isRead !== undefined) updates.isRead = Boolean(body.isRead);
    if (body.isSpam !== undefined) updates.isSpam = Boolean(body.isSpam);

    let updated = null;
    if (type === 'appointment') {
      updated = dbAppointments.updateDetails(id, updates);
    } else if (type === 'enquiry') {
      updated = dbEnquiries.updateDetails(id, updates);
    } else if (type === 'quote') {
      updated = dbQuotes.updateDetails(id, updates);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    dbAdminActivity.log({
      action: 'UPDATE_LEAD',
      targetType: 'lead',
      targetId: id,
      description: `Updated ${type} ${id}: status=${updates.status || 'unchanged'}`,
      adminEmail: getAdminEmail(req),
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') || '').toLowerCase();
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    let deleted = false;
    if (type === 'appointment') {
      deleted = dbAppointments.delete(id);
    } else if (type === 'enquiry') {
      deleted = dbEnquiries.delete(id);
    } else if (type === 'quote') {
      deleted = dbQuotes.delete(id);
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Record not found or already deleted' }, { status: 404 });
    }

    dbAdminActivity.log({
      action: 'DELETE_LEAD',
      targetType: 'lead',
      targetId: id,
      description: `Deleted ${type} record: ${id}`,
      adminEmail: getAdminEmail(req),
    });

    return NextResponse.json({ success: true, message: `${type} deleted successfully` });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete lead record' }, { status: 500 });
  }
}
