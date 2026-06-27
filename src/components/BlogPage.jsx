import React, { useState } from 'react';
import './BlogPage.css';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const ARTICLES = [
  {
    id: 1,
    title: 'The Ultimate Morning Skincare Routine for Radiant Skin',
    category: 'Guides',
    date: 'June 18, 2026',
    readTime: '4 min read',
    author: 'Ananya Gupta',
    summary: 'Restore your natural glow and prep your skin for the day ahead with this simple, high-performance daily morning routine.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    content: `
      <p>How you treat your skin in the morning sets the tone for the entire day. A proper morning routine isn't just about looking good; it is about protecting your skin barrier from pollutants, ultraviolet radiation, and water loss.</p>
      
      <h3>Step 1: Cleanse with Care</h3>
      <p>Start your morning with a pH-balanced, non-stripping cleanser. You want to remove the sweat and oils accumulated overnight without drying out your skin. Our <strong>Gentle Cleanser</strong> with Chamomile and Green Tea is perfect for this step.</p>
      
      <h3>Step 2: Tone and Hydrate</h3>
      <p>After cleansing, pat on a hydrating toner. Toners rebalance the skin's pH and prep the skin cells to receive subsequent active ingredients. Use a hydrating toner like our <strong>Toner Velora Perfect Hydrating</strong> with Rose Water and Glycerin.</p>
      
      <h3>Step 3: Apply Active Serums</h3>
      <p>Morning is the perfect time to protect your skin with antioxidants. A Vitamin C serum or our <strong>Hydrating Serum</strong> with Hyaluronic Acid will lock in moisture, fight off free radicals from environmental exposure, and keep your skin plump.</p>
      
      <h3>Step 4: Lock It in with Moisturizer</h3>
      <p>Apply a lightweight daily moisturizer to lock in all that hydration. Look for ingredients like Ceramides or Niacinamide that strengthen the skin barrier. Our <strong>Hybrid Face Cream</strong> provides excellent smart moisture balancing.</p>
      
      <h3>Step 5: Never Skip Sunscreen</h3>
      <p>The most crucial step of any morning routine is protection. UV rays accelerate aging and cause cellular damage. Apply a generous amount of broad-spectrum SPF 50 sunscreen like our <strong>Sunscreen Velora</strong> to finish your morning routine.</p>
    `
  },
  {
    id: 2,
    title: 'Understanding Ingredients: Encapsulated Retinol vs. Vitamin C',
    category: 'Ingredients',
    date: 'May 24, 2026',
    readTime: '6 min read',
    author: 'Dr. Rohan Mehta',
    summary: 'Confused about how to layer Retinol and Vitamin C? Learn the science behind these powerhouse ingredients and how to use them effectively.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    content: `
      <p>Vitamin C and Retinol are two of the most researched and proven active ingredients in modern dermatology. However, their potency means they must be handled correctly to avoid irritation. Here is everything you need to know.</p>
      
      <h3>Vitamin C: The Morning Protector</h3>
      <p>Vitamin C is a powerful antioxidant that neutralizes free radicals, brightens hyperpigmentation, and stimulates collagen synthesis. Because it protects against environmental damage (like pollution and UV rays), it is best used in your <strong>morning routine</strong> under sunscreen.</p>
      <p>Our <strong>Vitamin C Brightening Cream</strong> offers a stable formula that absorbs quickly without oxidized residue.</p>
      
      <h3>Retinol: The Nightly Restorer</h3>
      <p>Retinol is a derivative of Vitamin A that accelerates cell turnover, shedding dead skin cells to reveal fresh, youthful skin. It increases collagen production and reduces the appearance of fine lines, wrinkles, and acne. However, Retinol is sensitive to sunlight and can increase photosensitivity, meaning it should <strong>only be used at night</strong>.</p>
      <p>Our <strong>Velora Miraculous Retinol</strong> uses encapsulated technology to slowly release the active ingredient overnight, drastically reducing typical redness and peeling.</p>
      
      <h3>Can You Layer Them?</h3>
      <p>As a rule of thumb, avoid applying Vitamin C and Retinol at the same time. The acid levels required for Vitamin C can deactivate Retinol and cause severe dryness. Instead, split them: <strong>Vitamin C in the morning, and Retinol at night</strong>.</p>
    `
  },
  {
    id: 3,
    title: 'How to Restore a Damaged Skin Barrier',
    category: 'Skincare Science',
    date: 'April 12, 2026',
    readTime: '5 min read',
    author: 'Prachi Prajapati',
    summary: 'Redness, burning, and dryness are classic signs of a compromised skin barrier. Discover how to soothe and rebuild it naturally.',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    content: `
      <p>Your skin barrier (specifically the stratum corneum) is the outermost shield that keeps hydration in and irritants out. Over-exfoliating, using harsh chemicals, or climate changes can compromise this barrier, leading to breakouts, irritation, and flakiness.</p>
      
      <h3>Signs Your Barrier Is Compromised</h3>
      <ul>
        <li>Products sting or burn when applied</li>
        <li>Chronic redness and inflammation</li>
        <li>Flakiness despite using moisturizers</li>
        <li>Sudden breakouts and skin tightness</li>
      </ul>
      
      <h3>How to Heal It: The Clean Slate Protocol</h3>
      <p>If your barrier is damaged, you must strip your routine back to the absolute basics for 2-3 weeks:</p>
      
      <h4>1. Stop All Active Ingredients</h4>
      <p>Temporarily put away all retinols, AHAs/BHAs, Vitamin C, and exfoliating scrubs. Your skin needs a quiet environment to rebuild its lipid structures.</p>
      
      <h4>2. Cleanse with Lukewarm Water Only</h4>
      <p>Wash your face with lukewarm water, or use an extremely mild, sulfate-free cleanser only once a day. Avoid hot water, which melts skin lipids.</p>
      
      <h4>3. Look for Barrier Repairing Ingredients</h4>
      <p>Incorporate products containing Ceramides, Niacinamide, Squalane, and Hyaluronic Acid. Our <strong>Ampoule Velora Miraculous</strong> and <strong>Hybrid Face Cream</strong> are loaded with these barrier repair builders to soothe itching and lock in hydration.</p>
      
      <h4>4. Seal with a Rich Lipid Layer</h4>
      <p>Apply a thick barrier cream at night. This mimics your natural sebum, keeping moisture sealed inside the skin while cells repair themselves.</p>
    `
  }
];

const BlogPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page">
      <div className="blog-container">
        {selectedArticle ? (
          /* Detailed Article View */
          <div className="article-detail-view animate-fade">
            <button className="blog-back-btn" onClick={() => setSelectedArticle(null)}>
              <FiArrowLeft /> Back to Articles
            </button>
            
            <div className="article-header">
              <span className="article-category-badge">{selectedArticle.category}</span>
              <h1>{selectedArticle.title}</h1>
              
              <div className="article-meta">
                <span><FiUser /> By {selectedArticle.author}</span>
                <span><FiCalendar /> {selectedArticle.date}</span>
                <span><FiClock /> {selectedArticle.readTime}</span>
              </div>
            </div>

            <img src={selectedArticle.image} alt={selectedArticle.title} className="article-main-image" />

            <div 
              className="article-body-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            ></div>

            <button className="blog-footer-back-btn" onClick={() => setSelectedArticle(null)}>
              <FiArrowLeft /> Back to Articles
            </button>
          </div>
        ) : (
          /* Articles List */
          <div className="blog-index-view">
            <div className="blog-header-section">
              <h1>The Velora Journal</h1>
              <p>Expert guides, ingredient breakdowns, and skincare science to help you achieve your dream skin.</p>
            </div>

            <div className="articles-grid">
              {ARTICLES.map(article => (
                <div key={article.id} className="article-card">
                  <div className="article-img-box">
                    <img src={article.image} alt={article.title} />
                    <span className="article-card-badge">{article.category}</span>
                  </div>
                  
                  <div className="article-card-info">
                    <div className="article-card-meta">
                      <span>{article.date}</span>
                      <span className="dot">•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <button className="article-read-more-btn" onClick={() => handleReadArticle(article)}>
                      Read Article <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
