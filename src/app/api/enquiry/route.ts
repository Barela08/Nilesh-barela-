import { NextRequest, NextResponse } from 'next/server';
import { dbEnquiries } from '@/lib/db';
import { checkRateLimit, checkDuplicateSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';
import { getClientIp, cleanText, isValidEmail, isValidPhone, sanitizeHtml } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limit Check (Max 5 requests per 10 mins per IP)
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few moments before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid submission data.' }, { status: 400 });
    }

    // 2. Anti-Bot Honeypot Trap
    if (body.hp_website_trap || body.b_url) {
      return NextResponse.json({ error: 'Bot activity detected.' }, { status: 400 });
    }

    // 3. Strict Input Sanitization & Bounds Checking
    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 120).toLowerCase();
    const phone = cleanText(body.phone, 25);
    const company = body.company ? cleanText(body.company, 120) : undefined;
    const interestedService = cleanText(body.interestedService || 'General Inquiry', 100);
    const budgetRange = body.budgetRange ? cleanText(body.budgetRange, 60) : undefined;
    const timeline = body.timeline ? cleanText(body.timeline, 60) : undefined;
    const message = cleanText(body.message, 3000);

    // 4. Validate Required Fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required fields.' },
        { status: 400 }
      );
    }

    // 5. Strict Email & Phone Format Validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (e.g. +91 9876543210).' },
        { status: 400 }
      );
    }

    // 6. Duplicate Prevention Lock
    const hash = `${email}_${phone}_${message.slice(0, 30)}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'A duplicate enquiry has already been recorded. Our team will contact you shortly.' },
        { status: 409 }
      );
    }

    // 7. Record Sanitized Data
    const enquiry = dbEnquiries.create({
      name: sanitizeHtml(name),
      email: email,
      phone: sanitizeHtml(phone),
      company: company ? sanitizeHtml(company) : undefined,
      interestedService: sanitizeHtml(interestedService),
      budgetRange: budgetRange ? sanitizeHtml(budgetRange) : undefined,
      timeline: timeline ? sanitizeHtml(timeline) : undefined,
      message: sanitizeHtml(message),
      visitorId: body.visitorId ? cleanText(body.visitorId, 64) : undefined,
      ipAddress: ip,
    });

    // 8. Notify Team
    await notifyNewLead('Enquiry', enquiry);

    return NextResponse.json({
      success: true,
      id: enquiry.id,
      message: 'Enquiry submitted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process enquiry. Please try again shortly.' },
      { status: 500 }
    );
  }
}
