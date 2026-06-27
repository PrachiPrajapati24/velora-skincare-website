import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FiHeart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

// Import logo
import veloraLogo from '../assets/velora_logo.png';

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Mobile Hamburger Icon (Left of Logo or on the right - let's put it on the left/right logically) */}
      <div className="hamburger" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
      </div>

      <div className="logo" onClick={() => { navigate('/'); closeMobileMenu(); }}>
        <img src={veloraLogo} alt="Velora Skincare" className="logo-image" />
      </div>

      {/* Desktop Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-link' : '')}>Product</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink>
        </li>
        <li>
          <NavLink to="/sustainability" className={({ isActive }) => (isActive ? 'active-link' : '')}>Sustainability</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact Us</NavLink>
        </li>
        <li>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active-link' : '')}>Blog</NavLink>
        </li>
        <li>
          <NavLink to="/loyalty" className={({ isActive }) => (isActive ? 'active-link' : '')}>Rewards</NavLink>
        </li>
      </ul>

      {/* Navigation Icons (Cart, Wishlist, User Profile) */}
      <div className="nav-icons">
        <div className="icon-badge-container" onClick={() => navigate('/wishlist')}>
          <FiHeart size={26} className="nav-icon" />
          {wishlistItems.length > 0 && (
            <span className="badge">{wishlistItems.length}</span>
          )}
        </div>

        <div className="icon-badge-container" onClick={() => navigate('/cart')}>
          <MdOutlineShoppingBag size={26} className="nav-icon" />
          {cartCount > 0 && (
            <span className="badge">{cartCount}</span>
          )}
        </div>

        <div className="user-menu-container">
          {isAuthenticated ? (
            <div className="user-profile-trigger" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <div className="user-avatar-initials">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
              
              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                    {user?.points !== undefined && (
                      <span className="user-points">{user.points} Points</span>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}>
                    <FiUser size={16} /> Profile & Orders
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FiLogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <FiUser size={26} className="nav-icon" onClick={() => navigate('/profile')} />
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="logo">
            <img src={veloraLogo} alt="Velora Skincare" className="logo-image" />
          </div>
          <FiX size={26} className="drawer-close" onClick={closeMobileMenu} />
        </div>
        <ul className="drawer-links">
          <li>
            <NavLink to="/products" onClick={closeMobileMenu}>Product</NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMobileMenu}>About Us</NavLink>
          </li>
          <li>
            <NavLink to="/sustainability" onClick={closeMobileMenu}>Sustainability</NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={closeMobileMenu}>Contact Us</NavLink>
          </li>
          <li>
            <NavLink to="/blog" onClick={closeMobileMenu}>Blog</NavLink>
          </li>
          <li>
            <NavLink to="/loyalty" onClick={closeMobileMenu}>Rewards</NavLink>
          </li>
        </ul>
        <div className="drawer-footer">
          {isAuthenticated ? (
            <div className="drawer-user-info">
              <p>Logged in as: <strong>{user?.name}</strong></p>
              <div className="drawer-auth-buttons">
                <button className="drawer-btn" onClick={() => { navigate('/profile'); closeMobileMenu(); }}>My Profile</button>
                <button className="drawer-btn logout" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="drawer-btn login" onClick={() => { navigate('/profile'); closeMobileMenu(); }}>Sign In / Sign Up</button>
          )}
        </div>
      </div>
      
      {/* Background overlay for mobile drawer */}
      {mobileMenuOpen && <div className="drawer-overlay" onClick={closeMobileMenu}></div>}
    </nav>
  );
}

export default Navbar;
