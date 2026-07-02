import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import './AdminOverview.css';

const AdminOverview = () => {
  const { API } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        setError('Failed to load overview statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API]);

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading stats overview...</span>
      </div>
    );
  }

  if (error) {
    return <div className="ad-error-banner">{error}</div>;
  }

  return (
    <div className="ad-overview">
      <div className="ad-welcome-card ad-card">
        <div className="ad-welcome-text">
          <h1>Welcome Back, Prachi Prajapati!</h1>
          <p>Here is what's happening with Velora Skincare today.</p>
        </div>
        <div className="ad-welcome-badge">Super Admin</div>
      </div>

      <div className="ad-stats-grid">
        {/* Card 1 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper user-icon">👥</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Total Users</span>
            <h3 className="ad-stat-value">{stats?.totalUsers ?? 0}</h3>
            <span className="ad-stat-trend positive">+{stats?.newUsersThisWeek ?? 0} this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper order-icon">🛒</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Total Orders</span>
            <h3 className="ad-stat-value">{stats?.totalOrders ?? 0}</h3>
            <span className="ad-stat-trend neutral">Manage orders list</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper revenue-icon">₹</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Total Revenue</span>
            <h3 className="ad-stat-value">₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}</h3>
            <span className="ad-stat-trend positive">From processed orders</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper product-icon">🧴</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Total Products</span>
            <h3 className="ad-stat-value">{stats?.totalProducts ?? 0}</h3>
            <span className="ad-stat-trend neutral">Seeded active catalog</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper visit-icon">🌐</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Today's Visitors</span>
            <h3 className="ad-stat-value">{stats?.todayVisitors ?? 0}</h3>
            <span className="ad-stat-trend positive">Realtime tracked hits</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper traffic-icon">📈</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Monthly Visitors</span>
            <h3 className="ad-stat-value">{stats?.monthlyVisitors ?? 0}</h3>
            <span className="ad-stat-trend neutral">Current calendar month</span>
          </div>
        </div>

        {/* Card 7 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper bounce-icon">📉</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Bounce Rate</span>
            <h3 className="ad-stat-value">{stats?.bounceRate ?? '0%'}</h3>
            <span className="ad-stat-trend negative">Avg session dropouts</span>
          </div>
        </div>

        {/* Card 8 */}
        <div className="ad-stat-card ad-card">
          <div className="ad-stat-icon-wrapper newsletter-icon">📧</div>
          <div className="ad-stat-info">
            <span className="ad-stat-label">Newsletter Subscriptions</span>
            <h3 className="ad-stat-value">{stats?.totalNewsletters ?? 0}</h3>
            <span className="ad-stat-trend positive">Subscribed emails</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
