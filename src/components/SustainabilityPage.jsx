import React from 'react';
import './SustainabilityPage.css';
import { FiFeather, FiPackage, FiHeart, FiRefreshCw, FiAward, FiTrendingUp } from 'react-icons/fi';



const SustainabilityPage = () => {
  return (
    <div className="sustainability-page">
      {/* Hero Section */}
      <section className="sustainability-hero">
        <div className="sustainability-hero-content">
          <h1>Our Commitment to Sustainability</h1>
          <p>Beauty that doesn't cost the Earth</p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-stats">
        <div className="sustainability-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <p>Recyclable Packaging</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">Carbon</div>
              <p>Neutral Since 2020</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <p>Fair Trade Farms</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">Zero</div>
              <p>Waste to Landfill</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="commitments-section">
        <div className="sustainability-container">
          <h2 className="section-title">Our Environmental Commitments</h2>
          <div className="commitments-grid">
            <div className="commitment-card">
              <div className="commitment-icon">
              <FiFeather />

              </div>
              <h3>Environmental Responsibility</h3>
              <ul>
                <li>Eco-friendly packaging (recyclable, biodegradable)</li>
                <li>Reducing carbon footprint continuously</li>
                <li>Water conservation in manufacturing</li>
                <li>100% renewable energy usage by 2026</li>
              </ul>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <FiPackage />
              </div>
              <h3>Ethical Sourcing</h3>
              <ul>
                <li>Sustainably sourced ingredients</li>
                <li>Fair trade practices</li>
                <li>Supporting local farmers</li>
                <li>No harm to endangered species</li>
              </ul>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <FiHeart />
              </div>
              <h3>Social Responsibility</h3>
              <ul>
                <li>100% Cruelty-free (no animal testing)</li>
                <li>Fair labor practices</li>
                <li>Community support programs</li>
                <li>Diversity and inclusion initiatives</li>
              </ul>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <FiRefreshCw />
              </div>
              <h3>Circular Economy</h3>
              <ul>
                <li>Product recycling programs</li>
                <li>Refillable containers</li>
                <li>Zero waste initiatives</li>
                <li>Upcycling programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Packaging */}
      <section className="packaging-section">
        <div className="sustainability-container">
          <div className="packaging-content">
            <div className="packaging-image">
              <img src="https://images.unsplash.com/photo-1556228841-0e56870f09b7?w=600&q=80" alt="Sustainable Packaging" />
            </div>
            <div className="packaging-text">
              <h2>Sustainable Packaging</h2>
              <p className="section-description">
                Every Velora product is housed in packaging designed with the planet in mind.
              </p>
              <div className="packaging-features">
                <div className="feature-row">
                  <span className="feature-icon">🌱</span>
                  <div>
                    <h4>Glass & Bamboo Materials</h4>
                    <p>Recyclable glass bottles with bamboo caps</p>
                  </div>
                </div>
                <div className="feature-row">
                  <span className="feature-icon">♻️</span>
                  <div>
                    <h4>100% Recycled Cardboard</h4>
                    <p>All outer packaging made from post-consumer waste</p>
                  </div>
                </div>
                <div className="feature-row">
                  <span className="feature-icon">🌊</span>
                  <div>
                    <h4>Plastic-Free by 2026</h4>
                    <p>Eliminating all plastic from our supply chain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bars */}
      <section className="progress-section">
        <div className="sustainability-container">
          <h2 className="section-title">Our Progress Towards 2030 Goals</h2>
          <div className="progress-grid">
            <div className="progress-item">
              <div className="progress-label">
                <span>Renewable Energy</span>
                <span className="progress-percentage">85%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Recyclable Materials</span>
                <span className="progress-percentage">100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Water Conservation</span>
                <span className="progress-percentage">70%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Carbon Neutrality</span>
                <span className="progress-percentage">100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="certifications-section">
        <div className="sustainability-container">
          <h2 className="section-title">Our Certifications & Partnerships</h2>
          <div className="certifications-grid">
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>Cruelty-Free</h4>
              <p>Leaping Bunny Certified</p>
            </div>
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>Vegan</h4>
              <p>100% Vegan Products</p>
            </div>
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>B-Corporation</h4>
              <p>Certified B Corp</p>
            </div>
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>Fair Trade</h4>
              <p>Fair Trade Certified</p>
            </div>
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>Rainforest Alliance</h4>
              <p>Supporting Conservation</p>
            </div>
            <div className="cert-badge">
              <FiAward className="cert-icon" />
              <h4>Carbon Neutral</h4>
              <p>Climate Neutral Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Program */}
      <section className="recycling-program">
        <div className="sustainability-container">
          <h2 className="section-title">Join Our Recycling Program</h2>
          <p className="section-description">Return your empty Velora containers and get rewarded</p>
          
          <div className="recycling-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Collect</h4>
              <p>Save your empty Velora products</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Return</h4>
              <p>Drop off at any Velora store or mail back</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Earn</h4>
              <p>Get ₹100 credit for every 5 containers</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Recycle</h4>
              <p>We ensure proper recycling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="future-goals">
        <div className="sustainability-container">
          <h2 className="section-title">Our 2030 Vision</h2>
          <div className="goals-grid">
            <div className="goal-card">
              <FiTrendingUp className="goal-icon" />
              <h3>2026 Target</h3>
              <ul>
                <li>100% Plastic-Free Packaging</li>
                <li>50% Reduction in Water Usage</li>
                <li>100% Renewable Energy</li>
              </ul>
            </div>
            <div className="goal-card">
              <FiTrendingUp className="goal-icon" />
              <h3>2030 Target</h3>
              <ul>
                <li>Climate Positive Operations</li>
                <li>Zero Waste to Landfill</li>
                <li>100% Regenerative Ingredients</li>
              </ul>
            </div>
            <div className="goal-card">
              <FiTrendingUp className="goal-icon" />
              <h3>2050 Vision</h3>
              <ul>
                <li>Net Positive Impact</li>
                <li>100% Circular Supply Chain</li>
                <li>Restore 1 Million Acres of Land</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;
