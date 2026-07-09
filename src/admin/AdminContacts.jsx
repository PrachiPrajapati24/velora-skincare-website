import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from './AdminContext';

const AdminContacts = () => {
  const { API } = useAdmin();
  const [contacts, setContacts]     = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState(null);
  const [updating, setUpdating]     = useState(null);   // contact ID being updated
  const [toast, setToast]           = useState(null);   // { type: 'success'|'error', msg }

  const fetchContacts = useCallback(async () => {
    try {
      const res = await API.get('/contacts');
      if (res.data.success) setContacts(res.data.contacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkReplied = async (e, contactId) => {
    e.stopPropagation();
    setUpdating(contactId);
    try {
      const res = await API.put(`/contacts/${contactId}/reply`);
      if (res.data.success) {
        setContacts(prev => prev.map(c => c._id === contactId ? { ...c, replied: true } : c));
        showToast('success', `✅ Marked message as replied!`);
      }
    } catch (err) {
      showToast('error', `❌ Failed to update message status.`);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading contact messages...</span>
      </div>
    );
  }

  return (
    <div className="ad-contacts-page">
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
          padding: '14px 22px', borderRadius: '12px', fontWeight: '600',
          fontSize: '0.88rem', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          background: toast.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: toast.type === 'success' ? '#065f46' : '#991b1b',
          border: `1.5px solid ${toast.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
          transition: 'opacity 0.3s',
        }}>
          {toast.msg}
        </div>
      )}

      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Contact Messages ({filtered.length})</h1>
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '10px',
            border: '1.5px solid var(--border)', width: '280px',
            outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ad-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</div>
          <p>No contact messages found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((c, i) => (
            <div
              key={c._id}
              className="ad-card"
              style={{
                padding: '0', overflow: 'hidden', cursor: 'pointer',
                border: expanded === c._id ? '1.5px solid var(--green-mid)' : '1.5px solid var(--border)',
                transition: 'border 0.2s, box-shadow 0.2s',
                animation: `fadeInDown 0.3s ease ${i * 0.04}s both`,
              }}
              onClick={() => setExpanded(expanded === c._id ? null : c._id)}
            >
              {/* Header row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                background: expanded === c._id ? 'var(--green-light, #f0fff4)' : 'transparent',
                transition: 'background 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: c.replied ? '#94a3b8' : 'linear-gradient(135deg, #56876D, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '1rem',
                    flexShrink: 0, transition: 'background 0.3s',
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {c.email} {c.phone && `· ${c.phone}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  {c.replied && (
                    <span className="ad-badge ad-badge--green" style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px' }}>
                      ✓ Replied
                    </span>
                  )}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                      {c.subject}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: expanded === c._id ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Expanded message */}
              {expanded === c._id && (
                <div style={{
                  padding: '16px 20px 20px 74px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--card-bg)',
                }}>
                  {/* Original message */}
                  <div style={{
                    fontWeight: '600', fontSize: '0.78rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px',
                  }}>
                    Message
                  </div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                    {c.message}
                  </p>

                  {/* Mark as Replied button */}
                  {!c.replied && (
                    <button
                      onClick={(e) => handleMarkReplied(e, c._id)}
                      disabled={updating === c._id}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '8px 20px', borderRadius: '8px',
                        background: 'var(--green-dark, #276749)',
                        color: '#fff',
                        border: 'none', fontSize: '0.82rem', fontWeight: '600',
                        fontFamily: 'var(--font-body)', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {updating === c._id ? 'Updating...' : '✓ Mark as Replied'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
