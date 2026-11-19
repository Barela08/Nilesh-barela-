import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';
    const pass = process.env.SMTP_PASS;
    const businessEmail = process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';

    if (!pass) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMTP_PASS is not set in .env.local. Please generate a 16-character Google App Password and add it to .env.local.' 
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    // 1. Verify credentials with SMTP server
    await transporter.verify();

    // 2. Send test email
    const info = await transporter.sendMail({
      from: `"HackifyPro System" <${user}>`,
      to: businessEmail,
      subject: '[HackifyPro Test] Email Notification System Verified',
      text: 'Congratulations! Your HackifyPro email dispatch service is configured and operational.',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #05070C; color: #E8EDF5; border-radius: 8px;">
          <h2 style="color: #00E676;">Email Notifications are Working!</h2>
          <p>Your SMTP configuration has been successfully verified. When clients submit an appointment booking, quote, or enquiry, you will receive real-time email notifications.</p>
          <p style="color: #9AA3B8; font-size: 12px;">Sent from HackifyPro Web Platform &bull; ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${businessEmail}`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to authenticate with SMTP server.' 
      },
      { status: 500 }
    );
  }
}
