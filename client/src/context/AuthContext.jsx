import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [advocateProfile, setAdvocateProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.data.user);
        setAdvocateProfile(data.data.advocateProfile);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setAdvocateProfile(data.data.advocateProfile);
      return data.data;
    }
    throw new Error(data.message);
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      return data.data;
    }
    throw new Error(data.message);
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    setUser(null);
    setAdvocateProfile(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser) => setUser(prev => ({ ...prev, ...updatedUser }));

  return (
    <AuthContext.Provider value={{ user, advocateProfile, loading, login, register, logout, updateUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
