const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync/Update user cart
// @route   PUT /api/cart
// @access  Private
const updateUserCart = async (req, res, next) => {
  try {
    const { cart } = req.body; // Array of { product: productId, quantity }
    
    if (!Array.isArray(cart)) {
      res.status(400);
      throw new Error('Cart must be an array');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Map incoming cart to the user schema format
    user.cart = cart.map(item => ({
      product: item.product || item._id, // Support either format
      quantity: item.quantity
    }));

    await user.save();
    
    // Fetch user again to populate product details before sending back
    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    res.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCart,
  updateUserCart
};
