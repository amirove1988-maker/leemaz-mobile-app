import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the proxy URL which redirects /api/* to backend on port 8001
const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
  
  verifyEmail: (email: string, code: string) =>
    apiClient.post('/auth/verify-email', { email, code }),
  
  getMe: () =>
    apiClient.get('/auth/me'),
};

export const shopAPI = {
  createShop: (shopData: any) =>
    apiClient.post('/shops', shopData),
  
  getMyShop: () =>
    apiClient.get('/shops/my'),
  
  getShops: (skip = 0, limit = 20) =>
    apiClient.get(`/shops?skip=${skip}&limit=${limit}`),
};

export const productAPI = {
  createProduct: (productData: any) =>
    apiClient.post('/products', productData),
  
  getProducts: (skip = 0, limit = 20, category?: string) => {
    const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
    if (category) params.append('category', category);
    return apiClient.get(`/products?${params}`);
  },
  
  getProduct: (productId: string) =>
    apiClient.get(`/products/${productId}`),
  
  getProductReviews: (productId: string, skip = 0, limit = 10) =>
    apiClient.get(`/products/${productId}/reviews?skip=${skip}&limit=${limit}`),
};

export const reviewAPI = {
  createReview: (reviewData: any) =>
    apiClient.post('/reviews', reviewData),
};

export const chatAPI = {
  sendMessage: (messageData: any) =>
    apiClient.post('/chat/messages', messageData),
  
  getConversations: () =>
    apiClient.get('/chat/conversations'),
  
  getChatMessages: (userId: string, skip = 0, limit = 50) =>
    apiClient.get(`/chat/messages/${userId}?skip=${skip}&limit=${limit}`),
};

export const favoritesAPI = {
  addToFavorites: (productId: string) =>
    apiClient.post(`/favorites/${productId}`),
  
  removeFromFavorites: (productId: string) =>
    apiClient.delete(`/favorites/${productId}`),
  
  getFavorites: () =>
    apiClient.get('/favorites'),
};

export const creditsAPI = {
  getBalance: () =>
    apiClient.get('/credits/balance'),
  
  getTransactions: () =>
    apiClient.get('/credits/transactions'),
};