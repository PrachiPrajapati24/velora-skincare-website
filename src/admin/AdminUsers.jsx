import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const AdminUsers = () => {
  const { API } = useAdmin();
  const [users, setUsers] = useState([]);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await API.delete(`/users/${id}`);
      if (res.data.success) {
        setUsers(prev => prev.filter(u => u._id !== id));
        showToast('User deleted successfully');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.phone && user.phone.includes(search))
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading registered users...</span>
      </div>
    );
  }

  return (
    <div className="ad-users-page">
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#56876D' : '#e53e3e',
          color: '#fff', padding: '12px 20px', borderRadius: '10px',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'fadeInDown 0.3s ease',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
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
              Delete User?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmId(null)}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: '1.5px solid var(--border)',
                  background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  color: 'var(--text-muted)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none',
                  background: '#e53e3e', color: '#fff', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: '600',
                  opacity: deletingId === confirmId ? 0.7 : 1,
                }}
              >
                {deletingId === confirmId ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Registered Users ({filteredUsers.length})</h1>
        <div className="ad-search-bar" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              width: '280px',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      <div className="ad-card ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Velora Points</th>
              <th>Joined Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`ad-badge ${user.role === 'admin' ? 'ad-badge--green' : 'ad-badge--gray'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--green-dark)' }}>
                    🌟 {user.points ?? 0}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <button
                      onClick={() => setConfirmId(user._id)}
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
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No users matched your search filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
