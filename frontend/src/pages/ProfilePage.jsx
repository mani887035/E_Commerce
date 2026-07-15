import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiSettings, FiLogOut, FiEdit2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, updateProfile } from '../services/api';
import { formatPrice } from '../utils/currency';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const { data } = await getMyOrders();
          setOrders(data);
        } catch {}
        finally { setOrdersLoading(false); }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'profile', icon: <FiUser />, label: 'My Profile' },
    { id: 'orders', icon: <FiPackage />, label: 'My Orders' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const statusColors = {
    Processing: 'badge-warning',
    Shipped: 'badge-cyan',
    Delivered: 'badge-success',
    Cancelled: 'badge-accent',
  };

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar-lg">{user?.name?.charAt(0)}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{user?.email}</div>
              {user?.isAdmin && <span className="badge badge-primary" style={{ marginTop: 8 }}>Admin</span>}
            </div>
            {navItems.map(item => (
              <Link
                key={item.id}
                to={`/profile?tab=${item.id}`}
                className={`profile-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
              <button
                className="profile-nav-item"
                style={{ color: 'var(--color-accent)', width: '100%' }}
                onClick={() => { logout(); navigate('/'); toast('Logged out'); }}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginBottom: 28 }}>Profile Information</h2>
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : <><FiCheck /> Save Changes</>}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>My Orders</h2>
                {ordersLoading ? <Loader /> : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
                    <p style={{ fontSize: 16 }}>No orders yet</p>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map(order => (
                      <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                          <div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Order ID</div>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>#{order._id.slice(-8)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Date</div>
                            <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Total</div>
                            <div style={{ fontWeight: 800, fontSize: 18 }}>{formatPrice(order.totalPrice)}</div>
                          </div>
                          <span className={`badge ${statusColors[order.status] || 'badge-primary'}`}>{order.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {order.items.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                          ))}
                          {order.items.length > 3 && (
                            <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginBottom: 28 }}>Account Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Email Notifications', desc: 'Receive updates about orders and promotions' },
                    { label: 'Marketing Emails', desc: 'Stay informed about deals and new products' },
                    { label: 'SMS Alerts', desc: 'Get shipping updates via SMS' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked={i === 0} style={{ display: 'none' }} />
                        <div style={{ position: 'absolute', inset: 0, background: i === 0 ? 'var(--color-primary)' : 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-color)', transition: 'background 0.3s' }} />
                        <div style={{ position: 'absolute', top: 2, left: i === 0 ? 22 : 2, width: 18, height: 18, background: 'white', borderRadius: '50%', transition: 'left 0.3s' }} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
