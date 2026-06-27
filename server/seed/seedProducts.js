require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // 8 Products from ProductsPage
  {
    name: 'Hydrating Serum',
    subtitle: 'Deep hydration with hyaluronic acid',
    category: 'skincare',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 245,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    badge: 'Best Seller',
    skinType: ['Dry', 'Normal', 'Sensitive'],
    concerns: ['Hydration', 'Anti-aging'],
    description: 'Deeply hydrating serum formulated with multi-weight hyaluronic acid molecules to penetrate multiple layers of the skin, providing long-lasting hydration and plumping fine lines.',
    ingredients: ['Hyaluronic Acid', 'Vitamin E', 'Glycerin', 'Panthenol', 'Centella Asiatica Extract'],
    howToUse: 'Apply 3-4 drops to cleansed, damp face and neck. Gently pat until fully absorbed. Follow with moisturizer.',
    inStock: true
  },
  {
    name: 'Vitamin C Brightening Cream',
    subtitle: 'Radiant glow and even tone',
    category: 'skincare',
    price: 1499,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 189,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    badge: 'New',
    skinType: ['Oily', 'Dry', 'Combination', 'Normal'],
    concerns: ['Brightening', 'Dark Spots'],
    description: 'A lightweight daily cream infused with stable Vitamin C and Niacinamide to restore natural radiance, reduce the appearance of dark spots, and protect against environmental stressors.',
    ingredients: ['Vitamin C (3-O-Ethyl Ascorbic Acid)', 'Niacinamide', 'Aloe Vera Extract', 'Shea Butter', 'Licorice Root'],
    howToUse: 'Smooth a dime-sized amount over clean face and neck in the morning. Use sunscreen afterwards.',
    inStock: true
  },
  {
    name: 'Gentle Cleanser',
    subtitle: 'Mild cleansing for daily use',
    category: 'skincare',
    price: 899,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80',
    badge: null,
    skinType: ['Sensitive', 'Dry', 'Normal'],
    concerns: ['Cleansing'],
    description: 'A non-stripping, pH-balanced gel cleanser that effectively removes dirt, oil, and makeup while soothing the skin with chamomile and green tea extracts.',
    ingredients: ['Chamomile Extract', 'Green Tea Extract', 'Coconut Oil Derivatives', 'Allantoin', 'Glycerin'],
    howToUse: 'Massage a small amount onto damp skin in circular motions. Rinse thoroughly with lukewarm water. Use AM and PM.',
    inStock: true
  },
  {
    name: 'Body Butter',
    subtitle: 'Rich and nourishing skin nutrition',
    category: 'bodycare',
    price: 1099,
    originalPrice: 1399,
    rating: 4.9,
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80',
    badge: 'Sale',
    skinType: ['Dry', 'Normal'],
    concerns: ['Hydration'],
    description: 'A rich, decadent body moisturizer that melts into the skin to provide intense, 24-hour nourishment. Enriched with raw Shea Butter and Cocoa Butter to repair dry and flaky skin.',
    ingredients: ['Shea Butter', 'Cocoa Butter', 'Vitamin E', 'Sweet Almond Oil', 'Jojoba Oil'],
    howToUse: 'Massage generously onto dry or damp skin all over the body, paying extra attention to dry spots like elbows, knees, and heels.',
    inStock: true
  },
  {
    name: 'Hybrid Face Cream',
    subtitle: 'Multi-action cream for combination skin',
    category: 'hybrid',
    price: 1699,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80',
    badge: 'Best Seller',
    skinType: ['Combination', 'Oily'],
    concerns: ['Hydration', 'Oil Control'],
    description: 'A unique hybrid cream-gel that hydrates dry zones while regulating sebum production in the T-zone. Formulated with Salicylic Acid to keep pores clear and Niacinamide to strengthen the skin barrier.',
    ingredients: ['Niacinamide (5%)', 'Salicylic Acid (0.5%)', 'Hyaluronic Acid', 'Tea Tree Leaf Water', 'Squalane'],
    howToUse: 'Apply to clean skin after serums in the AM and PM. Gently sweep upwards and outwards.',
    inStock: true
  },
  {
    name: 'Skin-First Foundation',
    subtitle: 'Breathable coverage with skincare benefits',
    category: 'makeup',
    price: 1899,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 203,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    badge: 'New',
    skinType: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
    concerns: ['Coverage'],
    description: 'An ultra-breathable, medium-coverage foundation that looks and feels like real skin. Infused with SPF 30 and Hyaluronic Acid to keep your skin hydrated and protected throughout the day.',
    ingredients: ['Titanium Dioxide (SPF 30)', 'Hyaluronic Acid', 'Vitamin E', 'Dimethicone', 'Green Tea Extract'],
    howToUse: 'Shake well. Apply a few drops to the center of the face and blend outwards using a damp sponge, foundation brush, or fingers.',
    inStock: true
  },
  {
    name: 'Acne Treatment Serum',
    subtitle: 'Clarifying and spot fighting treatment',
    category: 'skincare',
    price: 1399,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 267,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80',
    badge: null,
    skinType: ['Oily', 'Combination'],
    concerns: ['Acne', 'Oil Control'],
    description: 'A powerful clarifying serum designed to target active acne breakouts, reduce blackheads, and prevent future pimples. Formulated with Salicylic Acid to exfoliate inside pores and soothe irritation.',
    ingredients: ['Salicylic Acid (2%)', 'Tea Tree Oil', 'Niacinamide', 'Zinc PCA', 'Witch Hazel Extract'],
    howToUse: 'Apply 2-3 drops to affected areas or all over face at night. Start with 2-3 times a week, gradually increasing to nightly use.',
    inStock: false // Match the out-of-stock state on the WishlistPage
  },
  {
    name: 'Body Scrub',
    subtitle: 'Gentle exfoliation for glowing body skin',
    category: 'bodycare',
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
    badge: 'Sale',
    skinType: ['Oily', 'Dry', 'Combination', 'Normal'],
    concerns: ['Exfoliation'],
    description: 'A decadent body scrub made with organic coffee grounds and brown sugar to physically exfoliate dead skin cells, improve blood circulation, and reduce the appearance of cellulite.',
    ingredients: ['Brown Sugar', 'Coffee Arabica Seed Powder', 'Coconut Oil', 'Sweet Almond Oil', 'Vanilla Extract'],
    howToUse: 'Massage gently onto wet skin in circular motions in the shower. Pay attention to rough areas. Rinse thoroughly with warm water.',
    inStock: true
  },

  // 4 Featured Products from Home Page (harmonized names and prices)
  {
    name: 'Velora Miraculous Retinol',
    subtitle: 'Youth restoring nightly serum',
    category: 'skincare',
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 399,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', // placeholder or reuse
    badge: 'Featured',
    skinType: ['Dry', 'Normal', 'Combination'],
    concerns: ['Anti-aging', 'Dark Spots'],
    description: 'Our signature night serum with 1% pure encapsulated retinol, designed to stimulate cell turnover, reduce fine lines and wrinkles, and refine skin texture without causing redness.',
    ingredients: ['Encapsulated Retinol (1%)', 'Ceramides NP/AP/EOP', 'Hyaluronic Acid', 'Allantoin'],
    howToUse: 'Apply 2-3 drops to dry skin at night. Follow with a rich moisturizer. Use sunscreen daily while using this product.',
    inStock: true
  },
  {
    name: 'Toner Velora Perfect Hydrating',
    subtitle: 'Instant skin balancing and moisture prep',
    category: 'skincare',
    price: 1199,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 345,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    badge: 'Featured',
    skinType: ['Dry', 'Normal', 'Sensitive', 'Combination'],
    concerns: ['Hydration'],
    description: 'An alcohol-free, moisture-binding toner that hydrates skin instantly while balancing pH levels after cleansing. Preps your skin for optimal absorption of subsequent serums.',
    ingredients: ['Hyaluronic Acid', 'Aloe Vera Leaf Juice', 'Rose Water', 'Glycerin', 'Panthenol'],
    howToUse: 'Pour a few drops into palms or onto a cotton pad. Gently pat onto clean face and neck. Apply morning and night.',
    inStock: true
  },
  {
    name: 'Ampoule Velora Miraculous',
    subtitle: 'Concentrated barrier repair booster',
    category: 'skincare',
    price: 2199,
    originalPrice: 2699,
    rating: 4.9,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80',
    badge: 'Trending',
    skinType: ['Dry', 'Combination', 'Sensitive', 'Normal'],
    concerns: ['Hydration', 'Anti-aging'],
    description: 'A highly concentrated ampoule packed with active botanicals and moisture locks to strengthen the skin barrier and deliver rapid hydration to fatigued skin.',
    ingredients: ['Centella Asiatica Extract', 'Peptides Complex', 'Beta-Glucan', 'Sodium Hyaluronate'],
    howToUse: 'Dispense a full dropper onto clean skin. Smooth gently all over face. Layer under serums or creams.',
    inStock: true
  },
  {
    name: 'Sunscreen Velora',
    subtitle: 'Invisible broad-spectrum SPF 50',
    category: 'skincare',
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80',
    badge: 'Best Seller',
    skinType: ['Oily', 'Combination', 'Normal', 'Sensitive', 'Dry'],
    concerns: ['Hydration'],
    description: 'A weightless, gel-based daily sunscreen that leaves zero white cast or greasy finish. Offers superior SPF 50 PA++++ protection against UVA/UVB rays and blue light.',
    ingredients: ['Organic UV Filters', 'Niacinamide', 'Hyaluronic Acid', 'Centella Asiatica'],
    howToUse: 'Apply generously as the final step of your morning skincare routine, at least 15 minutes before sun exposure. Reapply every 2 hours.',
    inStock: true
  }
];

const seedDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/velora';
    console.log(`Connecting to database at ${dbUri}...`);
    await mongoose.connect(dbUri);
    console.log('Connected! Clearing existing products...');
    await Product.deleteMany({});
    console.log('Seeding products...');
    const createdProducts = await Product.create(products);
    console.log(`Seeded ${createdProducts.length} products successfully!`);
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
