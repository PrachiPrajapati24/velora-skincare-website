import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoyaltyPage.css';
import { FiAward, FiLock, FiStar, FiCheck, FiCopy, FiX } from 'react-icons/fi';

const REWARDS = [
  {
    id: 1,
    title: '₹150 Off Discount Coupon',
    cost: 500,
    code: 'VELORA150',
    description: 'Get ₹150 off on any purchase. Can be stacked with other offers.',
    icon: '🎟️'
  },
  {
    id: 2,
    title: 'Free Shipping Coupon',
    cost: 800,
    code: 'FREESHIP',
    description: 'Get free shipping on your next order, regardless of cart value.',
    icon: '🚚'
  },
  {
    id: 3,
    title: '₹400 Off Discount Coupon',
    cost: 1200,
    code: 'VELORA400',
    description: 'Get ₹400 off on any purchase with a minimum value of ₹1500.',
    icon: '🎟️'
  },
  {
    id: 4,
    title: 'Free Gentle Cleanser (Full Size)',
    cost: 3000,
    code: 'FREEGENTLE',
    description: 'Get a free full-size Gentle Cleanser added to your next package.',
    icon: '🧴'
  }
];

/* ── Coupon Toast ─────────────────────────────────────────────────── */
const CouponToast = ({ reward, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(onClose, 380);
  }, [onClose]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const t = setTimeout(dismiss, 8000);
    return () => clearTimeout(t);
  }, [dismiss]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`coupon-toast ${exiting ? 'coupon-toast--exit' : 'coupon-toast--enter'}`}>
      {/* Close */}
      <button className="coupon-toast__close" onClick={dismiss} aria-label="Close">
        <FiX />
      </button>

      {/* Header */}
      <div className="coupon-toast__header">
        <span className="coupon-toast__celebrate">🎉</span>
        <div>
          <p className="coupon-toast__eyebrow">Reward Unlocked!</p>
          <h4 className="coupon-toast__title">{reward.title}</h4>
        </div>
      </div>

      {/* Code chip */}
      <div className="coupon-toast__code-row">
        <span className="coupon-toast__code">{reward.code}</span>
        <button
          className={`coupon-toast__copy ${copied ? 'coupon-toast__copy--done' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy</>}
        </button>
      </div>

      <p className="coupon-toast__hint">Apply at checkout to claim your reward ✨</p>

      {/* Progress bar */}
      <div className="coupon-toast__progress">
        <div className="coupon-toast__progress-bar" style={{ animationDuration: '8s' }} />
      </div>
    </div>
  );
};

/* ── Main Page ────────────────────────────────────────────────────── */
const LoyaltyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeToast, setActiveToast] = useState(null);

  const userPoints = user?.points || 0;

  const handleRedeem = (reward) => {
    setActiveToast(reward);
  };

  const getTierName = (points) => {
    if (points >= 5000) return 'Gold Member';
    if (points >= 2000) return 'Silver Member';
    return 'Bronze Member';
  };

  const getTierColor = (points) => {
    if (points >= 5000) return '#d4af37';
    if (points >= 2000) return '#c0c0c0';
    return '#b87333';
  };

  const currentTier = getTierName(userPoints);
  const tierColor = getTierColor(userPoints);

  return (
    <div className="loyalty-page">
      {/* Coupon Toast */}
      {activeToast && (
        <CouponToast reward={activeToast} onClose={() => setActiveToast(null)} />
      )}

      {/* Hero Banner */}
      <section className="loyalty-hero">
        <div className="loyalty-container">
          <span className="hero-badge">VELORA CIRCLE</span>
          <h1>Velora Rewards Program</h1>
          <p>Earn points on every purchase and unlock exclusive rewards, free products, and special benefits.</p>
        </div>
      </section>

      <div className="loyalty-container">
        {/* User Points Status Panel */}
        <section className="points-status-section">
          {isAuthenticated ? (
            <div className="points-status-card animate-slide-up">
              <div className="status-header">
                <div>
                  <span className="status-lbl">WELCOME BACK</span>
                  <h2>{user?.name}</h2>
                </div>
                <div className="tier-badge-large" style={{ backgroundColor: `${tierColor}15`, color: tierColor, borderColor: tierColor }}>
                  <FiAward /> {currentTier}
                </div>
              </div>

              <div className="status-stats-row">
                <div className="stat-box">
                  <span className="stat-val">{userPoints.toLocaleString()}</span>
                  <span className="stat-lbl">Available Points</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val">₹1 = 1 Point</span>
                  <span className="stat-lbl">Earning Rate</span>
                </div>
                <div className="stat-box benefit-box">
                  <span className="stat-val">
                    {userPoints >= 5000 ? '15%' : userPoints >= 2000 ? '10%' : '5%'} OFF
                  </span>
                  <span className="stat-lbl">Exclusive Member Discount</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="points-login-prompt">
              <FiLock size={36} />
              <h2>Track Your Rewards</h2>
              <p>Sign in to view your available points, check your rewards tier, and redeem coupons.</p>
              <button className="loyalty-login-btn" onClick={() => navigate('/profile')}>
                Sign In / Register
              </button>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="how-step">
              <div className="step-num-icon">1</div>
              <h3>Join the Circle</h3>
              <p>Create a free account to instantly join the rewards program and start earning points.</p>
            </div>
            <div className="how-step">
              <div className="step-num-icon">2</div>
              <h3>Earn on Purchases</h3>
              <p>Get 1 point for every ₹1 spent on our website. Watch your points stack up automatically.</p>
            </div>
            <div className="how-step">
              <div className="step-num-icon">3</div>
              <h3>Redeem &amp; Enjoy</h3>
              <p>Exchange your points for discount coupons, free shipping, and full-size complimentary products.</p>
            </div>
          </div>
        </section>

        {/* Rewards Catalog */}
        <section className="rewards-catalog">
          <h2>Redeem Rewards</h2>
          <p className="catalog-subtitle">Trade in your points for special luxury skincare rewards.</p>

          <div className="rewards-grid">
            {REWARDS.map(reward => {
              const canRedeem = isAuthenticated && userPoints >= reward.cost;

              return (
                <div key={reward.id} className={`reward-card-item ${!canRedeem && isAuthenticated ? 'locked' : ''}`}>
                  <div className="reward-icon-box">{reward.icon}</div>

                  <div className="reward-info-details">
                    <div className="reward-cost-tag">
                      <FiStar /> {reward.cost} Points
                    </div>
                    <h3>{reward.title}</h3>
                    <p>{reward.description}</p>

                    {isAuthenticated ? (
                      <button
                        className={`redeem-btn ${!canRedeem ? 'disabled' : ''}`}
                        onClick={() => canRedeem && handleRedeem(reward)}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Redeem Coupon' : `Requires ${reward.cost} Points`}
                      </button>
                    ) : (
                      <button className="redeem-btn login-required" onClick={() => navigate('/profile')}>
                        Login to Redeem
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoyaltyPage;
