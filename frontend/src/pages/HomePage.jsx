import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiChevronRight } from 'react-icons/fi';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

const categories = [
  { name: 'Electronics', icon: '💻', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
  { name: 'Fashion', icon: '👗', color: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' },
  { name: 'Home & Garden', icon: '🏠', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  { name: 'Toys', icon: '🎮', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
];

const features = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% protected checkout' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help' },
];

const categorySections = [
  { name: 'Electronics', icon: '💻', gradient: 'linear-gradient(135deg,rgba(99,102,241,.18),rgba(99,102,241,.04))' },
  { name: 'Fashion', icon: '👗', gradient: 'linear-gradient(135deg,rgba(244,63,94,.18),rgba(244,63,94,.04))' },
  { name: 'Home & Garden', icon: '🏠', gradient: 'linear-gradient(135deg,rgba(16,185,129,.18),rgba(16,185,129,.04))' },
  { name: 'Toys', icon: '🎮', gradient: 'linear-gradient(135deg,rgba(245,158,11,.18),rgba(245,158,11,.04))' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ featured: true, pageSize: 8 });
        setFeatured(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryProducts = async () => {
      try {
        const results = await Promise.all(
          categorySections.map(cat =>
            getProducts({ category: cat.name, pageSize: 5, sort: 'rating' })
          )
        );
        const map = {};
        categorySections.forEach((cat, i) => {
          map[cat.name] = results[i].data.products;
        });
        setCategoryProducts(map);
      } catch (err) {
        console.error(err);
      } finally {
        setCatLoading(false);
      }
    };

    fetchFeatured();
    fetchCategoryProducts();
  }, []);

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient-orb hero-orb-1" />
          <div className="hero-gradient-orb hero-orb-2" />
          <div className="hero-gradient-orb hero-orb-3" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                ✨ Premium Shopping Experience
              </div>
              <h1 className="hero-title">
                Discover Products<br />
                That <span className="gradient-text">Inspire You</span>
              </h1>
              <p className="hero-description">
                Explore thousands of premium products curated for the modern lifestyle. 
                From cutting-edge electronics to exclusive fashion — all in one place.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')} id="hero-shop-btn">
                  <FiShoppingBag /> Shop Now
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/products?featured=true')}>
                  View Featured <FiArrowRight />
                </button>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">10K+</div>
                  <div className="hero-stat-label">Products</div>
                </div>
                <div>
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Happy Customers</div>
                </div>
                <div>
                  <div className="hero-stat-value">4.9★</div>
                  <div className="hero-stat-label">Avg. Rating</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format"
                  alt="Premium shopping experience"
                />
              </div>
              <div className="hero-float-card hero-float-card-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>🎁</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>New Arrivals</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>200+ products added</div>
                  </div>
                </div>
              </div>
              <div className="hero-float-card hero-float-card-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiStar style={{ color: 'var(--color-warning)', fontSize: 24 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Top Rated</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>4.9/5 average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--color-primary-light)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📦 Collections</div>
            <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
            <p className="section-subtitle">Explore our curated collections across every lifestyle category.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                style={{
                  background: cat.color,
                  border: `1px solid ${cat.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 24px',
                  textAlign: 'center',
                  transition: 'var(--transition)',
                  display: 'block',
                }}
                className="card"
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{cat.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  Browse <FiArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⭐ Best Sellers</div>
            <h2 className="section-title">Featured <span className="gradient-text">Products</span></h2>
            <p className="section-subtitle">Handpicked favorites loved by thousands of customers worldwide.</p>
          </div>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map(product => <ProductCard key={product._id} product={product} />)
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
              View All Featured <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASES */}
      {categorySections.map((cat, idx) => {
        const prods = categoryProducts[cat.name] || [];
        const isEven = idx % 2 === 0;
        return (
          <section
            key={cat.name}
            style={{
              padding: '60px 0',
              background: isEven ? 'transparent' : 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div className="container">
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: cat.gradient,
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26,
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(20px, 2.5vw, 30px)' }}>
                      {cat.name}
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>
                      {prods.length} top-rated products
                    </p>
                  </div>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 6, flexShrink: 0 }}
                >
                  View All <FiArrowRight size={14} />
                </Link>
              </div>

              {/* Products row */}
              <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
                {catLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                  : prods.map(product => <ProductCard key={product._id} product={product} />)
                }
              </div>
            </div>
          </section>
        );
      })}

      {/* PROMO BANNER */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 40,
            alignItems: 'center',
          }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: 16 }}>🔥 Limited Time</div>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 40px)', marginBottom: 12 }}>
                Up to <span className="gradient-text">50% Off</span> on Electronics
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
                Don't miss out on incredible deals. Shop the latest tech at unbeatable prices — today only!
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link to="/products?category=Electronics" className="btn btn-primary btn-lg">
                Shop Electronics <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

