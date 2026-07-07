const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['skincare', 'bodycare', 'hybrid', 'makeup', 'haircare', 'wellness', 'sets']
  },
  skinType: {
    type: [String],
    default: []
  },
  concerns: {
    type: [String],
    default: []
  },
  badge: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    default: []
  },
  howToUse: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  },
  reviewsList: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
