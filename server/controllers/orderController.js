const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingPrice,
      discount,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Generate a simulated transaction ID
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentDetails: {
        status: 'Successful',
        method: paymentMethod || 'Simulated Card',
        transactionId
      },
      subtotal,
      tax,
      shippingPrice,
      discount,
      totalPrice,
      isPaid: true,
      paidAt: Date.now()
    });

    const createdOrder = await order.save();

    // Clear user's cart in DB since checkout is done
    const user = await User.findById(req.user._id);
    user.cart = [];
    
    // Add rewards/loyalty points: ₹1 spent = 1 point
    const earnedPoints = Math.floor(totalPrice);
    user.points += earnedPoints;
    
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: createdOrder,
      earnedPoints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
      res.json({ success: true, order });
    } else {
      res.status(404);
      throw new Error('Order not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
