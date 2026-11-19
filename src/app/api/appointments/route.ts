import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments } from '@/lib/db';
import { checkRateLimit, checkDuplicateSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';
import { getClientIp, cleanText, isValidEmail, isValidPhone, sanitizeHtml } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Check Rate Limit (Max 5 requests per 10 mins per IP)
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid submission data.' }, { status: 400 });
    }

    // 2. Anti-Bot Honeypot Trap
    // Bots automatically populate hidden fields like hp_website_trap or b_url
    if (body.hp_website_trap || body.b_url) {
      return NextResponse.json({ error: 'Bot activity detected.' }, { status: 400 });
    }

    // 3. Strict Input Sanitization & Bounds Checking
    const fullName = cleanText(body.fullName, 100);
    const email = cleanText(body.email, 120).toLowerCase();
    const phone = cleanText(body.phone, 25);
    const companyName = body.companyName ? cleanText(body.companyName, 120) : undefined;
    const serviceRequired = cleanText(body.serviceRequired, 100);
    const preferredDate = cleanText(body.preferredDate, 30);
    const preferredTime = cleanText(body.preferredTime, 30);
    const projectBudget = body.projectBudget ? cleanText(body.projectBudget, 60) : undefined;
    const projectDescription = cleanText(body.projectDescription, 3000);

    // 4. Validate Required Fields
    if (!fullName || !email || !phone || !serviceRequired || !preferredDate || !preferredTime || !projectDescription) {
      return NextResponse.json(
        { error: 'Please fill in all required appointment fields.' },
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

    // 6. Date Validity & Boundaries (Must be upcoming date within 365 days)
    const selectedDate = new Date(preferredDate);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid appointment date format.' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + 365);

    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book an appointment in the past. Please select an upcoming date.' },
        { status: 400 }
      );
    }

    if (selectedDate > maxFutureDate) {
      return NextResponse.json(
        { error: 'Appointments can only be scheduled up to 1 year in advance.' },
        { status: 400 }
      );
    }

    // 7. Duplicate Submission Lock (Same email + date within 60 seconds)
    const hash = `${email}_${preferredDate}_${preferredTime}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'A duplicate appointment request was already received. Please check your confirmation.' },
        { status: 409 }
      );
    }

    // 8. Save Sanitized Record to Database
    const appointment = dbAppointments.create({
      fullName: sanitizeHtml(fullName),
      email: email,
      phone: sanitizeHtml(phone),
      companyName: companyName ? sanitizeHtml(companyName) : undefined,
      serviceRequired: sanitizeHtml(serviceRequired),
      preferredDate: sanitizeHtml(preferredDate),
      preferredTime: sanitizeHtml(preferredTime),
      projectBudget: projectBudget ? sanitizeHtml(projectBudget) : undefined,
      projectDescription: sanitizeHtml(projectDescription),
      ipAddress: ip,
    });

    // 9. Dispatch Lead Notification
    await notifyNewLead('Appointment', appointment);

    return NextResponse.json({
      success: true,
      id: appointment.id,
      message: 'Appointment scheduled successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again shortly.' },
      { status: 500 }
    );
  }
}
