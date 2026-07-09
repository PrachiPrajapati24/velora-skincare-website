import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Footer.css";

// Import your images
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.png";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.png";
import img10 from "../assets/img10.jpg";

const FOOTER_IMAGES = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  // Duplicate for seamless loop
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
];

const Footer = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subMessage, setSubMessage] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Adjust speed here
    let animationFrame;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Function to navigate and scroll to top
  const handleNavigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate(path);
    }, 300);
  };


  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubMessage('');
    if (!email) return;

    setSubLoading(true);

    const attemptSubscribe = async (attempt = 1) => {
      try {
        const res = await api.post('/newsletter', { email });
        if (res.data.success) {
          setSubscribed(true);
          setSubMessage(res.data.message || 'Thank you for subscribing!');
          setEmail('');
        }
      } catch (err) {
        const status = err.response?.status;
        // 502/503/504 = Render server cold-starting — retry once after a short delay
        if ((status === 502 || status === 503 || status === 504) && attempt === 1) {
          setSubMessage('Server is waking up, retrying in 5 seconds...');
          setTimeout(async () => {
            setSubMessage('');
            await attemptSubscribe(2);
          }, 5000);
          return;
        }
        setSubMessage(
          status === 502 || status === 503 || status === 504
            ? 'Server is starting up. Please try again in a moment.'
            : err.response?.data?.message || 'Subscription failed. Please try again.'
        );
      } finally {
        if (attempt !== 1) setSubLoading(false);
      }
    };

    await attemptSubscribe(1);
    setSubLoading(false);
  };

  return (
    <footer className="velora-footer">
      {/* Sliding Image Gallery */}
      <div className="footer-gallery" ref={scrollRef}>
        <div className="gallery-track">
          {FOOTER_IMAGES.map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img} alt={`Velora ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="footer-logo">VELORA</h2>
            <p className="footer-description">
              Velora skincare is here to provide optimal skincare with
              high-quality natural ingredients.
            </p>
            
            {/* CTA Buttons */}
            <div className="footer-buttons">
              <button 
                className="footer-btn footer-btn-primary"
                onClick={() => handleNavigate('/products')}
              >
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button 
                className="footer-btn footer-btn-secondary"
                onClick={() => handleNavigate('/contact')}
              >
                Contact Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="footer-nav">
            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Product</h3>
              <ul className="footer-nav-list">
                <li><button onClick={() => handleNavigate('/products')}>Skincare</button></li>
                <li><button onClick={() => handleNavigate('/products')}>Body Care</button></li>
                <li><button onClick={() => handleNavigate('/products')}>Hybrid</button></li>
                <li><button onClick={() => handleNavigate('/products')}>Make Up</button></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Company</h3>
              <ul className="footer-nav-list">
                <li><button onClick={() => handleNavigate('/about')}>About Us</button></li>
                <li><button onClick={() => handleNavigate('/sustainability')}>Sustainability</button></li>
                <li><button onClick={() => handleNavigate('/contact')}>Contact Us</button></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="footer-nav-column footer-newsletter-column">
              <h3 className="footer-nav-title">Join The Circle</h3>
              <p className="newsletter-text">Subscribe to receive skincare tips and 10% OFF code.</p>
              
              {subscribed ? (
                <div className="newsletter-success">{subMessage}</div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input"
                    disabled={subLoading}
                  />
                  <button type="submit" className="newsletter-btn" aria-label="Subscribe" disabled={subLoading}>
                    {subLoading ? (
                      <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    ) : '→'}
                  </button>
                </form>
              )}
              {subMessage && !subscribed && (
                <p className={subMessage.includes('waking') || subMessage.includes('starting') ? 'newsletter-info' : 'newsletter-error'}>
                  {subMessage}
                </p>
              )}
            </div>

            <div className="footer-nav-column">
              <h3 className="footer-nav-title">Social Media</h3>
              <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-container">
            <p className="footer-copyright">
              ©2026 Velora. All Rights Reserved.
            </p>
            <div className="footer-links">
              <button onClick={() => handleNavigate('/terms')}>Terms & Conditions</button>
              <span className="separator">|</span>
              <button onClick={() => handleNavigate('/privacy')}>Privacy Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
