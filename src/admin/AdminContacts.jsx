import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const AdminContacts = () => {
  const { API } = useAdmin();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get('/contacts');
        if (res.data.success) setContacts(res.data.contacts);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [API]);

  const handleReplyClick = async (id) => {
    try {
      const res = await API.put(`/contacts/${id}/reply`);
      if (res.data.success) {
        setContacts(prev =>
          prev.map(c => c._id === id ? { ...c, replied: true } : c)
        );
      }
    } catch (err) {
      console.error('Error marking as replied:', err);
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
                    flexShrink: 0,
                    transition: 'background 0.3s',
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
                  fontSize: '0.9rem', color: 'var(--text-dark)',
                  lineHeight: '1.6',
                }}>
                  <div style={{
                    fontWeight: '600', fontSize: '0.78rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px',
                  }}>
                    Message
                  </div>
                  <p style={{ margin: 0 }}>{c.message}</p>
                  <a
                    href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplyClick(c._id);
                    }}
                    style={{
                      display: 'inline-block', marginTop: '14px',
                      padding: '8px 20px', borderRadius: '8px',
                      background: c.replied ? '#e2e8f0' : 'var(--green-dark, #276749)',
                      color: c.replied ? '#475569' : '#fff',
                      border: c.replied ? '1.5px solid #cbd5e1' : 'none',
                      textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {c.replied ? '✓ Replied (Click to Email Again)' : '✉️ Reply via Email'}
                  </a>
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
