import nodemailer from 'nodemailer';

// Create and cache nodemailer transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    return null;
  }

  const isSecure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function formatPhoneForWhatsApp(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    return `91${clean}`;
  }
  return clean;
}

export async function notifyNewLead(type: 'Appointment' | 'Enquiry' | 'Quote', data: Record<string, any>) {
  const businessEmail = process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';
  const founderEmail = process.env.FOUNDER_EMAIL || 'barelanilesh483@gmail.com';
  const smtpUser = process.env.SMTP_USER || businessEmail;
  const fromEmail = process.env.SMTP_FROM || `"HackifyPro Portal" <${smtpUser}>`;

  const leadName = data.fullName || data.name || 'Valued Client';
  const leadEmail = data.email || 'N/A';
  const leadPhone = data.phone || 'N/A';
  const companyName = data.companyName || data.company || 'Not Specified';
  const service = data.serviceRequired || data.interestedService || data.requiredService || 'General Consultation';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const waNumber = formatPhoneForWhatsApp(leadPhone);

  const subject = `[New ${type} Lead] ${leadName} - ${service} (Ref: ${data.id || 'N/A'})`;

  // Always log to server console for auditing
  console.log('====================================================');
  console.log(`[LEAD NOTIFICATION] ${subject}`);
  console.log(`To: ${businessEmail}, ${founderEmail}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('Lead Details:', JSON.stringify(data, null, 2));
  console.log('====================================================');

  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[SMTP Warning] SMTP_PASS not set in environment. Email alert skipped. Lead safely saved to database.');
    return {
      sent: false,
      reason: 'SMTP_PASS environment variable not configured',
    };
  }

  // Build rows for the details table
  const detailsRows: { label: string; value: string }[] = [
    { label: 'Booking Type', value: type },
    { label: 'Reference ID', value: data.id || 'N/A' },
    { label: 'Received At', value: timestamp },
    { label: 'Full Name', value: leadName },
    { label: 'Email Address', value: `<a href="mailto:${leadEmail}" style="color: #38BDF8; text-decoration: none;">${leadEmail}</a>` },
    { label: 'Phone Number', value: `<a href="tel:${leadPhone}" style="color: #00E676; text-decoration: none;">${leadPhone}</a>` },
    { label: 'Company / Organization', value: companyName },
    { label: 'Requested Service', value: `<strong>${service}</strong>` },
  ];

  if (type === 'Appointment') {
    detailsRows.push(
      { label: 'Preferred Date', value: data.preferredDate || 'N/A' },
      { label: 'Preferred Time Slot', value: data.preferredTime || 'N/A' },
      { label: 'Estimated Budget', value: data.projectBudget || 'Not Specified' },
      { label: 'Project Description', value: `<div style="white-space: pre-wrap; background: #080B12; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">${data.projectDescription || 'N/A'}</div>` }
    );
  } else if (type === 'Quote') {
    detailsRows.push(
      { label: 'Project Scope', value: data.projectScope || 'N/A' },
      { label: 'Estimated Budget', value: data.estimatedBudget || 'Flexible' },
      { label: 'Expected Timeline', value: data.expectedTimeline || 'Flexible' },
      { label: 'Specifications', value: `<div style="white-space: pre-wrap; background: #080B12; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">${data.additionalRequirements || 'N/A'}</div>` }
    );
  } else if (type === 'Enquiry') {
    detailsRows.push(
      { label: 'Budget Range', value: data.budgetRange || 'Not Specified' },
      { label: 'Project Timeline', value: data.timeline || 'Not Specified' },
      { label: 'Message', value: `<div style="white-space: pre-wrap; background: #080B12; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">${data.message || 'N/A'}</div>` }
    );
  }

  detailsRows.push({ label: 'IP Address', value: data.ipAddress || '127.0.0.1' });

  // HTML Email Template for Admin
  const tableRowsHtml = detailsRows
    .map(
      (row) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1E293B; color: #9AA3B8; font-size: 13px; font-weight: 600; width: 35%; vertical-align: top;">
            ${row.label}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1E293B; color: #E8EDF5; font-size: 14px; vertical-align: top;">
            ${row.value}
          </td>
        </tr>
      `
    )
    .join('');

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #05070C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8EDF5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #05070C; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="640" style="max-width: 640px; background-color: #0F1624; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Brand Header -->
              <tr>
                <td style="padding: 24px 28px; background: linear-gradient(135deg, #080B12 0%, #0F1624 100%); border-bottom: 1px solid #1E293B;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                          Hackify<span style="color: #00E676;">Pro</span>
                        </span>
                        <div style="font-size: 10px; color: #9AA3B8; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;">
                          SECURE &bull; LEARN &bull; INNOVATE
                        </div>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; padding: 5px 12px; background: rgba(0, 230, 118, 0.12); border: 1px solid rgba(0, 230, 118, 0.3); border-radius: 20px; font-size: 11px; font-weight: 700; color: #00E676; text-transform: uppercase; letter-spacing: 0.5px;">
                          ${type} Lead
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Alert Banner -->
              <tr>
                <td style="padding: 24px 28px 12px 28px;">
                  <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">
                    New ${type} Booking Received!
                  </h2>
                  <p style="margin: 0; font-size: 14px; color: #9AA3B8; line-height: 1.5;">
                    A new project inquiry has been submitted through the HackifyPro website. All submitted details are listed below:
                  </p>
                </td>
              </tr>

              <!-- Quick Action Buttons -->
              <tr>
                <td style="padding: 12px 28px 20px 28px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 10px;">
                        <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${leadName}, thank you for reaching out to HackifyPro regarding ${service}.`)}" 
                           style="display: inline-block; padding: 10px 18px; background-color: #00E676; color: #080B12; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 8px;">
                          💬 WhatsApp Client
                        </a>
                      </td>
                      <td style="padding-right: 10px;">
                        <a href="mailto:${leadEmail}?subject=${encodeURIComponent(`HackifyPro: Regarding your ${type} request (${service})`)}" 
                           style="display: inline-block; padding: 10px 18px; background-color: #1E293B; color: #E8EDF5; border: 1px solid #38BDF8; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
                          ✉️ Reply via Email
                        </a>
                      </td>
                      <td>
                        <a href="tel:${leadPhone}" 
                           style="display: inline-block; padding: 10px 16px; background-color: #141D30; color: #9AA3B8; border: 1px solid #1E293B; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
                          📞 Call
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Details Table -->
              <tr>
                <td style="padding: 0 28px 24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0E17; border: 1px solid #1E293B; border-radius: 10px; border-collapse: separate; overflow: hidden;">
                    ${tableRowsHtml}
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 28px; background-color: #080B12; border-top: 1px solid #1E293B; text-align: center; font-size: 12px; color: #64748B;">
                  This is an automated notification from <strong style="color: #9AA3B8;">HackifyPro Web Platform</strong>.<br/>
                  Admin CRM: <a href="https://www.nileshbarela.site/5659" style="color: #00E676; text-decoration: none;">nileshbarela.site/5659</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Plain Text Alternative for Admin
  const adminText = `
[NEW ${type.toUpperCase()} BOOKING RECEIVED]
Reference ID: ${data.id || 'N/A'}
Timestamp: ${timestamp}

Client Name: ${leadName}
Email: ${leadEmail}
Phone: ${leadPhone}
Company: ${companyName}
Service: ${service}
${type === 'Appointment' ? `Date: ${data.preferredDate}\nTime: ${data.preferredTime}\nBudget: ${data.projectBudget}\nDescription: ${data.projectDescription}` : ''}
${type === 'Quote' ? `Scope: ${data.projectScope}\nBudget: ${data.estimatedBudget}\nTimeline: ${data.expectedTimeline}\nRequirements: ${data.additionalRequirements}` : ''}
${type === 'Enquiry' ? `Budget: ${data.budgetRange}\nTimeline: ${data.timeline}\nMessage: ${data.message}` : ''}
IP Address: ${data.ipAddress || 'N/A'}

Quick WhatsApp Link: https://wa.me/${waNumber}
  `.trim();

  try {
    // 1. Send notification to Business and Founder email
    const recipientEmails = Array.from(new Set([businessEmail, founderEmail].filter(Boolean))).join(', ');
    
    await transporter.sendMail({
      from: fromEmail,
      to: recipientEmails,
      subject: subject,
      text: adminText,
      html: adminEmailHtml,
      replyTo: leadEmail !== 'N/A' ? leadEmail : undefined,
    });

    console.log(`[SMTP Success] Lead notification dispatched successfully to ${recipientEmails}`);

    // 2. Also send polite confirmation receipt to the client if they gave a valid email
    if (leadEmail && leadEmail.includes('@') && leadEmail !== 'N/A') {
      try {
        const clientSubject = `Thank You for Choosing HackifyPro - ${type} Request Received (Ref: ${data.id || 'N/A'})`;
        const clientHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${clientSubject}</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #05070C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8EDF5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #05070C; padding: 30px 15px;">
              <tr>
                <td align="center">
                  <table width="100%" max-width="600" style="max-width: 600px; background-color: #0F1624; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="padding: 24px 28px; background: #080B12; border-bottom: 1px solid #1E293B;">
                        <span style="font-size: 22px; font-weight: 800; color: #ffffff;">
                          Hackify<span style="color: #00E676;">Pro</span>
                        </span>
                        <div style="font-size: 10px; color: #9AA3B8; letter-spacing: 1.5px; text-transform: uppercase;">
                          SECURE &bull; LEARN &bull; INNOVATE
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 28px;">
                        <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px;">
                          Hello ${leadName},
                        </h2>
                        <p style="margin: 0 0 16px 0; color: #9AA3B8; font-size: 14px; line-height: 1.6;">
                          Thank you for reaching out to <strong style="color: #00E676;">HackifyPro</strong>. We have successfully received your request for <strong>${service}</strong>.
                        </p>
                        <div style="background-color: #080B12; border: 1px solid #1E293B; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
                          <div style="color: #9AA3B8; margin-bottom: 6px;">Booking Reference: <strong style="color: #38BDF8;">${data.id || 'N/A'}</strong></div>
                          <div style="color: #9AA3B8; margin-bottom: 6px;">Service: <strong style="color: #ffffff;">${service}</strong></div>
                          ${type === 'Appointment' ? `<div style="color: #9AA3B8;">Scheduled Slot: <strong style="color: #00E676;">${data.preferredDate} at ${data.preferredTime}</strong></div>` : ''}
                        </div>
                        <p style="margin: 0 0 20px 0; color: #9AA3B8; font-size: 14px; line-height: 1.6;">
                          Our engineering team led by Nilesh Barela will review your project requirements and connect with you shortly via phone or WhatsApp at <strong>${leadPhone}</strong>.
                        </p>
                        <p style="margin: 0; color: #9AA3B8; font-size: 13px;">
                          Need immediate assistance? Feel free to reach out to us on WhatsApp:
                        </p>
                        <div style="margin-top: 14px;">
                          <a href="https://wa.me/917414935405" style="display: inline-block; padding: 10px 20px; background-color: #00E676; color: #080B12; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 13px;">
                            Chat with us on WhatsApp &rarr;
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; background-color: #080B12; border-top: 1px solid #1E293B; text-align: center; font-size: 12px; color: #64748B;">
                        HackifyPro &bull; Maharashtra, India &bull; <a href="https://www.nileshbarela.site" style="color: #00E676; text-decoration: none;">nileshbarela.site</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: fromEmail,
          to: leadEmail,
          subject: clientSubject,
          html: clientHtml,
        });

        console.log(`[SMTP Success] Confirmation receipt sent to client at ${leadEmail}`);
      } catch (clientErr) {
        console.warn('[SMTP Warning] Failed to send client receipt (non-fatal):', clientErr);
      }
    }

    return { sent: true };
  } catch (err: any) {
    console.error('[SMTP Error] Failed to send email alert:', err);
    return { sent: false, error: err.message };
  }
}
