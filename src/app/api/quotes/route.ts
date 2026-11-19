import { NextRequest, NextResponse } from 'next/server';
import { dbQuotes } from '@/lib/db';
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
        { error: 'Rate limit exceeded. Please wait before submitting another quote request.' },
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
    const requiredService = cleanText(body.requiredService, 100);
    const projectScope = cleanText(body.projectScope || 'New Project', 100);
    const estimatedBudget = cleanText(body.estimatedBudget || 'Flexible', 60);
    const expectedTimeline = cleanText(body.expectedTimeline || 'Flexible', 60);
    const additionalRequirements = cleanText(body.additionalRequirements, 3000);

    // 4. Validate Required Fields
    if (!name || !email || !phone || !requiredService || !additionalRequirements) {
      return NextResponse.json(
        { error: 'Please provide all required proposal specifications.' },
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

    // 6. Duplicate Submission Lock
    const hash = `${email}_${requiredService}_${additionalRequirements.slice(0, 30)}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Your quotation request has already been registered. A proposal is being generated.' },
        { status: 409 }
      );
    }

    // 7. Save Sanitized Record to Database
    const quote = dbQuotes.create({
      name: sanitizeHtml(name),
      email: email,
      phone: sanitizeHtml(phone),
      company: company ? sanitizeHtml(company) : undefined,
      requiredService: sanitizeHtml(requiredService),
      projectScope: sanitizeHtml(projectScope),
      estimatedBudget: sanitizeHtml(estimatedBudget),
      expectedTimeline: sanitizeHtml(expectedTimeline),
      additionalRequirements: sanitizeHtml(additionalRequirements),
      ipAddress: ip,
    });

    // 8. Dispatch Lead Notification
    await notifyNewLead('Quote', quote);

    return NextResponse.json({
      success: true,
      id: quote.id,
      message: 'Quotation request received successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to submit quote request. Please try again shortly.' },
      { status: 500 }
    );
  }
}
