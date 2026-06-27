import React from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();  // Add this hook

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Velora</h1>
          <p>Where Nature Meets Nurture</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <div className="about-container">
          <div className="story-grid">
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80" alt="Velora Story" />
            </div>
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, Velora was born from a simple belief: skincare should be as pure as nature intended. Our journey began with a passion for creating products that not only enhance beauty but also nourish the skin with the finest natural ingredients.
              </p>
              <p>
                Every Velora product is crafted with care, combining traditional wisdom with modern science to deliver exceptional results. We believe in transparency, sustainability, and the power of nature to transform your skincare routine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="about-container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🌿</div>
              <h3>Our Mission</h3>
              <p>To provide clean, effective, and sustainable skincare solutions that empower individuals to embrace their natural beauty with confidence.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">✨</div>
              <h3>Our Vision</h3>
              <p>To become a global leader in natural skincare, setting new standards for quality, transparency, and environmental responsibility.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💚</div>
              <h3>Our Values</h3>
              <p>Authenticity, sustainability, innovation, and a deep commitment to both people and planet guide everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="about-features">
        <div className="about-container">
          <h2 className="section-title">Why Choose Velora?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h4>100% Natural Ingredients</h4>
              <p>We source only the finest natural ingredients, free from harmful chemicals and toxins.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <h4>Cruelty-Free</h4>
              <p>All our products are cruelty-free and never tested on animals.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <h4>Sustainable Packaging</h4>
              <p>Eco-friendly packaging made from recyclable and biodegradable materials.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <h4>Dermatologist Tested</h4>
              <p>Every product is rigorously tested to ensure safety and effectiveness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="team-subtitle">Passionate individuals dedicated to bringing you the best in natural skincare</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Team Member" />
              </div>
              <h4>Prachi Prajapati</h4>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Team Member" />
              </div>
              <h4>Ananya Gupta</h4>
              <p>Head of Research</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80" alt="Team Member" />
              </div>
              <h4>Rohan Mehta</h4>
              <p>Product Development</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80" alt="Team Member" />
              </div>
              <h4>Kavya Reddy</h4>
              <p>Sustainability Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Join the Velora Family</h2>
          <p>Experience the power of nature in every drop</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/products')}  // Add this onClick handler
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
