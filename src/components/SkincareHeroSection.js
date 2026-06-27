import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SkincareHeroSection.css";

import skincareImg from "../assets/skincare1.jpg";
import bodycareImg from "../assets/bodycare.jpg";
import hybridImg from "../assets/hybrid.jpg";
import makeupImg from "../assets/makeup.jpg";

const TAB_DATA = [
  {
    label: "01 SKIN CARE",
    heading: "Velora\nSkincare",
    subtitle: "PREMIUM PRODUCTS",
    desc:
      "Velora skincare is here to provide optimal skincare with high-quality natural ingredients. Each product is designed to treat, moisturise and refresh your skin, leaving it healthier and more radiant.",
    img: skincareImg,
  },
  {
    label: "02 BODY CARE",
    heading: "Velora\nBodycare",
    subtitle: "NATURAL BODY CARE",
    desc:
      "Experience luxurious and nourishing body care with Velora. Our formulations protect, soften, and rejuvenate your skin, restoring your body's natural glow.",
    img: bodycareImg,
  },
  {
    label: "03 HYBRID",
    heading: "Velora\nHybrid",
    subtitle: "SMART HYBRID CARE",
    desc:
      "Hybrid solutions merging science and botanicals for truly innovative skin care. Discover transformative results and actionable, next-generation treatments.",
    img: hybridImg,
  },
  {
    label: "04 MAKE UP",
    heading: "Velora\nMake Up",
    subtitle: "SKIN-FIRST MAKE UP",
    desc:
      "Radiant, breathable make up that enhances your beauty and supports skin health. Longwearing, clean ingredients, always.",
    img: makeupImg,
  },
];

const SkincareHeroSection = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const tab = TAB_DATA[tabIndex];

  // Trigger animation when tab changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [tabIndex]);

  const handleTabChange = (index) => {
    if (index !== tabIndex) {
      setTabIndex(index);
    }
  };

  return (
    <section className="anzana-skin-hero">
      <div className="anzana-skin-left">
        <nav className="anzana-skin-menu">
          {TAB_DATA.map((t, i) => (
            <span
              className={tabIndex === i ? "active" : ""}
              key={t.label}
              onClick={() => handleTabChange(i)}
              style={{ cursor: "pointer" }}
            >
              {t.label}
            </span>
          ))}
        </nav>

        <div className="content-wrapper" key={animationKey}>
          <div className="anzana-skin-label animate-slide-left">
            {tab.subtitle}
          </div>
          
          <h1 className="anzana-skin-title animate-slide-left-delay-1">
            {tab.heading.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          
          <div 
            className="anzana-skin-link-row animate-slide-left-delay-2"
            onClick={() => navigate('/products')}
            style={{ cursor: 'pointer' }}
          >
            <span className="chevron">{"{"}</span>
            <span className="anzana-skin-link">View all products</span>
            <span className="chevron">{"}"}</span>
          </div>
          
          <p className="anzana-skin-desc animate-slide-left-delay-3">
            {tab.desc}
          </p>
        </div>
      </div>

      <div className="anzana-skin-right">
        <div className="custom-scallop-frame" key={`img-${animationKey}`}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 520 520"
            className="custom-scallop-svg animate-scale-in"
            style={{ background: "transparent" }}
          >
            <defs>
              <clipPath id="scallopSquare" clipPathUnits="objectBoundingBox">
                <path
                  d="
                    M0.12,0
                    Q0,0,0,0.12
                    L0,0.88
                    Q0,1,0.12,1
                    L0.88,1
                    Q1,1,1,0.88
                    L1,0.12
                    Q1,0,0.88,0
                    Z
                  "
                />
              </clipPath>
            </defs>
            <image
              href={tab.img}
              width="520"
              height="520"
              style={{ clipPath: "url(#scallopSquare)" }}
              alt="Scallop Frame"
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SkincareHeroSection;
