import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments, dbEnquiries, dbQuotes } from '@/lib/db';
import { authenticateAdminRequest, sanitizeCsvCell } from '@/lib/security';

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

    const rows: string[] = [];
    rows.push([
      'Type', 
      'Reference ID', 
      'Name', 
      'Email', 
      'Phone', 
      'Company', 
      'Service / Scope', 
      'Budget', 
      'Status', 
      'Date Submitted'
    ].join(','));

    for (const a of appointments) {
      rows.push([
        sanitizeCsvCell('Appointment'),
        sanitizeCsvCell(a.id),
        sanitizeCsvCell(a.fullName),
        sanitizeCsvCell(a.email),
        sanitizeCsvCell(a.phone),
        sanitizeCsvCell(a.companyName || ''),
        sanitizeCsvCell(a.serviceRequired),
        sanitizeCsvCell(a.projectBudget || ''),
        sanitizeCsvCell(a.status),
        sanitizeCsvCell(a.createdAt),
      ].join(','));
    }

    for (const e of enquiries) {
      rows.push([
        sanitizeCsvCell('Enquiry'),
        sanitizeCsvCell(e.id),
        sanitizeCsvCell(e.name),
        sanitizeCsvCell(e.email),
        sanitizeCsvCell(e.phone),
        sanitizeCsvCell(e.company || ''),
        sanitizeCsvCell(e.interestedService),
        sanitizeCsvCell(e.budgetRange || ''),
        sanitizeCsvCell(e.status),
        sanitizeCsvCell(e.createdAt),
      ].join(','));
    }

    for (const q of quotes) {
      rows.push([
        sanitizeCsvCell('Quote'),
        sanitizeCsvCell(q.id),
        sanitizeCsvCell(q.name),
        sanitizeCsvCell(q.email),
        sanitizeCsvCell(q.phone),
        sanitizeCsvCell(q.company || ''),
        sanitizeCsvCell(q.requiredService),
        sanitizeCsvCell(q.estimatedBudget),
        sanitizeCsvCell(q.status),
        sanitizeCsvCell(q.createdAt),
      ].join(','));
    }

    const csvContent = rows.join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="hackifypro-leads-${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
