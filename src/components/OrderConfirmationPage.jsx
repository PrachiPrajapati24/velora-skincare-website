import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve details passed from CheckoutPage
  const { orderId, total, points } = location.state || {};

  // If accessed directly without order details, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
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
    </div>
  );
};

export default OrderConfirmationPage;
