import { NextRequest, NextResponse } from 'next/server';
import { dbQuotes } from '@/lib/db';
import { checkRateLimit, checkDuplicateSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    const rateCheck = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting another quote request.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, company, requiredService, projectScope, estimatedBudget, expectedTimeline, additionalRequirements } = body;

    if (!name || !email || !phone || !requiredService || !additionalRequirements) {
      return NextResponse.json(
        { error: 'Please provide all required proposal specifications.' },
        { status: 400 }
      );
    }

    const hash = `${email.toLowerCase()}_${requiredService}_${additionalRequirements.slice(0, 30)}`;
    if (checkDuplicateSubmission(ip, hash, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Your quotation request has already been registered. A proposal is being generated.' },
        { status: 409 }
      );
    }

    const quote = dbQuotes.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company ? company.trim() : undefined,
      requiredService,
      projectScope: projectScope || 'New Project',
      estimatedBudget: estimatedBudget || 'Flexible',
      expectedTimeline: expectedTimeline || 'Flexible',
      additionalRequirements: additionalRequirements.trim(),
      ipAddress: ip,
    });

    await notifyNewLead('Quote', quote);

    return NextResponse.json({
      success: true,
      id: quote.id,
      message: 'Quotation request received successfully.',
    });
  } catch (error: any) {
    console.error('Error handling quote request:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request.' },
      { status: 500 }
    );
  }
}
