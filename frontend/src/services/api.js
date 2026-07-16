/**
 * api.js — fully static version (no backend required)
 *
 * Products & categories: served from src/data/products.js
 * Auth:                  handled by AuthContext (localStorage)
 * Orders:                stored in localStorage
 * Admin product CRUD:    stored as overrides in localStorage
 * Reviews:               stored in localStorage
 */

import {
  getStaticProducts,
  getStaticCategories,
  getStaticProductById,
  staticProducts,
} from '../data/products';

// ─── localStorage keys ───────────────────────────────────────────────────────
const ORDERS_KEY    = 'shopnova_orders';
const OVERRIDES_KEY = 'shopnova_product_overrides';  // added / edited products
const DELETED_KEY   = 'shopnova_deleted_products';   // deleted product IDs
const REVIEWS_KEY   = 'shopnova_reviews';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const readJSON  = (key, def = []) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const writeJSON = (key, val)       => localStorage.setItem(key, JSON.stringify(val));

/** Return merged product list: static + overrides - deleted */
const getMergedProducts = () => {
  const deleted   = readJSON(DELETED_KEY, []);
  const overrides = readJSON(OVERRIDES_KEY, []);
  const base      = staticProducts.filter((p) => !deleted.includes(p._id));
  // overrides may contain edited originals or brand-new ones
  const overrideIds = overrides.map((p) => p._id);
  const merged    = base.filter((p) => !overrideIds.includes(p._id));
  return [...overrides, ...merged];
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProducts = (params = {}) => {
  const all     = getMergedProducts();
  let results   = [...all];
  const { keyword = '', category = '', featured = '', sort = 'newest', page = 1, pageSize = 12 } = params;

  if (keyword)  results = results.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()));
  if (category) results = results.filter((p) => p.category === category);
  if (featured) results = results.filter((p) => p.isFeatured);

  if (sort === 'price_asc')  results.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating')     results.sort((a, b) => b.rating - a.rating);

  const total    = results.length;
  const pages    = Math.ceil(total / pageSize);
  const start    = (page - 1) * pageSize;
  const products = results.slice(start, start + pageSize);

  return Promise.resolve({ data: { products, page, pages, total } });
};

export const getProductById = (id) => {
  const overrides = readJSON(OVERRIDES_KEY, []);
  const override  = overrides.find((p) => p._id === id);
  const base      = getStaticProductById(id);
  const product   = override || base;
  if (!product) return Promise.reject(new Error('Product not found'));

  // Attach any saved reviews
  const allReviews = readJSON(REVIEWS_KEY, {});
  const reviews    = allReviews[id] || product.reviews || [];
  const numReviews = reviews.length;
  const rating     = numReviews
    ? reviews.reduce((s, r) => s + r.rating, 0) / numReviews
    : product.rating;

  return Promise.resolve({ data: { ...product, reviews, rating, numReviews } });
};

export const getCategories = () =>
  Promise.resolve({ data: getStaticCategories() });

export const createProduct = (data) => {
  const newProduct = {
    ...data,
    _id: `prod_${Date.now()}`,
    rating: 0,
    numReviews: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
  };
  const overrides = readJSON(OVERRIDES_KEY, []);
  overrides.unshift(newProduct);
  writeJSON(OVERRIDES_KEY, overrides);
  return Promise.resolve({ data: newProduct });
};

export const updateProduct = (id, data) => {
  const overrides = readJSON(OVERRIDES_KEY, []);
  const idx       = overrides.findIndex((p) => p._id === id);
  let updated;
  if (idx !== -1) {
    updated = { ...overrides[idx], ...data };
    overrides[idx] = updated;
  } else {
    // editing a static product — add to overrides
    const base = getStaticProductById(id) || {};
    updated    = { ...base, ...data, _id: id };
    overrides.push(updated);
  }
  writeJSON(OVERRIDES_KEY, overrides);
  return Promise.resolve({ data: updated });
};

export const deleteProduct = (id) => {
  // Remove from overrides
  const overrides = readJSON(OVERRIDES_KEY, []).filter((p) => p._id !== id);
  writeJSON(OVERRIDES_KEY, overrides);
  // Mark static product as deleted
  const deleted = readJSON(DELETED_KEY, []);
  if (!deleted.includes(id)) { deleted.push(id); writeJSON(DELETED_KEY, deleted); }
  return Promise.resolve({ data: { message: 'Deleted' } });
};

export const createReview = (productId, reviewData) => {
  const allReviews = readJSON(REVIEWS_KEY, {});
  const reviews    = allReviews[productId] || [];
  const newReview  = {
    _id: `rev_${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString(),
  };
  allReviews[productId] = [newReview, ...reviews];
  writeJSON(REVIEWS_KEY, allReviews);
  return Promise.resolve({ data: newReview });
};

// ─── Orders ──────────────────────────────────────────────────────────────────
const getUserId = () => {
  try { return JSON.parse(localStorage.getItem('userInfo'))?._id || 'guest'; } catch { return 'guest'; }
};

export const createOrder = (orderData) => {
  const orders = readJSON(ORDERS_KEY, []);
  const order  = {
    ...orderData,
    _id: `ord_${Date.now()}`,
    user: { _id: getUserId() },
    status: 'Processing',
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  writeJSON(ORDERS_KEY, orders);
  return Promise.resolve({ data: order });
};

export const payOrder = (id) => {
  const orders = readJSON(ORDERS_KEY, []);
  const idx    = orders.findIndex((o) => o._id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], isPaid: true, paidAt: new Date().toISOString() };
    writeJSON(ORDERS_KEY, orders);
    return Promise.resolve({ data: orders[idx] });
  }
  return Promise.reject(new Error('Order not found'));
};

export const getMyOrders = () => {
  const uid    = getUserId();
  const orders = readJSON(ORDERS_KEY, []).filter((o) => o.user?._id === uid);
  return Promise.resolve({ data: orders });
};

export const getOrderById = (id) => {
  const order = readJSON(ORDERS_KEY, []).find((o) => o._id === id);
  if (!order) return Promise.reject(new Error('Order not found'));
  return Promise.resolve({ data: order });
};

export const getAllOrders = () =>
  Promise.resolve({ data: readJSON(ORDERS_KEY, []) });

export const updateOrderStatus = (id, status) => {
  const orders = readJSON(ORDERS_KEY, []);
  const idx    = orders.findIndex((o) => o._id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], status };
    writeJSON(ORDERS_KEY, orders);
    return Promise.resolve({ data: orders[idx] });
  }
  return Promise.reject(new Error('Order not found'));
};

// ─── Auth stubs (real logic lives in AuthContext) ────────────────────────────
// These are called nowhere in the static version, kept for import compatibility
export const register    = () => Promise.resolve({ data: {} });
export const login       = () => Promise.resolve({ data: {} });
export const getProfile  = () => Promise.resolve({ data: JSON.parse(localStorage.getItem('userInfo') || 'null') });
export const updateProfile = () => Promise.resolve({ data: {} });

// ─── Users (admin tab) ───────────────────────────────────────────────────────
export const getUsers = () => {
  const DEMO_USERS = [
    { _id: 'admin001', name: 'Admin User',   email: 'admin@shopnova.com', isAdmin: true,  createdAt: '2024-01-01T00:00:00.000Z' },
    { _id: 'user001',  name: 'John Doe',     email: 'john@example.com',   isAdmin: false, createdAt: '2024-02-15T00:00:00.000Z' },
  ];
  const registered = readJSON('shopnova_users', []).map(({ password: _pw, ...u }) => u);
  return Promise.resolve({ data: [...DEMO_USERS, ...registered] });
};

export default { getProducts, getProductById };
