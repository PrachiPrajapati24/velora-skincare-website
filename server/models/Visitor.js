const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, default: 'unknown' },
  page: { type: String, default: '/' },
  userAgent: { type: String, default: '' },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
    default: 'desktop'
  },
  browser: {
    type: String,
    enum: ['chrome', 'edge', 'firefox', 'safari', 'other'],
    default: 'other'
  },
  isReturning: { type: Boolean, default: false },
  sessionId: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
