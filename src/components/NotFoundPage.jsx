import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-number">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-subtitle">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <div className="notfound-actions">
          <button className="notfound-home-btn" onClick={() => navigate('/')}>
            Go to Homepage
          </button>
          <button className="notfound-shop-btn" onClick={() => navigate('/products')}>
            Explore Products
          </button>
        </div>

        <div className="notfound-links">
          <span>Quick Links: </span>
          <Link to="/about">About Us</Link>
          <span className="sep">·</span>
          <Link to="/contact">Contact</Link>
          <span className="sep">·</span>
          <Link to="/blog">Journal</Link>
          <span className="sep">·</span>
          <Link to="/loyalty">Rewards</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
