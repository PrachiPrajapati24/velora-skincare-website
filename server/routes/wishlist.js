const express = require('express');
const router = express.Router();
const { getUserWishlist, toggleWishlistItem } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserWishlist);

router.route('/:productId')
  .post(protect, toggleWishlistItem);

module.exports = router;
