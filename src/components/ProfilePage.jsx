import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './ProfilePage.css';
import { FiUser, FiPackage, FiAward, FiLogOut, FiShoppingBag, FiCalendar } from 'react-icons/fi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/profile'); // Go to Auth page
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLoyaltyTier = (points) => {
    if (points >= 5000) return { name: 'Gold Member', color: '#d4af37' };
    if (points >= 2000) return { name: 'Silver Member', color: '#c0c0c0' };
    return { name: 'Bronze Member', color: '#b87333' };
  };

  if (!isAuthenticated) return null;

  const tier = getLoyaltyTier(user?.points || 0);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="user-intro">
            <div className="profile-avatar">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div>
              <h1>Welcome, {user?.name}</h1>
              <p className="user-since">Member since {new Date().getFullYear() - 1}</p>
            </div>
          </div>
          
          <button className="profile-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="profile-dashboard-grid">
          {/* Sidebar / Left Column */}
          <div className="profile-sidebar">
            {/* Loyalty Status Card */}
            <div className="profile-card loyalty-card">
              <div className="card-icon-header">
                <FiAward size={24} style={{ color: tier.color }} />
                <h3>Velora Rewards</h3>
              </div>
              <div className="loyalty-stats">
                <span className="points-display">{(user?.points || 0).toLocaleString()}</span>
                <span className="points-lbl">Points Balance</span>
              </div>
              <div className="loyalty-tier-badge" style={{ backgroundColor: `${tier.color}15`, color: tier.color }}>
                {tier.name}
              </div>
              <div className="divider"></div>
              <p className="tier-benefit-desc">
                {user?.points < 2000 
                  ? `Earn ${(2000 - (user?.points || 0)).toLocaleString()} more points to reach Silver Member tier!`
                  : user?.points < 5000 
                    ? `Earn ${(5000 - (user?.points || 0)).toLocaleString()} more points to reach Gold Member tier!`
                    : 'You have reached our highest Gold Member tier! Enjoy 15% off reward redemptions.'
                }
              </p>
              <button className="view-rewards-btn" onClick={() => navigate('/loyalty')}>
                Explore Rewards Catalog &rarr;
              </button>
            </div>

            {/* Profile Info Card */}
            <div className="profile-card info-card">
              <div className="card-icon-header">
                <FiUser size={20} />
                <h3>Personal details</h3>
              </div>
              <div className="info-detail-rows">
                <div className="info-row">
                  <span>Name</span>
                  <strong>{user?.name}</strong>
                </div>
                <div className="info-row">
                  <span>Email</span>
                  <strong>{user?.email}</strong>
                </div>
                <div className="info-row">
                  <span>Role</span>
                  <strong>{user?.role === 'admin' ? 'Administrator' : 'Standard Account'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel / Right Column */}
          <div className="profile-main-panel">
            <div className="panel-tabs">
              <button 
                className={`panel-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FiPackage /> Order History ({orders.length})
              </button>
            </div>

            {activeTab === 'orders' && (
              <div className="tab-content">
                {loadingOrders ? (
                  <p className="loading-txt">Loading your order history...</p>
                ) : orders.length === 0 ? (
                  <div className="no-orders-box">
                    <FiShoppingBag size={48} />
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet. Explore our luxury collection to start your skincare journey.</p>
                    <button className="shop-now-btn" onClick={() => navigate('/products')}>
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="order-history-card">
                        {/* Header info */}
                        <div className="order-card-header">
                          <div className="order-meta-info">
                            <div>
                              <span>ORDER ID</span>
                              <strong>{order._id}</strong>
                            </div>
                            <div>
                              <span><FiCalendar /> DATE</span>
                              <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                            </div>
                            <div>
                              <span>TOTAL PRICE</span>
                              <strong className="order-price-tag">₹{order.totalPrice}</strong>
                            </div>
                          </div>
                          
                          <div className="order-status-badge" data-status={order.status}>
                            {order.status.toUpperCase()}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-card-items">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <img src={item.image} alt={item.name} className="order-item-img" />
                              <div className="order-item-details">
                                <h4>{item.name}</h4>
                                <p>₹{item.price} x {item.quantity}</p>
                              </div>
                              <button 
                                className="buy-again-btn" 
                                onClick={() => navigate(`/product/${item.product}`)}
                              >
                                View Product &rarr;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
