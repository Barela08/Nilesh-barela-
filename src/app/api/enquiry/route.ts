import { NextRequest, NextResponse } from 'next/server';
import { dbEnquiries } from '@/lib/db';
import { checkRateLimit, checkDuplicateSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // 1. Rate Limit Check
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few moments before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, company, interestedService, budgetRange, timeline, message } = body;

    // 2. Validate
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required fields.' },
        { status: 400 }
      );
    }

    // 3. Duplicate Prevention
    const hash = `${email.toLowerCase()}_${phone}_${message.slice(0, 30)}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'A duplicate enquiry has already been recorded. Our team will contact you shortly.' },
        { status: 409 }
      );
    }

    // 4. Record to Database
    const enquiry = dbEnquiries.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company ? company.trim() : undefined,
      interestedService: interestedService || 'General Inquiry',
      budgetRange,
      timeline,
      message: message.trim(),
      ipAddress: ip,
    });

    // 5. Notify Team
    await notifyNewLead('Enquiry', enquiry);

    return NextResponse.json({
      success: true,
      id: enquiry.id,
      message: 'Enquiry submitted successfully.',
    });
  } catch (error: any) {
    console.error('Error handling enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry.' },
      { status: 500 }
    );
  }
}
