import { NextRequest, NextResponse } from 'next/server';
import { dbAppointments } from '@/lib/db';
import { checkRateLimit, checkDuplicateSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // 1. Check Rate Limit (Max 5 requests per 10 mins)
    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullName, email, phone, companyName, serviceRequired, preferredDate, preferredTime, projectBudget, projectDescription } = body;

    // 2. Validate Required Fields
    if (!fullName || !email || !phone || !serviceRequired || !preferredDate || !preferredTime || !projectDescription) {
      return NextResponse.json(
        { error: 'Missing required appointment fields.' },
        { status: 400 }
      );
    }

    // 3. Prevent past dates
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book an appointment in the past. Please select an upcoming date.' },
        { status: 400 }
      );
    }

    // 4. Duplicate Lock (Same email + date within 60 seconds)
    const hash = `${email.toLowerCase()}_${preferredDate}_${preferredTime}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'A duplicate appointment request was already received. Please check your confirmation.' },
        { status: 409 }
      );
    }

    // 5. Save to Database
    const appointment = dbAppointments.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      companyName: companyName ? companyName.trim() : undefined,
      serviceRequired,
      preferredDate,
      preferredTime,
      projectBudget,
      projectDescription: projectDescription.trim(),
      ipAddress: ip,
    });

    // 6. Notify Team
    await notifyNewLead('Appointment', appointment);

    return NextResponse.json({
      success: true,
      id: appointment.id,
      message: 'Appointment scheduled successfully.',
    });
  } catch (error: any) {
    console.error('Error handling appointment booking:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while booking.' },
      { status: 500 }
    );
  }
}
