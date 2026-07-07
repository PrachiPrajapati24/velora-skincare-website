import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReviewSection.css";

const FALLBACK_REVIEWS = [
  {
    _id: "static-1",
    userName: "Priya Sharma",
    rating: 4.9,
    review:
      "Velora completely transformed my skin! Within a few weeks, my skin felt smoother, brighter and healthier",
    isVerified: true,
  },
  {
    _id: "static-2",
    userName: "Ananya Patel",
    rating: 5.0,
    review:
      "I've been using Velora for three months now and the results are amazing. The hybrid collection is perfect for my combination skin",
    isVerified: true,
  },
  {
    _id: "static-3",
    userName: "Neha Kapoor",
    rating: 4.8,
    review:
      "The body care range is absolutely luxurious! It feels like a spa treatment at home. My skin is so soft and nourished",
    isVerified: true,
  },
  {
    _id: "static-4",
    userName: "Riya Deshmukh",
    rating: 5.0,
    review:
      "Velora's makeup line is a game-changer! It's so lightweight and breathable, yet provides excellent coverage",
    isVerified: true,
  },
  {
    _id: "static-5",
    userName: "Sanya Mehta",
    rating: 4.9,
    review:
      "I love how Velora focuses on natural ingredients. No harsh chemicals, just pure goodness. My sensitive skin has never been happier",
    isVerified: true,
  },
  {
    _id: "static-6",
    userName: "Kavya Iyer",
    rating: 5.0,
    review:
      "The premium quality is evident in every product. Velora has become an essential part of my daily skincare routine",
    isVerified: true,
  },
];

const ReviewSection = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef(null);

  // Fetch live reviews from DB; keep fallbacks if none found
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
          setCurrentIndex(0);
        }
      } catch (_) {
        // silently keep fallback
      }
    };
    fetchReviews();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
    setAnimationKey((prev) => prev + 1);
  }, [reviews.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
    setAnimationKey((prev) => prev + 1);
  }, [reviews.length]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleNext]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const currentReview = reviews[currentIndex];
  if (!currentReview) return null;

  // Support both DB reviews (userName) and static reviews (name)
  const authorName = currentReview.userName || currentReview.name || "Velora Customer";
  const ratingNum = typeof currentReview.rating === "number"
    ? currentReview.rating
    : parseFloat(currentReview.rating) || 5;

  return (
    <section className="velora-review-section">
      <div className="review-container">
        <div className="review-header">
          <span className="review-label">TESTIMONIALS</span>
        </div>

        <div
          className="review-content-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="nav-arrow nav-arrow-left"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <span>← PREV</span>
          </button>

          <div className="testimonial-main" key={animationKey}>
            <div className="testimonial-text animate-slide-up">
              <span className="quote-mark">"</span>
              {currentReview.review}
              <span className="quote-mark">"</span>
            </div>

            <div className="testimonial-author animate-fade-in">
              <div className="author-name-section">
                <h3 className="author-name">{authorName.toUpperCase()}</h3>
                <p className="author-verified">
                  {currentReview.isVerified ? "✓ Verified Customer" : "Velora Customer"}
                </p>
              </div>
              <div className="rating-badge">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="star-icon"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="rating-number">{ratingNum.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <button
            className="nav-arrow nav-arrow-right"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <span>NEXT →</span>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="review-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`review-dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => { setCurrentIndex(i); setAnimationKey(k => k + 1); }}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
