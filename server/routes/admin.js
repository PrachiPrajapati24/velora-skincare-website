const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Visitor = require('../models/Visitor');

const { protect, adminOnly } = require('../middleware/auth');

const ADMIN_EMAIL    = 'pprajapati2424@gmail.com';
const ADMIN_PASSWORD = 'prachi123';
const JWT_SECRET     = process.env.JWT_SECRET || 'velora_secret_key_12345_change_this_in_production';

/* ─────────────────────────────────────────────────
   ADMIN LOGIN  (no auth required)
───────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  // Create a signed token (24h)
  const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    success: true,
    token,
    admin: { name: 'Prachi Prajapati', email: ADMIN_EMAIL, role: 'admin' }
  });
});

/* ─────────────────────────────────────────────────
   ADMIN TOKEN VERIFY  middleware (lightweight)
───────────────────────────────────────────────── */
const adminAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No admin token' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin');
    req.adminUser = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token' });
  }
};

/* ─────────────────────────────────────────────────
   OVERVIEW STATS
───────────────────────────────────────────────── */
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalNewsletters,
      todayVisitors,
      monthlyVisitors,
      totalVisitors,
      uniqueVisitors,
      returningVisitors,
      newUsersThisWeek,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      require('../models/Newsletter').countDocuments(),
      Visitor.countDocuments({ createdAt: { $gte: startOfToday } }),
      Visitor.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Visitor.countDocuments(),
      Visitor.distinct('ip').then(r => r.length),
      Visitor.countDocuments({ isReturning: true }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalNewsletters,
        todayVisitors,
        monthlyVisitors,
        totalVisitors,
        uniqueVisitors,
        returningVisitors,
        newUsersThisWeek,
        totalRevenue,
        bounceRate: '42%',
        avgSession: '3m 24s',
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   USER REGISTRATIONS CHART
───────────────────────────────────────────────── */
router.get('/registrations', adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(); since.setDate(since.getDate() - days);

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
            day:   { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Build a full date-range array with 0-fill
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const found = data.find(x =>
        x._id.year  === d.getFullYear() &&
        x._id.month === d.getMonth() + 1 &&
        x._id.day   === d.getDate()
      );
      result.push({ label, count: found ? found.count : 0 });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   VISITOR TRAFFIC CHART
───────────────────────────────────────────────── */
router.get('/traffic', adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const since = new Date(); since.setDate(since.getDate() - days);

    const data = await Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
            day:   { $dayOfMonth: '$createdAt' },
          },
          visits: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const found = data.find(x =>
        x._id.year  === d.getFullYear() &&
        x._id.month === d.getMonth() + 1 &&
        x._id.day   === d.getDate()
      );
      result.push({ label, visits: found ? found.visits : 0 });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DEVICE & BROWSER BREAKDOWN
───────────────────────────────────────────────── */
router.get('/devices', adminAuth, async (req, res) => {
  try {
    const [deviceData, browserData] = await Promise.all([
      Visitor.aggregate([{ $group: { _id: '$device', count: { $sum: 1 } } }]),
      Visitor.aggregate([{ $group: { _id: '$browser', count: { $sum: 1 } } }]),
    ]);

    res.json({ success: true, devices: deviceData, browsers: browserData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   REVENUE / ORDERS CHART
───────────────────────────────────────────────── */
router.get('/revenue', adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(); since.setDate(since.getDate() - days);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
            day:   { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders:  { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const found = data.find(x =>
        x._id.year  === d.getFullYear() &&
        x._id.month === d.getMonth() + 1 &&
        x._id.day   === d.getDate()
      );
      result.push({ label, revenue: found ? found.revenue : 0, orders: found ? found.orders : 0 });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   PRODUCT CATEGORY DISTRIBUTION
───────────────────────────────────────────────── */
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   TOP PRODUCTS (by order frequency)
───────────────────────────────────────────────── */
router.get('/top-products', adminAuth, async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.name', totalSold: { $sum: '$orderItems.quantity' }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 6 }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   ALL USERS
───────────────────────────────────────────────── */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -cart -wishlist')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   ALL ORDERS
───────────────────────────────────────────────── */
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   RECENT ACTIVITY FEED
───────────────────────────────────────────────── */
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const [recentUsers, recentOrders] = await Promise.all([
      User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(8),
      Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(8),
    ]);

    const feed = [];

    recentUsers.forEach(u => {
      feed.push({
        type: 'register',
        icon: '👤',
        text: `${u.name} created an account`,
        time: u.createdAt,
        color: '#56876D'
      });
    });

    recentOrders.forEach(o => {
      feed.push({
        type: 'order',
        icon: '🛒',
        text: `${o.user?.name || 'A user'} placed an order — ₹${o.totalPrice}`,
        time: o.createdAt,
        color: '#7c3aed'
      });
    });

    // Sort combined feed by time desc
    feed.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({ success: true, feed: feed.slice(0, 15) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   REAL-TIME ACTIVE VISITORS (last 5 min)
───────────────────────────────────────────────── */
router.get('/realtime', adminAuth, async (req, res) => {
  try {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const count = await Visitor.countDocuments({ createdAt: { $gte: fiveMinAgo } });
    res.json({ success: true, activeNow: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DELETE USER
───────────────────────────────────────────────── */
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   CONTACT MESSAGES
───────────────────────────────────────────────── */
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   MARK CONTACT AS REPLIED
───────────────────────────────────────────────── */
router.put('/contacts/:id/reply', adminAuth, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { replied: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   SEND ACTUAL EMAIL REPLY TO CONTACT PERSON
───────────────────────────────────────────────── */
router.post('/contacts/:id/send-reply', adminAuth, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const { sendEmail } = require('../utils/emailService');
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty.' });
    }

    // Check if either Resend key or Gmail credentials are set
    if (!process.env.RESEND_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
      return res.status(500).json({
        success: false,
        message: 'No email service configured. Please add RESEND_API_KEY or Gmail credentials in Render environment variables.'
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact message not found.' });

    const htmlContent = `
      <div style="font-family: Georgia, serif; color: #333; padding: 30px; max-width: 620px; margin: 0 auto; border: 1px solid #f0eae1; background: #fcfbfa; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2d6a4f; font-family: serif; letter-spacing: 3px; margin: 0; font-size: 1.8rem;">VELORA</h1>
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; color: #8a7e72; margin: 4px 0 0;">Luxury Skincare</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 20px 0;" />
        <p style="margin-bottom: 8px;">Dear <strong>${contact.name}</strong>,</p>
        <p style="margin-bottom: 18px; color: #555; font-size: 0.9rem;">Thank you for getting in touch with us regarding <em>"${contact.subject}"</em>. Here is our response:</p>
        <div style="background: #f7faf8; padding: 20px; border-left: 4px solid #2d6a4f; border-radius: 4px; margin: 16px 0; font-size: 0.95rem; line-height: 1.7; color: #333;">
          ${replyMessage.replace(/\n/g, '<br />')}
        </div>
        <p style="margin-top: 20px;">Warm regards,<br /><strong>The Velora Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #f0eae1; margin: 24px 0;" />
        <p style="font-size: 0.72rem; text-align: center; color: #aaa;">© ${new Date().getFullYear()} Velora Luxury Skincare. You received this because you contacted us.</p>
      </div>
    `;

    // Send email using our helper service (which uses fast Resend HTTP API or fallback SMTP)
    const emailRes = await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject} — Velora Skincare`,
      html: htmlContent
    });

    // Mark as replied in DB
    await Contact.findByIdAndUpdate(req.params.id, { replied: true });

    res.json({
      success: true,
      message: `✅ Reply sent successfully to ${contact.email} (${emailRes.provider})`
    });
  } catch (err) {
    console.error('Reply email error:', err.message);
    res.status(500).json({
      success: false,
      message: `Failed to send email: ${err.message}`
    });
  }
});

/* ─────────────────────────────────────────────────
   UPDATE ORDER STATUS
───────────────────────────────────────────────── */
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const updateFields = { status };
    if (status === 'delivered') {
      updateFields.isPaid = true;
      updateFields.paidAt = new Date();
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET ALL PRODUCTS (admin)
───────────────────────────────────────────────── */
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   ADD PRODUCT
───────────────────────────────────────────────── */
router.post('/products', adminAuth, async (req, res) => {
  try {
    const { name, price, description, category, image, rating, countInStock, subtitle } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required' });
    }
    const product = await Product.create({
      name:          name.trim(),
      price:         Number(price),
      description:   description?.trim() || 'No description provided.',
      category:      category.toLowerCase(),   // always store lowercase
      image:         image?.trim() || '',
      rating:        rating ? Number(rating) : 4.8,
      reviewsCount:  0,
      inStock:       true,
      countInStock:  countInStock ? Number(countInStock) : 100,
      subtitle:      subtitle?.trim() || ''
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   UPDATE PRODUCT
───────────────────────────────────────────────── */
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, description, category, image, rating, countInStock, subtitle } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description.trim() || 'No description provided.';
    if (category) product.category = category.toLowerCase();
    if (image !== undefined) product.image = image.trim();
    if (rating !== undefined) product.rating = Number(rating);
    if (countInStock !== undefined) {
      product.countInStock = Number(countInStock);
      product.inStock = Number(countInStock) > 0;
    }
    if (subtitle !== undefined) product.subtitle = subtitle.trim();

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DELETE PRODUCT
───────────────────────────────────────────────── */
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET ALL REVIEWS (admin)
───────────────────────────────────────────────── */
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DELETE REVIEW
───────────────────────────────────────────────── */
router.delete('/reviews/:id', adminAuth, async (req, res) => {
  try {
    const Review = require('../models/Review');
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

