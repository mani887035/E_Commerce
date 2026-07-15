import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import { formatPrice } from '../utils/currency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card animate-fade-up">
      <div
        className="product-image-wrapper"
        onClick={() => navigate(`/products/${product._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.isFeatured && (
          <div className="product-badge">
            <span className="badge badge-primary">Featured</span>
          </div>
        )}
        {discount > 0 && (
          <div className="product-discount">-{discount}%</div>
        )}
        <div className="product-actions">
          <button
            className="product-action-btn"
            title="View details"
            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product._id}`); }}
          >
            <FiEye />
          </button>
          <button className="product-action-btn" title="Wishlist">
            <FiHeart />
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="product-reviews">({product.numReviews})</span>
        </div>
        <div className="product-price-row">
          <div>
            <div className="product-price">{formatPrice(product.price)}</div>
            {discount > 0 && (
              <div className="product-original-price">{formatPrice(product.originalPrice)}</div>
            )}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            disabled={product.stock === 0}
            title="Add to cart"
            id={`add-to-cart-${product._id}`}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
