import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const StarRating = ({ rating }) => (
  <div style={{ color: '#d97706', display: 'flex', gap: '3px', fontSize: '1.05rem' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ opacity: i < rating ? 1 : 0.25 }}>★</span>
    ))}
  </div>
);

const AdminReviews = () => {
  const { API } = useAdmin();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reviews');
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await API.delete(`/reviews/${id}`);
      if (res.data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        showToast('Review deleted successfully');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review', 'error');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filtered = reviews.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.review.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="ad-reviews-page">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#56876D' : '#e53e3e',
          color: '#fff', padding: '12px 20px', borderRadius: '10px',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '16px', padding: '32px',
            maxWidth: '400px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '8px', color: 'var(--text-dark)' }}>
              Delete Review?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              This review will be permanently deleted from the database and will no longer show up on the testimonials carousel.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#e53e3e', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', opacity: deletingId === confirmId ? 0.7 : 1 }}>
                {deletingId === confirmId ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Customer Reviews ({filtered.length})</h1>
        <input
          type="text"
          placeholder="Search by customer name, review text..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '10px',
            border: '1.5px solid var(--border)', width: '320px',
            outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ad-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⭐</div>
          <p>No reviews found matching your search filter.</p>
        </div>
      ) : (
        <div className="ad-card ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Message</th>
                <th>Order ID</th>
                <th>Date Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{r.userName}</div>
                    <span className="ad-badge ad-badge--green" style={{ fontSize: '0.68rem', padding: '2px 6px', marginTop: '4px' }}>
                      Verified Customer
                    </span>
                  </td>
                  <td>
                    <StarRating rating={r.rating} />
                  </td>
                  <td>
                    <div style={{ maxWidth: '400px', lineHeight: '1.5', fontSize: '0.86rem', color: 'var(--text-dark)' }}>
                      "{r.review}"
                    </div>
                  </td>
                  <td>
                    {r.orderId ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        #{r.orderId.substring(18)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        None (Public)
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => setConfirmId(r._id)}
                      style={{
                        background: '#fff0f0', color: '#e53e3e',
                        border: '1.5px solid #fed7d7', borderRadius: '8px',
                        padding: '6px 14px', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                        fontWeight: '600', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#e53e3e'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = '#fff0f0'; e.target.style.color = '#e53e3e'; }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
