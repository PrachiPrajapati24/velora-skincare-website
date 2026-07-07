import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight, FiStar } from 'react-icons/fi';
import ReviewModal from './ReviewModal';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Retrieve details passed from CheckoutPage
  const { orderId, total, points } = location.state || {};

  // If accessed directly without order details, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    // Offer review after 3 seconds — optional, non-blocking
    const timer = setTimeout(() => {
      setShowReview(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Animated Checkmark */}
        <div className="checkmark-wrapper">
          <FiCheckCircle className="checkmark-icon" />
        </div>

        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">
          Thank you for shopping with Velora. We have received your order and are preparing it for shipment.
        </p>

        {/* Order Details Card */}
        <div className="order-details-card">
          <div className="detail-row">
            <span>Order Reference ID:</span>
            <strong>{orderId}</strong>
          </div>
          <div className="detail-row">
            <span>Total Paid Amount:</span>
            <strong className="price-tag">₹{total}</strong>
          </div>
          <div className="detail-row points-row">
            <span>🌟 Loyalty Points Earned:</span>
            <strong className="points-tag">+{points} Points</strong>
          </div>
          <div className="detail-divider"></div>
          <p className="shipping-notice">
            An order confirmation email containing your details and tracking code has been dispatched. Please check your inbox.
          </p>
        </div>

        {/* Review CTA */}
        {!reviewSubmitted && (
          <button
            className="leave-review-btn"
            onClick={() => setShowReview(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              margin: '16px auto 0', padding: '12px 28px',
              border: '1.5px solid #56876D', borderRadius: '30px',
              background: 'transparent', color: '#56876D',
              fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#56876D'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#56876D'; }}
          >
            <FiStar /> Leave a Review (optional)
          </button>
        )}
        {reviewSubmitted && (
          <p style={{ textAlign: 'center', color: '#56876D', fontWeight: '600', marginTop: '12px' }}>
            ✓ Thank you for your review!
          </p>
        )}

        {/* Navigation CTAs */}
        <div className="confirmation-actions">
          <button className="continue-shop-btn" onClick={() => navigate('/products')}>
            <FiShoppingBag /> Continue Shopping
          </button>
          <button className="view-history-btn" onClick={() => navigate('/profile')}>
            My Order History <FiArrowRight />
          </button>
        </div>
      </div>

      {/* Review Modal (non-mandatory, auto-opens after 3s) */}
      {showReview && (
        <ReviewModal
          orderId={orderId}
          onClose={() => setShowReview(false)}
          onSubmitted={() => {
            setReviewSubmitted(true);
            setShowReview(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderConfirmationPage;
