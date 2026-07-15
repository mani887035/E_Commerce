import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ keyword, category, sort, featured, page, pageSize: 12 });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, featured, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div style={{ padding: '32px 0 16px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 8 }}>
            {keyword ? `Results for "${keyword}"` : category ? category : '🛍️ All Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {total} products found
          </p>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-title">
              <FiFilter /> Filters
              {(category || keyword) && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 'auto', fontSize: 12 }}
                  onClick={() => { setSearchParams({}); setPage(1); }}
                >
                  Clear <FiX size={12} />
                </button>
              )}
            </div>

            <div className="filter-section">
              <div className="filter-section-title">Category</div>
              <div
                className={`filter-option ${!category ? 'active' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                All Categories
              </div>
              {categories.map(cat => (
                <div
                  key={cat}
                  className={`filter-option ${category === cat ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat)}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-section-title">Collections</div>
              <div
                className={`filter-option ${featured ? 'active' : ''}`}
                onClick={() => updateParam('featured', featured ? '' : 'true')}
              >
                ⭐ Featured Only
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-title">Sort By</div>
              {sortOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`filter-option ${sort === opt.value ? 'active' : ''}`}
                  onClick={() => updateParam('sort', opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="products-header">
              <span className="products-count">
                Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <select
                    className="form-select"
                    style={{ padding: '8px 16px', fontSize: 13 }}
                    value={sort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-secondary)' }}>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`btn ${p === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
