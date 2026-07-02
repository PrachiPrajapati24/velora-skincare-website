import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const AdminOrders = () => {
  const { API } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [API]);

  const filteredOrders = orders.filter(order =>
    (order.user?.name && order.user.name.toLowerCase().includes(search.toLowerCase())) ||
    order._id.includes(search) ||
    order.shippingAddress?.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading store orders...</span>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing': return 'ad-badge--orange';
      case 'shipped': return 'ad-badge--purple';
      case 'delivered': return 'ad-badge--green';
      case 'cancelled': return 'ad-badge--red';
      default: return 'ad-badge--gray';
    }
  };

  return (
    <div className="ad-orders-page">
      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Store Orders ({filteredOrders.length})</h1>
        <div className="ad-search-bar">
          <input
            type="text"
            placeholder="Search by order ID, customer, city..."
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{order._id.substring(18)}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{order.user?.name || 'Guest User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.orderItems.map(item => `${item.name} (x${item.quantity})`).join(', ')}>
                      {order.orderItems.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td style={{ fontWeight: '600' }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`ad-badge ${order.isPaid ? 'ad-badge--green' : 'ad-badge--red'}`}>
                      {order.isPaid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`ad-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
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
