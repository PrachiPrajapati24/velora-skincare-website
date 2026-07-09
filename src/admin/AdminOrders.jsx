import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const STATUS_OPTIONS = ['processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  processing: { bg: '#fff7ed', color: '#c05621', border: '#fbd38d' },
  shipped: { bg: '#faf5ff', color: '#6b46c1', border: '#d6bcfa' },
  delivered: { bg: '#f0fff4', color: '#276749', border: '#9ae6b4' },
  cancelled: { bg: '#fff5f5', color: '#c53030', border: '#fed7d7' },
};

const AdminOrders = () => {
  const { API } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status: newStatus, isPaid: res.data.order.isPaid } : o)
        );
        showToast(`Order status updated to "${newStatus}"`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order =>
    (order.user?.name && order.user.name.toLowerCase().includes(search.toLowerCase())) ||
    order._id.includes(search) ||
    order.shippingAddress?.city.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading store orders...</span>
      </div>
    );
  }

  return (
    <div className="ad-orders-page">
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

      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Store Orders ({filteredOrders.length})</h1>
        <div className="ad-search-bar">
          <input
            type="text"
            placeholder="Search by order ID, customer, city, status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 16px', borderRadius: '10px',
              border: '1.5px solid var(--border)', width: '300px',
              outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      <div className="ad-card ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Delivery Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.processing;
                return (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                      #{order._id.substring(18)}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.user?.name || 'Guest User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <div
                        style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={order.orderItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      >
                        {order.orderItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`ad-badge ${order.isPaid ? 'ad-badge--green' : 'ad-badge--red'}`}>
                        {order.isPaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: sc.bg, color: sc.color,
                        border: `1.5px solid ${sc.border}`,
                        borderRadius: '20px', padding: '4px 12px',
                        fontSize: '0.78rem', fontWeight: '700',
                        textTransform: 'capitalize', display: 'inline-block',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '7px 10px', borderRadius: '8px',
                          border: '1.5px solid var(--border)',
                          fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                          cursor: 'pointer', outline: 'none',
                          background: updatingId === order._id ? '#f7f7f7' : 'white',
                          minWidth: '130px',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Saving...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No orders matched your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
