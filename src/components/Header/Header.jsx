import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../common/Button/Button";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // This ensures the menu closes whenever the route changes
    setIsMenuOpen(false);
  }, [location]);

  // ⭐ SCROLL FIX LOGIC: Mobile Menu திறக்கும்போது background scroll ஆவதை தடுக்கும்
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("scrollToContact");
      if (flag && document.getElementById("contact")) {
        document
          .getElementById("contact")
          .scrollIntoView({ behavior: "smooth", block: "start" });
        sessionStorage.removeItem("scrollToContact");
      }
    } catch {}
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/ventures", label: "Ventures" },
    { path: "/gallery", label: "Gallery" },
  ];

  const scrollToContactOnPage = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  };

  const handleContactClick = () => {
    if (location.pathname === "/") {
      scrollToContactOnPage();
    } else {
      try {
        sessionStorage.setItem("scrollToContact", "1");
      } catch {}
      navigate("/#contact");
    }
    // Close menu when button is clicked (relevant for mobile CTA)
    setIsMenuOpen(false); 
  };

  const handleNavHover = (i) => setActiveIndex(i);
  const handleNavLeave = () => setActiveIndex(-1);

  return (
    <header
      className={`header ${isScrolled ? "header-scrolled" : ""} ${
        isHovered ? "header-hovered" : ""
      } ${isMenuOpen ? "header-menu-open" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-background">
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      <div className="header-content">
        <Link to="/" className="logo" aria-label="Go to homepage">
          <div className="logo-container">
            <img
              src="/images/multi.png"
              alt="Universal MultiTrading Inc"
              className="logo-image"
            />
          </div>

          <div className="logo-text">
            <span className="logo-main" style={{ color: "orange" }}>
              Universal <span>Ventures</span>
            </span>
            {/* <span className="logo-sub" style={{ color: "green" }}>
              Universal Group
            </span> */}
          </div>
        </Link>

        {/* NAV: Added mobile CTA and link click handler */}
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          
          {/* Navigation Items */}
          {navItems.map((item, index) => (
            <div
              key={item.path}
              className="nav-item-wrapper"
              onMouseEnter={() => handleNavHover(index)}
              onMouseLeave={handleNavLeave}
            >
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "nav-link-active" : ""
                } ${activeIndex === index ? "nav-link-hover" : ""}`}
                onClick={() => setIsMenuOpen(false)} // Closes menu on link click
              >
                <span className="nav-text">{item.label}</span>
                <span className="nav-dot" />
              </Link>
              <div className="nav-highlight" />
            </div>
          ))}

          {/* Contact Button inside the mobile menu */}
          <div className="nav-item-wrapper nav-cta-wrapper">
             <Button
                variant="primary"
                size="large"
                className="mobile-cta-button"
                onClick={handleContactClick}
              >
                <span className="btn-text">Contact Us</span>
                <span className="btn-icon">→</span>
              </Button>
          </div>
        </nav>

        <div className="header-actions">
          {/* CTA Button (Desktop Only) */}
          <Button
            variant="primary"
            size="small"
            className="cta-button"
            onClick={handleContactClick}
          >
            <span className="btn-text">Contact Us</span>
            <span className="btn-icon">→</span>
            <div className="btn-shine" />
          </Button>

          {/* Menu Toggle (Hamburger) */}
          <button
            className={`menu-toggle ${isMenuOpen ? "menu-toggle-open" : ""}`}
            onClick={() => setIsMenuOpen((s) => !s)}
          >
            ☰
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;