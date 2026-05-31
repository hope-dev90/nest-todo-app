import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // No localStorage initialization
  const [token, setToken] = useState(null); // Store token in memory only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login(email, password);
      setToken(data.accessToken); // Store token in memory only
      const userData = data.user || { email };
      setUser(userData);
      return true;
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.register(name, email, password);
      // Note: register endpoint doesn't return token yet (returns verification message)
      const userData = { name, email };
      setUser(userData);
      return true;
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const clearError = useCallback(() => setError(''), []);

  // Expose token to services
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
