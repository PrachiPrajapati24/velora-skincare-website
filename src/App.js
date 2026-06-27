import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Home Page Components
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import SkincareHeroSection from './components/SkincareHeroSection';
import ReviewSection from './components/ReviewSection';

// Pages
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AboutPage from './components/AboutPage';
import SustainabilityPage from './components/SustainabilityPage';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import AuthPage from './components/AuthPage';
import ContactUs from './components/ContactUs';
import ProfilePage from './components/ProfilePage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import BlogPage from './components/BlogPage';
import LoyaltyPage from './components/LoyaltyPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import NotFoundPage from './components/NotFoundPage';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Home Page Component (assembly of home sections)
function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductSection />
      <SkincareHeroSection />
      <ReviewSection />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
            <ScrollToTop />
            <Navbar />
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Products */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />

              {/* Auth — /profile shows AuthPage if logged out, ProfilePage if logged in */}
              <Route path="/profile" element={<ProfileOrAuthPage />} />

              {/* Shopping Flow */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

              {/* Brand Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />

              {/* Legal */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// Smart component that renders ProfilePage for logged-in users, AuthPage for guests
function ProfileOrAuthPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        minHeight: '60vh', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#888' 
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <ProfilePage /> : <AuthPage />;
}

export default App;
