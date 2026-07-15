import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiShoppingBag, FiCreditCard, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, payOrder } from '../services/api';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';

const steps = ['Shipping', 'Payment', 'Confirmation'];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shipping = cartTotal > 5000 ? 0 : 199;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  if (!user) {
    navigate('/login?redirect=checkout');
    return null;
  }

  if (cartItems.length === 0 && step !== 2) {
    navigate('/cart');
    return null;
  }

  const handleShippingNext = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.qty })),
        shippingAddress: shippingInfo,
        paymentMethod: 'Card',
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };
      const { data } = await createOrder(orderData);
      await payOrder(data._id);
      setOrderId(data._id);
      clearCart();
      setStep(2);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 32 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s} className={`checkout-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-number">
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div>
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiMapPin style={{ color: 'var(--color-primary)' }} /> Shipping Address
                </h2>
                <form onSubmit={handleShippingNext}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} required placeholder="123 Main Street" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} required placeholder="New York" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input className="form-input" value={shippingInfo.postalCode} onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})} required placeholder="10001" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" value={shippingInfo.country} onChange={e => setShippingInfo({...shippingInfo, country: e.target.value})} required placeholder="United States" />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiCreditCard style={{ color: 'var(--color-primary)' }} /> Payment Details
                </h2>
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(99,102,241,0.2)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: -20, left: 60, width: 80, height: 80, background: 'rgba(6,182,212,0.15)', borderRadius: '50%' }} />
                  <div style={{ fontSize: 28, marginBottom: 20, letterSpacing: 3, fontWeight: 300, fontFamily: 'monospace' }}>
                    {paymentInfo.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>Card Holder</div>
                      <div style={{ fontWeight: 600 }}>{paymentInfo.cardName || 'Your Name'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>Expires</div>
                      <div style={{ fontWeight: 600 }}>{paymentInfo.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label className="form-label">Card Holder Name</label>
                    <input className="form-input" value={paymentInfo.cardName} onChange={e => setPaymentInfo({...paymentInfo, cardName: e.target.value})} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value.replace(/\s/g,'').replace(/(.{4})/g,'$1 ').trim()})} maxLength={19} required placeholder="1234 5678 9012 3456" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input className="form-input" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} required placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} required placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(0)}>Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} disabled={loading} id="place-order-btn">
                      {loading ? 'Placing Order...' : `🔒 Place Order — ${formatPrice(total)}`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--color-success), #06d6a0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
                  ✅
                </div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Order Confirmed!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Thank you for your purchase!</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
                  Your order has been placed and will be processed shortly.<br />
                  Order ID: <strong style={{ color: 'var(--color-primary-light)' }}>#{orderId?.slice(-8)}</strong>
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/profile?tab=orders')}>
                    <FiShoppingBag /> View Orders
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {step < 2 && (
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-img" />
                  <div>
                    <div className="summary-item-name">{item.name} × {item.qty}</div>
                    <div className="summary-item-price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
              <div className="summary-totals">
                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
