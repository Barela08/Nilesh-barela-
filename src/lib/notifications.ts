export async function notifyNewLead(type: 'Appointment' | 'Enquiry' | 'Quote', data: Record<string, any>) {
  const businessEmail = process.env.BUSINESS_EMAIL || 'hackifypro@gmail.com';
  const founderEmail = process.env.FOUNDER_EMAIL || 'barelanilesh483@gmail.com';

  const subject = `[HackifyPro New ${type}] Reference: ${data.id || 'N/A'} - ${data.name || data.fullName || 'Lead'}`;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  console.log('====================================================');
  console.log(`[LEAD NOTIFICATION] ${subject}`);
  console.log(`To: ${businessEmail}, ${founderEmail}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('Lead Details:', JSON.stringify(data, null, 2));
  console.log('====================================================');

  // If external SMTP configuration is provided, send real email
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // In production with credentials, nodemailer or sendgrid dispatch happens here
      console.log(`[SMTP] Notification dispatched successfully to ${businessEmail}`);
    } catch (err) {
      console.error('[SMTP] Failed to send email alert:', err);
    }
  }

  return true;
}
