import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRef, useEffect } from 'react';

// Use refs to store current token and logout so they always get the latest value
let tokenRef = { current: null };
let logoutRef = { current: () => {} };

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = tokenRef.current;
    console.log(
      'API Request to:',
      config.url,
      'with token:',
      token ? 'exists' : 'missing',
    );
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => {
    console.error('API Request Error:', err);
    return Promise.reject(err);
  },
);

// Auto logout on 401
api.interceptors.response.use(
  (res) => {
    console.log('API Response:', res.config.url, res.data);
    return res;
  },
  (err) => {
    console.error(
      'API Response Error:',
      err.response?.status,
      err.response?.data,
    );
    if (err.response?.status === 401) {
      logoutRef.current();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// Hook to initialize the API with the auth context
export function useApiSetup() {
  const { token, logout } = useAuth();

  // Update refs whenever token or logout changes
  useEffect(() => {
    tokenRef.current = token;
    logoutRef.current = logout;
  }, [token, logout]);
}

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  verifyEmail: (token) => api.get('/auth/verify-email', { params: { token } }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, newPassword) =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const notesApi = {
  getAll: (search) => api.get('/notes', { params: { search } }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (note, file) => {
    const formData = new FormData();
    formData.append('title', note.title);
    formData.append('content', note.content);
    if (note.color) formData.append('color', note.color);
    if (note.isPinned !== undefined) formData.append('isPinned', note.isPinned);
    if (file) formData.append('image', file);
    return api.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, note, file) => {
    const formData = new FormData();
    if (note.title) formData.append('title', note.title);
    if (note.content) formData.append('content', note.content);
    if (note.color) formData.append('color', note.color);
    if (note.isPinned !== undefined) formData.append('isPinned', note.isPinned);
    if (file) formData.append('image', file);
    return api.patch(`/notes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/notes/${id}`),
};

export default api;
