import axios from 'axios';

const API_KEY = 'storex-api-key-2025';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const loginUser = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await api.post('/Register/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
};

export const registerUser = async (userData) => {
    const res = await api.post('/Register/', userData);
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await api.delete(`/Register/${userId}`);
    return res.data;
};

// Products
export const getProducts = async (skip = 0, limit = 100) => {
    const res = await api.get(`/products/?skip=${skip}&limit=${limit}`);
    return res.data;
};

export const getProduct = async (productId) => {
    const res = await api.get(`/products/${productId}`);
    return res.data;
};

export const createProduct = async (formData) => {
    const res = await api.post('/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const deleteProduct = async (productId) => {
    const res = await api.delete(`/products/${productId}`);
    return res.data;
};

// Categories
export const getCategories = async (skip = 0, limit = 50) => {
    const res = await api.get(`/categories/?skip=${skip}&limit=${limit}`);
    return res.data;
};

export const createCategory = async (categoryData) => {
    const res = await api.post('/categories/', categoryData);
    return res.data;
};

export const deleteCategory = async (categoryId) => {
    const res = await api.delete(`/categories/${categoryId}`);
    return res.data;
};

// Likes
export const likeProduct = async (userId, productId) => {
    const res = await api.post(`/products/likes/${userId}/${productId}`);
    return res.data;
};

// Cart
const cartHeaders = { 'x-api-key': API_KEY };

export const addToCart = async (userId, productId, quantity = 1) => {
    const res = await api.post('/cart/', { user_id: userId, product_id: productId, quantity }, { headers: cartHeaders });
    return res.data;
};

export const getCart = async (userId) => {
    const res = await api.get(`/cart/${userId}`, { headers: cartHeaders });
    return res.data;
};

export const removeFromCart = async (userId, productId) => {
    const res = await api.delete(`/cart/${userId}/${productId}`, { headers: cartHeaders });
    return res.data;
};

export const getCartCount = async (userId) => {
    const res = await api.get(`/cart/${userId}/count`, { headers: cartHeaders });
    return res.data;
};

// Chatbot
export const chatWithBot = async (message, sessionId, categoryId = null) => {
    const payload = {
        message,
        session_id: sessionId,
    };
    if (categoryId) {
        payload.category_id = categoryId;
    }
    const res = await api.post('/chatbot/chat', payload);
    return res.data;
};

export default api;
