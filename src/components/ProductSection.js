import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import Toast from "./Toast";
import "./ProductSection.css";

// Fallback images in case API images fail or to use local images
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";
import product5 from "../assets/skincare1.jpg";

const LOCAL_IMAGES = {
  "Velora Miraculous Retinol": product1,
  "Toner Velora Perfect Hydrating": product2,
  "Ampoule Velora Miraculous": product3,
  "Sunscreen Velora": product4,
  "Gentle Cleanser": product5
};

const ProductSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch featured products from DB on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          // Filter to get the 5 featured products
          const names = [
            "Velora Miraculous Retinol",
            "Toner Velora Perfect Hydrating",
            "Ampoule Velora Miraculous",
            "Sunscreen Velora",
            "Gentle Cleanser"
          ];
          const filtered = res.data.products.filter(p => names.includes(p.name));
          
          // Re-order to match the original design sequence
          const ordered = names.map(name => filtered.find(p => p.name === name)).filter(Boolean);
          
          if (ordered.length > 0) {
            setFeaturedProducts(ordered);
          } else {
            // Fallback if seeded list doesn't match
            setFeaturedProducts(res.data.products.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setPopup(null); // Close modal after adding
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const getProductImage = (product) => {
    // If it's a seeded product and we have local image fallback, use it
    if (LOCAL_IMAGES[product.name]) {
      return LOCAL_IMAGES[product.name];
    }
    return product.image || "https://via.placeholder.com/340x380";
  };

  const handleCardClick = (product) => {
    setPopup(product);
  };

  const handleViewDetails = (product, e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  if (loading) {
    return (
      <section className="product-list-section">
        <h2 className="product-list-title">Realise your dream skin with Velora</h2>
        <p className="product-list-subtitle">Skincare for Every Skin Type</p>
        <div className="product-list-grid">
          {[1, 2, 3, 4, 5].map(idx => (
            <div className="product-card skeleton-card" key={idx}>
              <div className="skeleton-img"></div>
              <div className="skeleton-text title"></div>
              <div className="skeleton-text price"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="product-list-section">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      <h2 className="product-list-title">Realise your dream skin with Velora</h2>
      <p className="product-list-subtitle">Skincare for Every Skin Type</p>
      <div className="product-list-grid">
        {featuredProducts.map((prod, index) => {
          // Keep Toner Velora (index 1 in the ordered list) as scalloped for the exact original design look
          const isScalloped = index === 1;
          const imageSrc = getProductImage(prod);
          
          return (
            <div
              className={`product-card ${isScalloped ? "scalloped" : ""}`}
              key={prod._id || prod.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="product-card-imgbox"
                onClick={() => handleCardClick(prod)}
                style={{ cursor: "pointer" }}
              >
                {isScalloped ? (
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 340 380"
                    className="scalloped-svg"
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                  >
                    <defs>
                      <clipPath id={`scalloped${prod._id || prod.id}`}>
                        <path
                          d="M20,0 h300q20,0,20,20v320q0,20-20,20h-300q-20,0-20-20v-320q0-20,20-20 Z
                             M60,0 a20,20 0 0 1 20,20 Z
                             M320,20 a20,20 0 0 1 -20,-20 Z
                             M20,360 a20,20 0 0 1 20,20 Z
                             M320,360 a20,20 0 0 1 -20,20 Z"
                          fill="white"
                        />
                      </clipPath>
                    </defs>
                    <image
                      href={imageSrc}
                      width="340"
                      height="380"
                      style={{
                        clipPath: `url(#scalloped${prod._id || prod.id})`,
                      }}
                    />
                  </svg>
                ) : (
                  <img src={imageSrc} alt={prod.name} className="product-card-img" />
                )}
              </div>
              <div className="product-card-info">
                <div className="product-card-title">{prod.name}</div>
                <div className="product-card-rating">
                  <span>★</span> {prod.rating}
                </div>
                {prod.price && (
                  <div
                    className="product-card-price"
                    onClick={() => handleCardClick(prod)}
                    style={{ cursor: "pointer" }}
                  >
                    ₹{prod.price}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup */}
      {popup && (
        <div className="product-popup-backdrop" onClick={() => setPopup(null)}>
          <div className="product-popup" onClick={e => e.stopPropagation()}>
            <img src={getProductImage(popup)} alt={popup.name} />
            <h3>{popup.name}</h3>
            <p className="product-popup-subtitle">{popup.subtitle}</p>
            <p style={{ margin: "8px 0" }}>
              <span style={{ color: "#56876D" }}>★</span> {popup.rating}
            </p>
            <p className="product-popup-price">₹{popup.price}</p>
            <div className="product-popup-actions">
              <button className="popup-btn-add" onClick={(e) => handleAddToCart(popup, e)}>Add to Cart</button>
              <button className="popup-btn-view" onClick={(e) => handleViewDetails(popup, e)}>View Details</button>
              <button className="popup-btn-close" onClick={() => setPopup(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
