const Visitor = require('../models/Visitor');

/**
 * Middleware: tracks every incoming API/frontend request into the Visitor collection.
 * Skips admin routes and static files.
 */
const trackVisitor = async (req, res, next) => {
  try {
    // Skip admin routes, health checks
    const skip = ['/api/admin', '/favicon', '/static', '/manifest'];
    if (skip.some(s => req.path.startsWith(s))) return next();

    const ua = req.headers['user-agent'] || '';

    // Detect device
    let device = 'desktop';
    if (/Mobile|Android|iPhone|iPod/i.test(ua)) device = 'mobile';
    else if (/iPad|Tablet/i.test(ua)) device = 'tablet';

    // Detect browser
    let browser = 'other';
    if (/Edg\//i.test(ua)) browser = 'edge';
    else if (/Chrome/i.test(ua)) browser = 'chrome';
    else if (/Firefox/i.test(ua)) browser = 'firefox';
    else if (/Safari/i.test(ua)) browser = 'safari';

    // Get IP
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    // Session ID from custom header or query param (frontend sets it)
    const sessionId = req.headers['x-session-id'] || '';

    // Check if returning (same IP visited before)
    const existing = await Visitor.findOne({ ip }).lean();

    await Visitor.create({
      ip,
      page: req.path,
      userAgent: ua.substring(0, 200),
      device,
      browser,
      isReturning: !!existing,
      sessionId,
    });
  } catch (_) {
    // Never block the request if tracking fails
  }
  next();
};

module.exports = trackVisitor;
