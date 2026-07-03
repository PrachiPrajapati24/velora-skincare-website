const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'velora_secret_key_12345_change_this_in_production', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate with Google OAuth payload
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res, next) => {
  try {
    const { name, email, googleId } = req.body;

    if (!email || !googleId) {
      res.status(400);
      throw new Error('Please provide email and Google ID');
    }

    // Check if user exists with email or googleId
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update googleId if it wasn't linked already
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      // Create new user for google signup
      user = await User.create({
        name,
        email,
        googleId,
        password: Math.random().toString(36).slice(-10) // generate random dummy password
      });

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product')
      .populate('wishlist');

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

const nodemailer = require('nodemailer');

// @desc    Generate OTP and email it to user
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No user found with this email address');
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (10 minutes from now)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    // Check if real credentials exist, otherwise log to console
    const isPlaceholder = (val) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return v.includes('your_') || v.includes('placeholder') || v.includes('your-') || v.includes('example.com');
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !isPlaceholder(process.env.EMAIL_USER) && !isPlaceholder(process.env.EMAIL_PASS)) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"Velora Luxury" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your Velora password - OTP code',
        html: `
          <div style="font-family: Georgia, serif; color: #333; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #f0eae1; background-color: #fcfbfa;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #695e50; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 2px; margin: 0;">VELORA</h1>
              <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; color: #8a7e72; margin: 5px 0 0 0;">Luxury Skincare</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
            
            <h2 style="font-family: 'Playfair Display', Georgia, serif; text-align: center; color: #695e50; margin-top: 20px;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your Velora account. Please use the following One-Time Password (OTP) to reset your password. This OTP is valid for 10 minutes.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #f5efeb; border: 1px dashed #695e50; font-family: monospace; font-size: 1.8rem; font-weight: bold; letter-spacing: 4px; color: #695e50; border-radius: 4px;">
                ${otp}
              </div>
            </div>
            
            <p>If you did not initiate this request, please ignore this email and your password will remain unchanged.</p>
            <p>Warm regards,<br /><strong>The Velora Team</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log('--- simulated OTP password reset dispatch ---');
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
    }

    res.json({
      success: true,
      message: 'Password reset OTP has been sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      res.status(400);
      throw new Error('Please provide email, OTP, and new password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check if OTP matches and has not expired
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
      res.status(400);
      throw new Error('Invalid OTP code');
    }

    if (new Date() > user.resetPasswordExpires) {
      res.status(400);
      throw new Error('OTP code has expired');
    }

    // Update password
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  forgotPassword,
  resetPassword
};
