import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('backhaulx_token');
    const savedUser = localStorage.getItem('backhaulx_user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('backhaulx_token');
        localStorage.removeItem('backhaulx_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user, token } = res.data.data;
        localStorage.setItem('backhaulx_token', token);
        localStorage.setItem('backhaulx_user', JSON.stringify(user));
        setUser(user);
        return user;
      }
      throw new Error(res.data.message || 'Login failed');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      throw new Error(serverMessage || err.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const { user, token } = res.data.data;
        localStorage.setItem('backhaulx_token', token);
        localStorage.setItem('backhaulx_user', JSON.stringify(user));
        setUser(user);
        return user;
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      throw new Error(serverMessage || err.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('backhaulx_token');
    localStorage.removeItem('backhaulx_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
