import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import AdminOverview from './AdminOverview';
import AdminCharts from './AdminCharts';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminActivity from './AdminActivity';
import AdminContacts from './AdminContacts';
import AdminProducts from './AdminProducts';
import AdminReviews from './AdminReviews';
import './AdminDashboard.css';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Overview',   icon: '📊', end: true },
  { to: '/admin/charts',    label: 'Analytics',  icon: '📈' },
  { to: '/admin/users',     label: 'Users',      icon: '👥' },
  { to: '/admin/orders',    label: 'Orders',     icon: '🛒' },
  { to: '/admin/products',  label: 'Products',   icon: '🧴' },
  { to: '/admin/contacts',  label: 'Contacts',   icon: '✉️' },
  { to: '/admin/reviews',   label: 'Reviews',    icon: '⭐' },
  { to: '/admin/activity',  label: 'Activity',   icon: '⚡' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdminAuthenticated, adminUser, logout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNow, setActiveNow] = useState(0);

  useEffect(() => {
    if (!isAdminAuthenticated) navigate('/admin/login');
  }, [isAdminAuthenticated, navigate]);

  // Poll real-time visitors every 30s
  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/realtime', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setActiveNow(data.activeNow);
      } catch (_) {}
    };
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAdminAuthenticated) return null;

  return (
    <div className={`ad-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-header">
          <div className="ad-brand">
            <div className="ad-brand-mark">V</div>
            {sidebarOpen && (
              <div>
                <span className="ad-brand-name">Velora</span>
                <span className="ad-brand-sub">Admin Panel</span>
              </div>
            )}
          </div>
          <button className="ad-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Live indicator */}
        {sidebarOpen && (
          <div className="ad-live-badge">
            <span className="ad-live-dot" />
            {activeNow} active now
          </div>
        )}

        <nav className="ad-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `ad-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="ad-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          {sidebarOpen && (
            <div className="ad-admin-info">
              <div className="ad-avatar">{adminUser?.name?.[0] || 'A'}</div>
              <div>
                <p className="ad-admin-name">{adminUser?.name}</p>
                <p className="ad-admin-role">Super Admin</p>
              </div>
            </div>
          )}
          <button className="ad-logout-btn" onClick={handleLogout} title="Logout">
            🚪 {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="ad-main">
        {/* Topbar */}
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button className="ad-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h2 className="ad-page-title">Dashboard</h2>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-live-pill">
              <span className="ad-live-dot" />
              <span>{activeNow} online</span>
            </div>
            <div className="ad-topbar-avatar">
              {adminUser?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page routes */}
        <div className="ad-content">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="charts" element={<AdminCharts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="activity" element={<AdminActivity />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
