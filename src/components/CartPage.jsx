import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import Toast from './Toast';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, addToCart } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [discount, setDiscount] = useState(0);
  const [recProducts, setRecProducts] = useState([]);
  const [toast, setToast] = useState(null);

  // Fetch recommendation products (products not in the cart)
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          // Filter out products already in cart
          const cartProductIds = cartItems.map(item => item.product?._id || item.product);
          const filtered = res.data.products.filter(p => !cartProductIds.includes(p._id));
          // Take first 4 items as recommendations
          setRecProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };
    
    fetchRecs();
  }, [cartItems]);

  // Calculate pricing summary details
  const subtotal = cartTotal;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99; // Free shipping over ₹2000
  const total = subtotal + tax + shipping - discount;

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'VELORA10') {
      setDiscount(Math.round(subtotal * 0.1));
      setPromoMsg('success');
      setToast({ message: '🎉 Promo code applied! 10% discount', type: 'success' });
    } else {
      setPromoMsg('error');
      setToast({ message: 'Invalid promo code. Try VELORA10', type: 'error' });
    }
  };

  const handleRecAddToCart = (product) => {
    addToCart(product, 1);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const getProductImage = (product) => {
    return product?.image || 'https://via.placeholder.com/150';
  };

  return (
    <div className="cart-page">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <div className="cart-container">
          <span onClick={() => navigate('/')}>Home</span>
          <span className="separator">›</span>
          <span onClick={() => navigate('/products')}>Shop</span>
          <span className="separator">›</span>
          <span className="active">Cart</span>
        </div>
      </div>

      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button className="start-shopping-btn" onClick={() => navigate('/products')}>
              <FiShoppingBag /> Start Shopping
            </button>
          </div>
        ) : (
          /* Cart Content */
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span className="items-count">{cartItems.length} Items</span>
              </div>

              {cartItems.map(item => {
                const prod = item.product;
                if (!prod) return null;
                const prodId = prod._id || prod;
                
                return (
                  <div key={prodId} className="cart-item">
                    <div className="item-image" onClick={() => navigate(`/product/${prodId}`)}>
                      <img src={getProductImage(prod)} alt={prod.name} />
                    </div>

                    <div className="item-details">
                      <h3 onClick={() => navigate(`/product/${prodId}`)} style={{ cursor: 'pointer' }}>
                        {prod.name}
                      </h3>
                      <p>{prod.subtitle || prod.description}</p>
                      <span className="item-price">₹{prod.price}</span>
                    </div>

                    <div className="item-quantity">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(prodId, item.quantity - 1)}
                      >
                        <FiMinus />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(prodId, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="item-subtotal">
                      <span>₹{prod.price * item.quantity}</span>
                    </div>

                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(prodId)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span>Tax (GST 18%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoMsg(''); }}
                  className={promoMsg === 'error' ? 'promo-input-error' : promoMsg === 'success' ? 'promo-input-success' : ''}
                />
                <button onClick={applyPromo}>Apply</button>
              </div>
              {promoMsg === 'error' && <p className="promo-feedback promo-feedback--error">Invalid code. Try VELORA10</p>}
              {promoMsg === 'success' && <p className="promo-feedback promo-feedback--success">10% discount applied ✓</p>}

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">₹{total}</span>
              </div>

              <button 
                className="checkout-btn" 
                onClick={() => navigate('/checkout', { state: { subtotal, tax, shipping, discount, total } })}
              >
                Proceed to Checkout
              </button>

              <div className="secure-checkout">
                🔒 Secure Checkout
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recProducts.length > 0 && (
          <div className="recommendations">
            <h2>You May Also Like</h2>
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
                  <button className="add-to-cart-rec" onClick={() => handleRecAddToCart(product)}>
                    Add to Cart
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

export default CartPage;
