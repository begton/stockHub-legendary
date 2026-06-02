import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (username, password) => api.post('/auth/login', { username, password });
export const register = (username, password, email) => api.post('/auth/register', { username, password, email });

// Product endpoints
export const getProducts = () => api.get('/products');
export const addProduct = (productData) => api.post('/products', productData);
export const getProduct = (id) => api.get(`/products/${id}`);

// Warehouse endpoints
export const getWarehouses = () => api.get('/warehouses');
export const addWarehouse = (warehouseData) => api.post('/warehouses', warehouseData);
export const getWarehouse = (id) => api.get(`/warehouses/${id}`);

// Transaction endpoints
export const getTransactions = () => api.get('/transactions');
export const addTransaction = (transactionData) => api.post('/transactions', transactionData);
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const updateTransaction = (id, transactionData) => api.put(`/transactions/${id}`, transactionData);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Report endpoints
export const getDailyReport = (date) => api.get(`/reports/daily?date=${date}`);
export const getWeeklyReport = () => api.get('/reports/weekly');
export const getMonthlyReport = () => api.get('/reports/monthly');
export const getStockSummary = () => api.get('/reports/stock-summary');

export default api;
