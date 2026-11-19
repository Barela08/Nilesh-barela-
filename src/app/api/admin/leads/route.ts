import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments, dbEnquiries, dbQuotes } from '@/lib/db';
import { authenticateAdminRequest, cleanText } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    // 1. Mandatory Admin Authentication
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
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
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // 1. Mandatory Admin Authentication
    if (!authenticateAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const type = cleanText(body.type, 20).toLowerCase();
    const id = cleanText(body.id, 50);
    const status = cleanText(body.status, 30);
    const notes = body.notes !== undefined ? cleanText(body.notes, 500) : undefined;

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing type, id, or status' }, { status: 400 });
    }

    let updated = null;
    if (type === 'appointment') {
      updated = dbAppointments.updateStatus(id, status as any, notes);
    } else if (type === 'enquiry') {
      updated = dbEnquiries.updateStatus(id, status as any, notes);
    } else if (type === 'quote') {
      updated = dbQuotes.updateStatus(id, status as any, notes);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, record: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}
