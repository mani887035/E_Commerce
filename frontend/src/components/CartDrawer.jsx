import { useCart } from '../context/CartContext';
import { FiX, FiShoppingBag, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const CartDrawer = () => {
  const { cartItems, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">
            🛒 Your Cart
            {cartItems.length > 0 && (
              <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                ({cartItems.length} items)
              </span>
            )}
          </h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)} id="cart-close-btn">
            <FiX />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setIsCartOpen(false); navigate('/products'); }}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>
                    <div className="cart-item-controls">
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>
                        <FiMinus size={12} />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>
                        <FiPlus size={12} />
                      </button>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item._id)} style={{ marginLeft: 'auto' }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">{formatPrice(cartTotal)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                id="checkout-btn"
              >
                <FiShoppingBag /> Proceed to Checkout
              </button>
              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
              >
                View Full Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
