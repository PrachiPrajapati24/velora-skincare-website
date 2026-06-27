const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getUserWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      // Product exists, so remove it
      user.wishlist.splice(index, 1);
    } else {
      // Product doesn't exist, so add it
      user.wishlist.push(productId);
    }

    await user.save();

    // Fetch populated wishlist
    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.json({
      success: true,
      message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserWishlist,
  toggleWishlistItem
};
