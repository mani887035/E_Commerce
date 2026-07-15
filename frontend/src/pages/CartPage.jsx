import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 5000 ? 0 : 199;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🛒</div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Looks like you haven't added anything yet!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <FiShoppingBag /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <button className="btn btn-ghost" style={{ marginBottom: 8 }} onClick={() => navigate(-1)}>
              <FiArrowLeft /> Continue Shopping
            </button>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)' }}>
              Shopping Cart
            </h1>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)' }} onClick={clearCart}>
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 100, height: 100, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item._id}`} style={{ fontWeight: 700, fontSize: 16, display: 'block', marginBottom: 4 }}>{item.name}</Link>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{item.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="qty-control">
                      <button className="qty-control-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                      <span className="qty-control-value">{item.qty}</span>
                      <button className="qty-control-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, transition: 'var(--transition-fast)', padding: 4 }} onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{formatPrice(item.price * item.qty)}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{formatPrice(item.price)} each</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <div style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--color-secondary)', marginTop: 16 }}>
                  💡 Add {formatPrice(5000 - cartTotal)} more for free shipping!
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                onClick={() => navigate('/checkout')}
                id="cart-checkout-btn"
              >
                <FiShoppingBag /> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
