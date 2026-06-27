import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import Toast from './Toast';
import './WishlistPage.css';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiHeart } from 'react-icons/fi';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [recProducts, setRecProducts] = useState([]);
  const [toast, setToast] = useState(null);

  // Fetch recommendation products (products not in wishlist)
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          const wishlistProductIds = wishlistItems.map(item => item._id || item.id);
          const filtered = res.data.products.filter(p => !wishlistProductIds.includes(p._id));
          setRecProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };
    
    fetchRecs();
  }, [wishlistItems]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
  };

  const renderStars = (rating) => {
    return (
      <div className="wishlist-stars">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  return (
    <div className="wishlist-page">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      {/* Breadcrumb */}
      <div className="wishlist-breadcrumb">
        <div className="wishlist-container">
          <span onClick={() => navigate('/')}>Home</span>
          <span className="separator">›</span>
          <span className="active">Wishlist</span>
        </div>
      </div>

      <div className="wishlist-container">
        {/* Header */}
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p className="wishlist-subtitle">{wishlistItems.length} items saved for later</p>
          </div>
          <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">💚</div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products here for easy access later</p>
            <button className="start-shopping-btn" onClick={() => navigate('/products')}>
              <FiHeart /> Start Browsing
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="wishlist-grid">
            {wishlistItems.map(item => {
              const itemInStock = item.inStock !== false; // handle default inStock=true
              const prodId = item._id || item.id;
              
              return (
                <div key={prodId} className="wishlist-card">
                  <button 
                    className="remove-wishlist-btn"
                    onClick={() => handleToggleWishlist(item)}
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>

                  {!itemInStock && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}

                  <div className="wishlist-image" onClick={() => navigate(`/product/${prodId}`)} style={{ cursor: 'pointer' }}>
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="wishlist-details">
                    <h3 onClick={() => navigate(`/product/${prodId}`)} style={{ cursor: 'pointer' }}>
                      {item.name}
                    </h3>
                    <p className="wishlist-description">{item.subtitle || item.description}</p>
                    
                    {renderStars(item.rating)}

                    <div className="wishlist-prices">
                      <span className="wishlist-price">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="wishlist-original-price">₹{item.originalPrice}</span>
                      )}
                    </div>

                    <button 
                      className={`add-to-cart-wishlist ${!itemInStock ? 'disabled' : ''}`}
                      onClick={() => itemInStock && handleAddToCart(item)}
                      disabled={!itemInStock}
                    >
                      <FiShoppingCart /> {itemInStock ? 'Add to Cart' : 'Notify Me'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommendations */}
        {recProducts.length > 0 && (
          <div className="wishlist-recommendations">
            <h2>Based on Your Wishlist</h2>
            <div className="recommendation-grid">
              {recProducts.map(product => (
                <div key={product._id} className="recommendation-card">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    onClick={() => navigate(`/product/${product._id}`)} 
                    style={{ cursor: 'pointer' }}
                  />
                  <h4 onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                    {product.name}
                  </h4>
                  <p className="rec-price">₹{product.price}</p>
                  <button className="add-to-wishlist-rec" onClick={() => handleToggleWishlist(product)}>
                    <FiHeart /> Add to Wishlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
