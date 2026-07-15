import axios from 'axios';
import {
  getStaticProducts,
  getStaticCategories,
  getStaticProductById,
} from '../data/products';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 3000,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: try API, fall back to static data
const withFallback = async (apiCall, fallbackFn) => {
  try {
    const result = await apiCall();
    return result;
  } catch {
    const data = fallbackFn();
    return { data };
  }
};

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getUsers = () => API.get('/auth/users');

// Products (with static fallback)
export const getProducts = (params) =>
  withFallback(
    () => API.get('/products', { params }),
    () => getStaticProducts(params)
  );

export const getProductById = (id) =>
  withFallback(
    () => API.get(`/products/${id}`),
    () => getStaticProductById(id)
  );

export const getCategories = () =>
  withFallback(
    () => API.get('/products/categories'),
    () => getStaticCategories()
  );

export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const payOrder = (id) => API.put(`/orders/${id}/pay`);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

export default API;
