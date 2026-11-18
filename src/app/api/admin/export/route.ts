import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments, dbEnquiries, dbQuotes } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const appointments = dbAppointments.getAll();
    const enquiries = dbEnquiries.getAll();
    const quotes = dbQuotes.getAll();

    const rows: string[] = [];
    rows.push(['Type', 'Reference ID', 'Name', 'Email', 'Phone', 'Company', 'Service / Scope', 'Budget', 'Status', 'Date Submitted'].join(','));

    for (const a of appointments) {
      rows.push([
        'Appointment',
        `"${a.id}"`,
        `"${a.fullName}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        `"${a.companyName || ''}"`,
        `"${a.serviceRequired}"`,
        `"${a.projectBudget || ''}"`,
        `"${a.status}"`,
        `"${a.createdAt}"`,
      ].join(','));
    }

    for (const e of enquiries) {
      rows.push([
        'Enquiry',
        `"${e.id}"`,
        `"${e.name}"`,
        `"${e.email}"`,
        `"${e.phone}"`,
        `"${e.company || ''}"`,
        `"${e.interestedService}"`,
        `"${e.budgetRange || ''}"`,
        `"${e.status}"`,
        `"${e.createdAt}"`,
      ].join(','));
    }

    for (const q of quotes) {
      rows.push([
        'Quote',
        `"${q.id}"`,
        `"${q.name}"`,
        `"${q.email}"`,
        `"${q.phone}"`,
        `"${q.company || ''}"`,
        `"${q.requiredService}"`,
        `"${q.estimatedBudget}"`,
        `"${q.status}"`,
        `"${q.createdAt}"`,
      ].join(','));
    }

    const csvContent = rows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="hackifypro-leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
