import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './CheckoutPage.css';
import { FiMapPin, FiCreditCard, FiChevronRight, FiLock } from 'react-icons/fi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, refreshProfile } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Pricing summary
  const subtotal = cartTotal;
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  
  // Check for discount passed in router state from CartPage
  const discount = location.state?.discount || 0;
  const total = subtotal + tax + shipping - discount;

  // Step state: 1 = Shipping, 2 = Review & Payment
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('simulated_card');

  const handleFormChange = (e) => {
    setShippingForm({
      ...shippingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (
      !shippingForm.name.trim() ||
      !shippingForm.address.trim() ||
      !shippingForm.city.trim() ||
      !shippingForm.state.trim() ||
      !shippingForm.zip.trim() ||
      !shippingForm.phone.trim()
    ) {
      setError('Please fill in all shipping details.');
      return;
    }
    
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    // Format items for Mongoose Order model
    const orderItems = cartItems.map(item => ({
      product: item.product?._id || item.product,
      name: item.product?.name,
      price: item.product?.price,
      quantity: item.quantity,
      image: item.product?.image
    }));

    const orderPayload = {
      orderItems,
      shippingAddress: shippingForm,
      paymentMethod: paymentMethod === 'simulated_card' ? 'Simulated Card' : 'Simulated UPI',
      subtotal,
      tax,
      shippingPrice: shipping,
      discount,
      totalPrice: total
    };

    try {
      // API call to place order
      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        // Refresh auth profile (gives points update!)
        await refreshProfile();
        
        // Clear local/db cart
        await clearCart();
        
        // Redirect to confirmation page
        navigate('/order-confirmation', { 
          state: { 
            orderId: res.data.order._id,
            total,
            points: res.data.earnedPoints
          } 
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty">
        <div className="checkout-container">
          <h2>Your Cart is Empty</h2>
          <p>You cannot checkout with an empty cart.</p>
          <button className="shop-btn" onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Progress Indicator */}
        <div className="checkout-steps">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <FiChevronRight className="step-separator" />
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Payment & Review</span>
          </div>
        </div>

        {error && <div className="checkout-error-alert">{error}</div>}

        <div className="checkout-layout">
          {/* Left Side: Step Content */}
          <div className="checkout-main-content">
            {step === 1 ? (
              /* Step 1: Shipping Address Form */
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="shipping-form">
                  <div className="form-group full-width">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={shippingForm.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Street Address*</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Apartment, suite, street address"
                      value={shippingForm.address}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City*</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        value={shippingForm.city}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>State*</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Maharashtra"
                        value={shippingForm.state}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP/Postal Code*</label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="400001"
                        value={shippingForm.zip}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={shippingForm.phone}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="checkout-next-btn">
                    Continue to Payment &amp; Review &rarr;
                  </button>
                </form>
              </div>
            ) : (
              /* Step 2: Payment Simulation & Order Review */
              <div className="checkout-section">
                <h2>Payment &amp; Review</h2>

                {/* Shipping Summary */}
                <div className="summary-block">
                  <div className="summary-block-header">
                    <h3><FiMapPin /> Delivery Address</h3>
                    <button className="edit-step-btn" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p>
                    <strong>{shippingForm.name}</strong><br />
                    {shippingForm.address}, {shippingForm.city}, {shippingForm.state} - {shippingForm.zip}<br />
                    Phone: {shippingForm.phone}
                  </p>
                </div>

                {/* Simulated Payment Block */}
                <div className="summary-block">
                  <h3><FiCreditCard /> Choose Payment Mode</h3>
                  <div className="payment-options">
                    <label className={`payment-option-card ${paymentMethod === 'simulated_card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="simulated_card"
                        checked={paymentMethod === 'simulated_card'}
                        onChange={() => setPaymentMethod('simulated_card')}
                      />
                      <div className="option-desc">
                        <strong>Simulated Card</strong>
                        <p>Instant processing with simulated validation</p>
                      </div>
                    </label>

                    <label className={`payment-option-card ${paymentMethod === 'simulated_upi' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="simulated_upi"
                        checked={paymentMethod === 'simulated_upi'}
                        onChange={() => setPaymentMethod('simulated_upi')}
                      />
                      <div className="option-desc">
                        <strong>Simulated UPI</strong>
                        <p>Simulate transaction via standard scan</p>
                      </div>
                    </label>
                  </div>

                  <div className="simulated-payment-box">
                    <p>💡 <strong>Sandbox Mode:</strong> Payment will be mock-authorized. No real money is processed.</p>
                  </div>
                </div>

                {/* Place Order CTA */}
                <div className="place-order-actions">
                  <button 
                    className="place-order-btn" 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      'Processing Order...'
                    ) : (
                      <>
                        <FiLock /> Pay &amp; Place Order (₹{total})
                      </>
                    )}
                  </button>
                  <button className="back-to-shipping-btn" onClick={() => setStep(1)} disabled={loading}>
                    &larr; Back to Shipping Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Order Review Summary */}
          <div className="checkout-side-summary">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              
              <div className="checkout-summary-items">
                {cartItems.map(item => (
                  <div key={item.product?._id || item.product} className="summary-item-row">
                    <img src={item.product?.image} alt={item.product?.name} className="summary-item-img" />
                    <div className="summary-item-details">
                      <h4>{item.product?.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span className="summary-item-price">₹{item.product?.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="detail-divider"></div>

              <div className="summary-pricing-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-pricing-row">
                <span>Tax (GST 18%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="summary-pricing-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-pricing-row discount">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="detail-divider"></div>

              <div className="summary-pricing-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="earned-points-banner">
                🌟 You will earn <strong>{Math.floor(total)} Velora Points</strong> with this order!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
