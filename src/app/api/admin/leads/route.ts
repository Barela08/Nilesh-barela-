import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments, dbEnquiries, dbQuotes } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
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
    const { type, id, status, notes } = await req.json();

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing type, id, or status' }, { status: 400 });
    }

    let updated = null;
    if (type === 'appointment') {
      updated = dbAppointments.updateStatus(id, status, notes);
    } else if (type === 'enquiry') {
      updated = dbEnquiries.updateStatus(id, status, notes);
    } else if (type === 'quote') {
      updated = dbQuotes.updateStatus(id, status, notes);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, record: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}
