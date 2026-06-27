const Product = require('../models/Product');

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, skinType, concerns, sortBy } = req.query;
    let query = {};

    // Filter by Category
    if (category && category !== 'All Products' && category !== 'all') {
      // Handle lowercase category matching (skincare, bodycare, hybrid, makeup)
      const formattedCategory = category.toLowerCase().replace(' ', '');
      query.category = formattedCategory;
    }

    // Filter by Skin Type
    if (skinType && skinType !== 'All') {
      query.skinType = { $in: [skinType] };
    }

    // Filter by Concern
    if (concerns && concerns !== 'All') {
      query.concerns = { $in: [concerns] };
    }

    // Find products
    let findQuery = Product.find(query);

    // Sorting logic
    if (sortBy) {
      if (sortBy === 'price-low') {
        findQuery = findQuery.sort({ price: 1 });
      } else if (sortBy === 'price-high') {
        findQuery = findQuery.sort({ price: -1 });
      } else if (sortBy === 'rating') {
        findQuery = findQuery.sort({ rating: -1 });
      } else if (sortBy === 'popularity') {
        findQuery = findQuery.sort({ reviewsCount: -1 });
      }
    }

    const products = await findQuery;
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviewsList.find(
        r => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      product.reviewsList.push(review);
      product.reviewsCount = product.reviewsList.length;

      // Recalculate average rating
      product.rating =
        product.reviewsList.reduce((acc, item) => item.rating + acc, 0) /
        product.reviewsList.length;

      await product.save();
      res.status(201).json({ success: true, message: 'Review added successfully', product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview
};
