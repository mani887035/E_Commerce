import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="navbar-logo-icon">🛍️</div>
              <span className="navbar-logo-text">ShopNova</span>
            </Link>
            <p className="footer-brand-desc">
              Discover premium products curated for the modern lifestyle. Quality, style, and innovation in every purchase.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-btn" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-btn" aria-label="GitHub"><FiGithub /></a>
              <a href="#" className="social-btn" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Shop</h4>
            <div className="footer-links">
              <Link to="/products" className="footer-link">All Products</Link>
              <Link to="/products?category=Electronics" className="footer-link">Electronics</Link>
              <Link to="/products?category=Fashion" className="footer-link">Fashion</Link>
              <Link to="/products?category=Home+%26+Garden" className="footer-link">Home & Garden</Link>
              <Link to="/products?category=Toys" className="footer-link">Toys</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Account</h4>
            <div className="footer-links">
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Create Account</Link>
              <Link to="/profile" className="footer-link">My Profile</Link>
              <Link to="/profile?tab=orders" className="footer-link">My Orders</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Support</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Shipping Info</a>
              <a href="#" className="footer-link">Returns Policy</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 ShopNova. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiMail size={14} /> support@shopnova.com
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
