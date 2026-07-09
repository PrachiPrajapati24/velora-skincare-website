const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    // Check if email already subscribed — return gracefully instead of erroring
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You\'re already part of the Velora Circle! 🌿 Check your inbox for your 10% OFF code.',
        alreadySubscribed: true
      });
    }

    // Save to Database
    const subscription = await Newsletter.create({ email });

    // Send welcome email (using Nodemailer)
    let emailSent = false;
    let emailMessage = 'Subscribed successfully.';

    const isPlaceholder = (val) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return v.includes('your_') || v.includes('placeholder') || v.includes('your-') || v.includes('example.com');
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !isPlaceholder(process.env.EMAIL_USER) && !isPlaceholder(process.env.EMAIL_PASS)) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const welcomeMailOptions = {
          from: `"Velora Luxury" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to the Velora Circle - enjoy 10% off',
          html: `
            <div style="font-family: Georgia, serif; color: #333; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #f0eae1; background-color: #fcfbfa;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #695e50; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 2px; margin: 0;">VELORA</h1>
                <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; color: #8a7e72; margin: 5px 0 0 0;">Luxury Skincare</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
              
              <h2 style="font-family: 'Playfair Display', Georgia, serif; text-align: center; color: #695e50; margin-top: 20px;">Welcome to the Velora Circle</h2>
              
              <p>We are delighted to welcome you to our community of skincare enthusiasts.</p>
              <p>At Velora, we believe in maximum results through clean, high-performance skincare. As a newsletter subscriber, you will receive exclusive priority access to new product launches, expert skincare guides, and subscriber-only rewards.</p>
              
              <div style="background-color: #f5efeb; text-align: center; padding: 25px; border-radius: 4px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #695e50;">Your Welcoming Gift</p>
                <h3 style="margin: 0 0 15px 0; font-size: 1.8rem; color: #695e50; font-family: 'Playfair Display', Georgia, serif;">10% OFF YOUR NEXT ORDER</h3>
                <p style="margin: 0 0 5px 0; font-size: 0.85rem; color: #8a7e72;">Use coupon code at checkout:</p>
                <div style="display: inline-block; padding: 10px 25px; background-color: #ffffff; border: 1px dashed #695e50; font-family: monospace; font-size: 1.2rem; font-weight: bold; letter-spacing: 2px; color: #695e50;">
                  VELORA10
                </div>
              </div>
              
              <p>To start exploring, visit our store at <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: #695e50; text-decoration: underline;">veloraskincare.com</a>.</p>
              
              <p>Warm regards,<br /><strong>The Velora Team</strong></p>
              <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
              <p style="font-size: 0.7rem; text-align: center; color: #999; margin: 0;">You received this email because you subscribed on our website. You can unsubscribe at any time.</p>
            </div>
          `
        };

        await transporter.sendMail(welcomeMailOptions);
        emailSent = true;
        emailMessage = 'Subscribed successfully and welcome gift email sent!';
      } catch (err) {
        console.error('Nodemailer Error: ', err.message);
        emailMessage = 'Subscribed successfully, but welcoming email failed to deliver (SMTP error).';
      }
    } else {
      console.log('--- simulated newsletter email dispatch (EMAIL_USER & EMAIL_PASS not set) ---');
      console.log(`To: ${email}`);
      console.log('Subject: Welcome to the Velora Circle - 10% OFF Code: VELORA10');
      emailMessage = 'Subscribed successfully (welcome email logged in developer console).';
    }

    res.status(201).json({
      success: true,
      message: emailMessage,
      subscription
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribeNewsletter
};
