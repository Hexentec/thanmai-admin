// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export const AuthContext = createContext({
  user: null,
  login: async () => false,
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, try to load existing user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  // Admin login
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/admin-login', { email, password });
      localStorage.setItem('token', data.token);
      // set header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const profile = await api.get('/users/profile');
      setUser(profile.data);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  // Logout and redirect to login
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
