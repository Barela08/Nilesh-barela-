import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { authenticateAdminRequest } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory Admin Authentication
    const auth = authenticateAdminRequest(req, 'manage_security');
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized. Admin credentials required to send test emails.' },
        { status: auth.status || 401 }
      );
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';
    const pass = process.env.SMTP_PASS;
    const businessEmail = process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';

    if (!pass) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMTP_PASS is not set in environment.' 
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

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"HackifyPro System" <${user}>`,
      to: businessEmail,
      subject: '[HackifyPro Test] Email Notification System Verified',
      text: 'Congratulations! Your HackifyPro email dispatch service is configured and operational.',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #05070C; color: #E8EDF5; border-radius: 8px;">
          <h2 style="color: #00E676;">Email Notifications are Working!</h2>
          <p>Your SMTP configuration has been successfully verified.</p>
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
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to authenticate with SMTP server.' 
      },
      { status: 500 }
    );
  }
}
