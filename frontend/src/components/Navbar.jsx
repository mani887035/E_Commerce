import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiUser, FiLogOut, FiPackage, FiSettings, FiGrid } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?keyword=${searchVal.trim()}`);
      setSearchVal('');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🛍️</div>
            <span className="navbar-logo-text">ShopNova</span>
          </Link>

          <nav className="navbar-nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
            <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Products</NavLink>
            {user?.isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>
            )}
          </nav>

          <form className="navbar-search" onSubmit={handleSearch}>
            <FiSearch className="navbar-search-icon" />
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>

          <div className="navbar-actions">
            <button className="cart-btn" onClick={() => setIsCartOpen(true)} id="cart-toggle-btn">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {user ? (
              <div className="dropdown" ref={dropdownRef}>
                <div
                  className="user-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
                    </div>
                    <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                      <FiUser /> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { navigate('/profile?tab=orders'); setDropdownOpen(false); }}>
                      <FiPackage /> My Orders
                    </button>
                    {user.isAdmin && (
                      <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false); }}>
                        <FiGrid /> Admin Dashboard
                      </button>
                    )}
                    <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
