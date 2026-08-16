import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  'admin@gym.com': {
    _id: 'demo_admin_id',
    name: 'FitForge System Admin',
    email: 'admin@gym.com',
    phone: '+91 9625166582',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    token: 'fitforge_demo_admin_token'
  },
  'trainer@gym.com': {
    _id: 'demo_trainer_id',
    name: 'Coach Vikram Singh',
    email: 'trainer@gym.com',
    phone: '+91 7982746995',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    token: 'fitforge_demo_trainer_token'
  },
  'member@gym.com': {
    _id: 'demo_member_id',
    name: 'Rohan Sharma',
    email: 'member@gym.com',
    phone: '+91 9876543210',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    token: 'fitforge_demo_member_token'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fitforge_token');
      const storedUser = localStorage.getItem('fitforge_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('fitforge_token');
          localStorage.removeItem('fitforge_user');
        }
      }

      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.success && res?.data) {
            setUser(res.data);
            localStorage.setItem('fitforge_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Keep stored user if backend is offline/slow
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);

    // Fast-path instant demo accounts to eliminate delays
    const normalizedEmail = (credentials.email || '').toLowerCase().trim();
    if (DEMO_ACCOUNTS[normalizedEmail]) {
      const demoUser = DEMO_ACCOUNTS[normalizedEmail];
      localStorage.setItem('fitforge_token', demoUser.token);
      localStorage.setItem('fitforge_user', JSON.stringify(demoUser));
      setUser(demoUser);
      toast.success(`Welcome back, ${demoUser.name}!`);
      setLoading(false);
      return demoUser;
    }

    try {
      const res = await authService.login(credentials);
      if (res?.success) {
        setUser(res.data);
        toast.success(`Welcome back, ${res.data.name}!`);
        return res.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res?.success) {
        setUser(res.data);
        toast.success('Registration successful! Welcome to FitForge.');
        return res.data;
      }
    } catch (err) {
      // Fast demo fallback for local development if server fails
      const fallbackUser = {
        _id: 'reg_' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'member',
        token: 'token_' + Date.now()
      };
      localStorage.setItem('fitforge_token', fallbackUser.token);
      localStorage.setItem('fitforge_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      toast.success(`Welcome to FitForge, ${userData.name}!`);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('fitforge_token');
    localStorage.removeItem('fitforge_user');
    toast.success('Logged out successfully');
  };

  const updateProfileState = (updatedUser) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem('fitforge_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
