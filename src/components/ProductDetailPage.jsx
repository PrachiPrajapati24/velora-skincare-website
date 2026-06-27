import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft, FiCheck, FiBell } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Toast from './Toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [toast, setToast] = useState(null);
  const [notifyDone, setNotifyDone] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          
          // Fetch related products in same category
          const allRes = await api.get('/products');
          if (allRes.data.success) {
            const filtered = allRes.data.products.filter(
              p => p.category === res.data.product.category && p._id !== id
            );
            setRelatedProducts(filtered.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    setQuantity(1);
    setReviewComment('');
    setReviewSuccess('');
    setReviewError('');
  }, [id]);

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setToast({ message: `${quantity} × ${product.name} added to cart!`, type: 'success' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewComment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }

    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        setReviewSuccess('Thank you! Your review has been submitted.');
        setReviewComment('');
        setReviewRating(5);
        // Refresh product details
        setProduct(res.data.product);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="detail-stars">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-num">{Number(rating).toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="product-detail-page loading">
        <div className="detail-container">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page not-found">
        <div className="detail-container">
          <h2>Product Not Found</h2>
          <p>We couldn't find the product you were looking for.</p>
          <button className="back-btn" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isWish = isWishlisted(product._id);
  const inStock = product.inStock !== false;

  return (
    <div className="product-detail-page">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      <div className="detail-container">
        {/* Back Link */}
        <button className="back-btn" onClick={() => navigate('/products')}>
          <FiArrowLeft /> Back to Products
        </button>

        {/* Product Details Section */}
        <div className="product-detail-grid">
          {/* Image */}
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} className="detail-image" />
            {product.badge && <span className="detail-badge">{product.badge}</span>}
          </div>

          {/* Info */}
          <div className="detail-info-section">
            <span className="detail-category">{product.category.toUpperCase()}</span>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-subtitle">{product.subtitle}</p>

            <div className="detail-rating-row">
              {renderStars(product.rating)}
              <span className="detail-reviews-count">({product.reviewsCount || 0} reviews)</span>
            </div>

            <div className="detail-prices">
              <span className="detail-price">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="detail-original-price">₹{product.originalPrice}</span>
                  <span className="detail-discount">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="detail-divider"></div>

            <p className="detail-description">{product.description}</p>

            {/* Form details */}
            <div className="detail-meta-grid">
              {product.skinType && product.skinType.length > 0 && (
                <div>
                  <strong>Skin Type:</strong>
                  <div className="detail-tags">
                    {product.skinType.map(t => <span key={t} className="detail-tag">{t}</span>)}
                  </div>
                </div>
              )}
              {product.concerns && product.concerns.length > 0 && (
                <div>
                  <strong>Concern:</strong>
                  <div className="detail-tags">
                    {product.concerns.map(c => <span key={c} className="detail-tag">{c}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="detail-divider"></div>

            {/* Actions */}
            {inStock ? (
              <div className="detail-actions">
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                </div>

                <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                  <FiShoppingCart /> Add to Cart
                </button>

                <button 
                  className={`wishlist-btn-large ${isWish ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <FiHeart />
                </button>
              </div>
            ) : (
              <div className="detail-actions">
                <div className="out-of-stock-label">Out of Stock</div>
                <button
                  className={`notify-btn ${notifyDone ? 'notify-btn--done' : ''}`}
                  onClick={() => { setNotifyDone(true); setToast({ message: '🔔 We will notify you when back in stock!', type: 'info' }); }}
                  disabled={notifyDone}
                >
                  {notifyDone ? <><FiCheck /> Notified</> : <><FiBell /> Notify Me</>}
                </button>
                <button 
                  className={`wishlist-btn-large ${isWish ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <FiHeart />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients & How to Use Tabs */}
        <div className="detail-tabs-section">
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="detail-tab-block">
              <h3>Key Ingredients</h3>
              <ul className="ingredients-list">
                {product.ingredients.map(ing => (
                  <li key={ing}><FiCheck /> {ing}</li>
                ))}
              </ul>
            </div>
          )}

          {product.howToUse && (
            <div className="detail-tab-block">
              <h3>How to Use</h3>
              <p className="how-to-use-text">{product.howToUse}</p>
            </div>
          )}
        </div>

        <div className="detail-divider"></div>

        {/* Reviews Section */}
        <div className="detail-reviews-section">
          <h2>Customer Reviews</h2>
          
          <div className="reviews-layout">
            {/* Left side: Review List */}
            <div className="reviews-list-block">
              {product.reviewsList && product.reviewsList.length > 0 ? (
                product.reviewsList.map((rev, idx) => (
                  <div key={rev._id || idx} className="review-item-card">
                    <div className="review-item-header">
                      <strong>{rev.name}</strong>
                      <span className="review-item-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rev.rating ? 'star-filled-small' : 'star-empty-small'}>★</span>
                        ))}
                      </span>
                    </div>
                    <span className="review-item-date">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    <p className="review-item-comment">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">No reviews yet for this product. Be the first to review!</p>
              )}
            </div>

            {/* Right side: Submit Review form */}
            <div className="reviews-form-block">
              <h3>Write a Review</h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="submit-review-form">
                  {reviewSuccess && <div className="review-success">{reviewSuccess}</div>}
                  {reviewError && <div className="review-error">{reviewError}</div>}

                  <div className="form-group">
                    <label>Rating</label>
                    <select 
                      value={reviewRating} 
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="review-rating-select"
                    >
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Very Bad</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Comment</label>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-review-btn">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="review-login-prompt">
                  <p>Please log in to submit a review.</p>
                  <Link to="/profile" className="login-btn-link">Login Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(p => (
                <div key={p._id} className="related-card" onClick={() => navigate(`/product/${p._id}`)}>
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p className="related-price">₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
