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

module.exports = router;
