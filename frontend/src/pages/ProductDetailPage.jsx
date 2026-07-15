import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiArrowLeft, FiStar, FiPackage } from 'react-icons/fi';
import { getProductById, createReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
        setProduct(data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="page"><Loader /></div>;
  if (!product) return null;

  const images = [product.image, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      setSubmittingReview(true);
      await createReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      const { data } = await getProductById(id);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`product-thumbnail ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div className="product-detail-brand">{product.brand}</div>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-rating" style={{ marginBottom: 16 }}>
              <StarRating rating={product.rating} size={18} />
              <span style={{ fontWeight: 600, marginLeft: 6 }}>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="detail-original">{formatPrice(product.originalPrice)}</span>
                  <span className="detail-discount">-{discount}%</span>
                </>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="stock-indicator">
              <div className={`stock-dot ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : ''}`} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="quantity-selector">
                <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Quantity:</span>
                <div className="qty-control">
                  <button className="qty-control-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-control-value">{qty}</span>
                  <button className="qty-control-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                id="detail-add-to-cart-btn"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-secondary" style={{ width: 54, height: 54, padding: 0, justifyContent: 'center' }}>
                <FiHeart />
              </button>
              <button className="btn btn-secondary" style={{ width: 54, height: 54, padding: 0, justifyContent: 'center' }}>
                <FiShare2 />
              </button>
            </div>

            {/* Product Info */}
            <div style={{ marginTop: 28, padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Category</span>
                  <span style={{ fontWeight: 600 }}>{product.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Brand</span>
                  <span style={{ fontWeight: 600 }}>{product.brand}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stock</span>
                  <span style={{ fontWeight: 600 }}>{product.stock} units</span>
                </div>
                {product.tags?.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tags</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {product.tags.map(tag => (
                        <span key={tag} className="badge badge-primary" style={{ fontSize: 11 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ padding: '40px 0 80px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 24, marginBottom: 32 }}>
            Customer Reviews ({product.numReviews})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Reviews List */}
            <div>
              {product.reviews.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 15, padding: '40px 0', textAlign: 'center' }}>
                  <FiStar style={{ fontSize: 40, marginBottom: 12 }} />
                  <p>No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {product.reviews.map(r => (
                    <div key={r._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white' }}>
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <StarRating rating={r.rating} size={14} />
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review */}
            <div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Write a Review</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            type="button"
                            key={s}
                            style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: s <= reviewRating ? 'var(--color-warning)' : 'var(--bg-card-hover)', transition: 'var(--transition-fast)' }}
                            onClick={() => setReviewRating(s)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        required
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                    <p style={{ marginBottom: 16 }}>Sign in to write a review</p>
                    <Link to="/login" className="btn btn-primary">Sign In</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
