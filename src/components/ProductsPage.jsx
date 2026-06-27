import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingCart, FiEye, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import './ProductsPage.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category mapping
    if (selectedCategory !== 'All Products') {
      const formattedCat = selectedCategory.toLowerCase().replace(' ', '');
      if (product.category !== formattedCat) return false;
    }
    // Skin type filter (match items inside array)
    if (selectedSkinType !== 'All') {
      if (!product.skinType.includes(selectedSkinType)) return false;
    }
    // Concern filter (match items inside array)
    if (selectedConcern !== 'All') {
      if (!product.concerns.includes(selectedConcern)) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return (b.reviewsCount || b.reviews || 0) - (a.reviewsCount || a.reviews || 0);
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setNotificationProduct(product);
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const renderStars = (rating) => {
    return (
      <div className="product-stars">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-text">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="products-page loading-state">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Loading our luxury skincare collection...</p>
        </div>
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div className="product-card skeleton-card" key={idx}>
              <div className="skeleton-img" style={{ height: '260px', background: '#f2f2f2' }}></div>
              <div className="skeleton-text title" style={{ height: '18px', width: '70%', background: '#f2f2f2', marginTop: '15px' }}></div>
              <div className="skeleton-text desc" style={{ height: '14px', width: '90%', background: '#f2f2f2', marginTop: '10px' }}></div>
              <div className="skeleton-text price" style={{ height: '24px', width: '40%', background: '#f2f2f2', marginTop: '15px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Cart Notification Toast */}
      {showCartNotification && (
        <div className="cart-notification">
          <FiShoppingCart />
          <span>
            <strong>{notificationProduct?.name}</strong> added to cart!
          </span>
        </div>
      )}

      {/* Header */}
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover the complete range of Velora skincare products crafted with natural ingredients</p>
      </div>

      {/* Categories */}
      <div className="products-categories">
        {['All Products', 'Skincare', 'Body Care', 'Hybrid', 'Make Up'].map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filters and Sort */}
      <div className="products-filters">
        <div className="filter-group">
          <label>Skin Type</label>
          <select value={selectedSkinType} onChange={(e) => setSelectedSkinType(e.target.value)}>
            <option value="All">All Skin Types</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
            <option value="Sensitive">Sensitive</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Concern</label>
          <select value={selectedConcern} onChange={(e) => setSelectedConcern(e.target.value)}>
            <option value="All">All Concerns</option>
            <option value="Acne">Acne</option>
            <option value="Anti-aging">Anti-aging</option>
            <option value="Hydration">Hydration</option>
            <option value="Brightening">Brightening</option>
            <option value="Dark Spots">Dark Spots</option>
            <option value="Oil Control">Oil Control</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popularity">Popularity</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Count */}
      <div className="products-count">
        Showing {sortedProducts.length} of {products.length} products
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {sortedProducts.map(product => {
          const isWish = isWishlisted(product._id);
          return (
            <div key={product._id} className="product-card">
              {product.badge && (
                <span className={`product-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
              
              <button
                className={`wishlist-btn ${isWish ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <FiHeart />
              </button>

              <div className="product-image-container" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-overlay" onClick={(e) => e.stopPropagation()}>
                  <button className="quick-view-btn" onClick={() => setSelectedProduct(product)}>
                    <FiEye /> Quick View
                  </button>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                  {product.name}
                </h3>
                <p className="product-description">{product.subtitle || product.description}</p>
                
                <div className="reviews-row">
                  {renderStars(product.rating)}
                  <span className="product-reviews">({product.reviewsCount || product.reviews || 0} reviews)</span>
                </div>

                <div className="product-price-row">
                  <div className="product-prices">
                    <span className="product-price">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="product-original-price">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FiShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <FiX />
            </button>

            <div className="modal-content">
              <div className="modal-image-section">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>

              <div className="modal-info-section">
                <div className="modal-category">{selectedProduct.category.toUpperCase()}</div>
                <h2 className="modal-product-name">{selectedProduct.name}</h2>
                
                <div className="modal-rating">
                  {renderStars(selectedProduct.rating)}
                  <span>({selectedProduct.reviewsCount || selectedProduct.reviews || 0} reviews)</span>
                </div>

                <div className="modal-prices">
                  <span className="modal-price">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <>
                      <span className="modal-original-price">₹{selectedProduct.originalPrice}</span>
                      <span className="modal-discount">
                        {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                <div className="modal-info-grid">
                  <div className="modal-section">
                    <h4>Skin Type</h4>
                    <div className="modal-tags">
                      {selectedProduct.skinType.map(type => (
                        <span key={type} className="modal-tag">{type}</span>
                      ))}
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>Concerns</h4>
                    <div className="modal-tags">
                      {selectedProduct.concerns.map(concern => (
                        <span key={concern} className="modal-tag">{concern}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="modal-add-to-cart"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button 
                    className="modal-view-details"
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate(`/product/${selectedProduct._id}`);
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    className="modal-wishlist-toggle" 
                    onClick={() => toggleWishlist(selectedProduct)}
                  >
                    <FiHeart className={isWishlisted(selectedProduct._id) ? 'active' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
