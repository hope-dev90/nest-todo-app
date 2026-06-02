import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

// Initialize from localStorage so first request has the token
let tokenRef = { current: localStorage.getItem('token') };
let logoutRef = { current: () => {} };

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Expose so AuthContext can sync token immediately on login/logout
export function setApiToken(token) {
  tokenRef.current = token;
}

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = tokenRef.current;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logoutRef.current();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// Hook to keep refs in sync with auth context
export function useApiSetup() {
  const { token, logout } = useAuth();

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
    formData.append('color', note.color);
    formData.append('isPinned', note.isPinned);
    if (file) formData.append('image', file);
    return api.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, note, file) => {
    const formData = new FormData();
    if (note.title !== undefined) formData.append('title', note.title);
    if (note.content !== undefined) formData.append('content', note.content);
    if (note.color !== undefined) formData.append('color', note.color);
    if (note.isPinned !== undefined) formData.append('isPinned', note.isPinned);
    if (file) formData.append('image', file);
    return api.patch(`/notes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/notes/${id}`),
};

export default api;
