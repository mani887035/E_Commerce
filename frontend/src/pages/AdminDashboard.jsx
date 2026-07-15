import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import {
  getProducts, deleteProduct, createProduct, updateProduct,
  getAllOrders, getUsers, updateOrderStatus
} from '../services/api';
import { formatPrice } from '../utils/currency';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', originalPrice: '', category: '', brand: '', stock: '', description: '', image: '', isFeatured: false });

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'products') {
        const { data } = await getProducts({ pageSize: 100 });
        setProducts(data.products);
      }
      if (activeTab === 'overview' || activeTab === 'orders') {
        const { data } = await getAllOrders();
        setOrders(data);
      }
      if (activeTab === 'overview' || activeTab === 'users') {
        const { data } = await getUsers();
        setUsers(data);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const totalRevenue = orders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { data } = await updateProduct(editingProduct._id, { ...productForm, price: +productForm.price, originalPrice: +productForm.originalPrice, stock: +productForm.stock });
        setProducts(prev => prev.map(p => p._id === data._id ? data : p));
        toast.success('Product updated');
      } else {
        const { data } = await createProduct({ ...productForm, price: +productForm.price, originalPrice: +productForm.originalPrice, stock: +productForm.stock });
        setProducts(prev => [data, ...prev]);
        toast.success('Product created');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', originalPrice: '', category: '', brand: '', stock: '', description: '', image: '', isFeatured: false });
    } catch { toast.error('Failed to save product'); }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, price: product.price, originalPrice: product.originalPrice, category: product.category, brand: product.brand, stock: product.stock, description: product.description, image: product.image, isFeatured: product.isFeatured });
    setShowProductForm(true);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const tabs = [
    { id: 'overview', icon: <FiDollarSign />, label: 'Overview' },
    { id: 'products', icon: <FiPackage />, label: 'Products' },
    { id: 'orders', icon: <FiShoppingBag />, label: 'Orders' },
    { id: 'users', icon: <FiUsers />, label: 'Users' },
  ];

  const statusColors = { Processing: 'badge-warning', Shipped: 'badge-cyan', Delivered: 'badge-success', Cancelled: 'badge-accent' };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="admin-header">
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage your store</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 32, width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab(tab.id)} style={{ gap: 6 }} id={`admin-tab-${tab.id}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <div className="admin-grid">
                  {[
                    { icon: '💰', label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
                    { icon: '📦', label: 'Total Orders', value: orders.length, color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
                    { icon: '🛍️', label: 'Products', value: products.length, color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)' },
                    { icon: '👥', label: 'Customers', value: users.length, color: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' },
                  ].map((stat, i) => (
                    <div key={i} className="admin-stat-card" style={{ background: stat.color, borderColor: stat.border }}>
                      <div className="admin-stat-icon" style={{ fontSize: 28 }}>{stat.icon}</div>
                      <div className="admin-stat-value">{stat.value}</div>
                      <div className="admin-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className="table-wrapper">
                    <div className="table-header"><span style={{ fontWeight: 700 }}>Recent Orders</span></div>
                    <table>
                      <thead><tr><th>Order</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o._id}>
                            <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>#{o._id.slice(-6)}</td>
                            <td>{formatPrice(o.totalPrice)}</td>
                            <td><span className={`badge ${statusColors[o.status] || 'badge-primary'}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-wrapper">
                    <div className="table-header"><span style={{ fontWeight: 700 }}>Top Products</span></div>
                    <table>
                      <thead><tr><th>Product</th><th>Price</th><th>Stock</th></tr></thead>
                      <tbody>
                        {products.slice(0, 5).map(p => (
                          <tr key={p._id}>
                            <td style={{ fontWeight: 600 }}>{p.name.slice(0, 22)}...</td>
                            <td>{formatPrice(p.price)}</td>
                            <td><span className={`badge ${p.stock < 5 ? 'badge-accent' : 'badge-success'}`}>{p.stock}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div>
                {showProductForm && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                      <button className="cart-close" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}><FiX /></button>
                    </div>
                    <form onSubmit={handleProductSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                          <label className="form-label">Product Name</label>
                          <input className="form-input" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <input className="form-input" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price ($)</label>
                          <input type="number" className="form-input" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Original Price ($)</label>
                          <input type="number" className="form-input" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Brand</label>
                          <input className="form-input" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Stock</label>
                          <input type="number" className="form-input" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Image URL</label>
                          <input className="form-input" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} required placeholder="https://..." />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Description</label>
                          <textarea className="form-input" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required style={{ resize: 'vertical' }} />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                            <input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm({...productForm, isFeatured: e.target.checked})} />
                            Mark as Featured
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary"><FiCheck /> {editingProduct ? 'Update' : 'Create'} Product</button>
                    </form>
                  </div>
                )}
                <div className="table-wrapper">
                  <div className="table-header">
                    <span style={{ fontWeight: 700 }}>All Products ({products.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowProductForm(true); setEditingProduct(null); }} id="add-product-btn">
                      <FiPlus /> Add Product
                    </button>
                  </div>
                  <table>
                    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name.slice(0, 28)}{p.name.length > 28 ? '...' : ''}</span>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>{formatPrice(p.price)}</td>
                          <td><span className={`badge ${p.stock < 5 ? 'badge-accent' : 'badge-success'}`}>{p.stock}</span></td>
                          <td>{p.isFeatured ? <span className="badge badge-primary">Yes</span> : <span className="badge">No</span>}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}><FiEdit2 /></button>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)' }} onClick={() => handleDeleteProduct(p._id)}><FiTrash2 /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="table-wrapper">
                <div className="table-header"><span style={{ fontWeight: 700 }}>All Orders ({orders.length})</span></div>
                <table>
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>#{o._id.slice(-8)}</td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>{o.items.length} items</td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(o.totalPrice)}</td>
                        <td><span className={`badge ${statusColors[o.status] || 'badge-primary'}`}>{o.status}</span></td>
                        <td>
                          <select
                            className="form-select"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            value={o.status}
                            onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                          >
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="table-wrapper">
                <div className="table-header"><span style={{ fontWeight: 700 }}>All Users ({users.length})</span></div>
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>
                              {u.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                        <td><span className={`badge ${u.isAdmin ? 'badge-accent' : 'badge-primary'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
