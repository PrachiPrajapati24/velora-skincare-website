const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    // Save to Database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send emails (using Nodemailer)
    let emailSent = false;
    let emailMessage = 'Form submitted successfully.';

    const isPlaceholder = (val) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return v.includes('your_') || v.includes('placeholder') || v.includes('your-') || v.includes('example.com');
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !isPlaceholder(process.env.EMAIL_USER) && !isPlaceholder(process.env.EMAIL_PASS)) {
      try {
        // Create transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // 1. Email to Support
        const supportMailOptions = {
          from: `"Velora Skincare Website" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, // Send to support email
          subject: `New Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
              <h2 style="color: #695e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #695e50; margin-top: 15px;">
                <p style="margin: 0; line-height: 1.6;">${message}</p>
              </div>
            </div>
          `
        };

        // 2. Confirmation Email to User
        const userMailOptions = {
          from: `"Velora Luxury" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `We've received your message - Velora Skincare`,
          html: `
            <div style="font-family: Georgia, serif; color: #333; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #f0eae1; background-color: #fcfbfa;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #695e50; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 2px; margin: 0;">VELORA</h1>
                <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; color: #8a7e72; margin: 5px 0 0 0;">Luxury Skincare</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to Velora. We have received your inquiry regarding <strong>"${subject}"</strong>.</p>
              <p>Our beauty consultants and support team are reviewing your message and will get back to you within 24-48 business hours.</p>
              <p>For your records, a copy of your message is enclosed below:</p>
              <div style="background-color: #fdfdfd; padding: 15px; border: 1px solid #f5efeb; font-style: italic; margin: 15px 0; color: #555;">
                "${message}"
              </div>
              <p>Warm regards,<br /><strong>The Velora Team</strong></p>
              <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
              <p style="font-size: 0.75rem; text-align: center; color: #999; margin: 0;">This is an automated confirmation of your request. Please do not reply directly to this email.</p>
            </div>
          `
        };

        await transporter.sendMail(supportMailOptions);
        await transporter.sendMail(userMailOptions);
        emailSent = true;
        emailMessage = 'Form submitted and confirmation email sent successfully.';
      } catch (err) {
        console.error('Nodemailer Error: ', err.message);
        emailMessage = 'Form submitted successfully, but email dispatch failed (SMTP error).';
      }
    } else {
      console.log('--- simulated email dispatch (EMAIL_USER & EMAIL_PASS not set) ---');
      console.log(`To: Support (${email}) & User (${email})`);
      console.log(`Subject: Contact Form Submission - ${subject}`);
      emailMessage = 'Form submitted successfully (emails simulated in developer console).';
    }

    res.status(201).json({
      success: true,
      message: emailMessage,
      contact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm
};
