const nodemailer = require('nodemailer');
const https = require('https');

/**
 * Sends emails using Resend API (HTTP-based, extremely fast)
 */
const sendResendEmail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Velora Luxury Skincare <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.message || `Resend error status ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Resend response: ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
};

/**
 * Unified email sending utility supporting Resend and Gmail SMTP fallback
 */
const sendEmail = async ({ to, subject, html }) => {
  // 1. Try Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const result = await sendResendEmail(to, subject, html);
      return { success: true, provider: 'resend', result };
    } catch (err) {
      console.error('Resend failed, checking for SMTP fallback:', err.message);
      // If Resend fails and SMTP is not configured, rethrow the error
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw err;
      }
    }
  }

  // 2. Fallback to Gmail Nodemailer SMTP
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Velora Luxury" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, provider: 'nodemailer', info };
  }

  // 3. Fallback to Console Simulation
  console.log('--- simulated email dispatch (No email keys set) ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  return { success: true, provider: 'simulation' };
};

module.exports = { sendEmail };
