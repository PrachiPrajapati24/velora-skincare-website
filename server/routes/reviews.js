const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

/* ─────────────────────────────────────────────────
   POST /api/reviews  — authenticated user submits review
───────────────────────────────────────────────── */
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, rating, review } = req.body;

    if (!rating || !review) {
      return res.status(400).json({ success: false, message: 'Rating and review text are required' });
    }

    let cleanOrderId = null;
    if (orderId && typeof orderId === 'string' && orderId.trim() !== '' && orderId !== 'undefined' && orderId !== 'null') {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        cleanOrderId = orderId;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid Order ID format' });
      }
    }

    // If orderId provided and valid, verify it belongs to this user
    if (cleanOrderId) {
      const order = await Order.findOne({ _id: cleanOrderId, user: req.user._id });
      if (!order) {
        return res.status(403).json({ success: false, message: 'Order not found or does not belong to you' });
      }
    }

    const newReview = await Review.create({
      user: req.user._id,
      userName: req.user.name || 'Anonymous User',
      orderId: cleanOrderId,
      rating: Number(rating),
      review: String(review),
    });

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(400).json({ success: false, message: err.message || 'Failed to submit review' });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/reviews  — public, for Testimonials section
───────────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
