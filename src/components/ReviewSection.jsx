import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReviewSection.css";

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    rating: 4.9,
    review:
      "Velora completely transformed my skin! Within a few weeks, my skin felt smoother, brighter and healthier",
  },
  {
    id: 2,
    name: "Ananya Patel",
    email: "ananya@gmail.com",
    rating: 5.0,
    review:
      "I've been using Velora for three months now and the results are amazing. The hybrid collection is perfect for my combination skin",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    email: "neha@gmail.com",
    rating: 4.8,
    review:
      "The body care range is absolutely luxurious! It feels like a spa treatment at home. My skin is so soft and nourished",
  },
  {
    id: 4,
    name: "Riya Deshmukh",
    email: "riya@gmail.com",
    rating: 5.0,
    review:
      "Velora's makeup line is a game-changer! It's so lightweight and breathable, yet provides excellent coverage",
  },
  {
    id: 5,
    name: "Sanya Mehta",
    email: "sanya@gmail.com",
    rating: 4.9,
    review:
      "I love how Velora focuses on natural ingredients. No harsh chemicals, just pure goodness. My sensitive skin has never been happier",
  },
  {
    id: 6,
    name: "Kavya Iyer",
    email: "kavya@gmail.com",
    rating: 5.0,
    review:
      "The premium quality is evident in every product. Velora has become an essential part of my daily skincare routine",
  },
];

const ReviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === REVIEWS.length - 1 ? 0 : prevIndex + 1
    );
    setAnimationKey((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? REVIEWS.length - 1 : prevIndex - 1
    );
    setAnimationKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, handleNext]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const currentReview = REVIEWS[currentIndex];

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
                <h3 className="author-name">{currentReview.name.toUpperCase()}</h3>
                <p className="author-verified">Verified Customer</p>
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
                <span className="rating-number">{currentReview.rating}</span>
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
      </div>
    </section>
  );
};

export default ReviewSection;
