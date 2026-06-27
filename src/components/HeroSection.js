import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import heroimg from '../assets/heroimg.jpg'; // Ensure correct path and filename

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="beauty-shop">Beauty Shop</div>
      <div className="hero-content">
        <div className="hero-left">
          <h1>
            Premium Skincare for <br />
            Maximum <span className="hero-underline"></span> Results
          </h1>
          <button className="hero-shop-btn" onClick={() => navigate('/products')}>
            Shop Our Collection &rarr;
          </button>
        </div>
        <div className="hero-rating">
          <span>★★★★★</span>
          <span className="hero-reviews">4.9 / 399 Review</span>
        </div>
      </div>
      <div className="hero-image-container">
        <svg
          viewBox="0 0 980 420"
          width="100%"
          className="hero-svg-mask"
        >
          <defs>
            <clipPath id="roundedRect">
              <rect x="0" y="0" width="980" height="420" rx="65" ry="65" />
            </clipPath>
          </defs>
          <image
            href={heroimg}
            width="980"
            height="420"
            style={{ clipPath: "url(#roundedRect)" }}
            className="hero-image-custom"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
