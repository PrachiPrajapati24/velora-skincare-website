import React, { useState } from 'react';
import './ReviewModal.css';

const StarRating = ({ rating, setRating, readonly = false }) => (
  <div className="rm-stars" style={{ pointerEvents: readonly ? 'none' : 'auto' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`rm-star ${star <= rating ? 'filled' : ''}`}
        onClick={() => !readonly && setRating(star)}
        onMouseEnter={e => { if (!readonly) e.target.style.transform = 'scale(1.2)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewModal = ({ orderId, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      setError('Please write a short review.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('velora_token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, rating, review }),
      });

      let data = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (res.ok && data && data.success) {
        setSuccess(true);
        if (onSubmitted) onSubmitted(data.review);
        setTimeout(() => onClose(), 2500);
      } else {
        setError(data?.message || `Server error: ${res.status}`);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rm-modal">
        <button className="rm-close" onClick={onClose} aria-label="Close">✕</button>

        {success ? (
          <div className="rm-success">
            <div className="rm-success-icon">🌿</div>
            <h3>Thank you for your review!</h3>
            <p>Your testimonial has been shared with the Velora community.</p>
          </div>
        ) : (
          <>
            <div className="rm-header">
              <div className="rm-leaf">🌿</div>
              <h2 className="rm-title">Share Your Experience</h2>
              <p className="rm-subtitle">How was your Velora skincare experience?</p>
            </div>

            <form onSubmit={handleSubmit} className="rm-form">
              <div className="rm-rating-section">
                <label className="rm-label">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />
                <span className="rm-rating-text">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                </span>
              </div>

              <div className="rm-field">
                <label className="rm-label">Your Review</label>
                <textarea
                  className="rm-textarea"
                  placeholder="Tell us what you loved about your order..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <span className="rm-charcount">{review.length}/500</span>
              </div>

              {error && <div className="rm-error">❌ {error}</div>}

              <div className="rm-actions">
                <button type="button" className="rm-skip-btn" onClick={onClose}>
                  Skip for now
                </button>
                <button type="submit" className="rm-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : '✓ Submit Review'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
