const express = require('express');
const router = express.Router();
const { getUserCart, updateUserCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserCart)
  .put(protect, updateUserCart);

module.exports = router;
