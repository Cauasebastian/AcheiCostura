import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../data/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        //adicionar 10 moedas ao logar
        const updatedUser = {
          ...JSON.parse(savedUser),
          coins: (JSON.parse(savedUser).coins || 0) + 10
        };
        setUser(updatedUser);
        setIsLoggedIn(true);
      }
      
      setIsInitializing(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = error.message || 'Erro ao fazer login';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = error.message || 'Erro ao cadastrar';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const gastarMoeda = () => {
    if (user && user.coins > 0) {
      const updatedUser = {
        ...user,
        coins: user.coins - 1
      };
      updateUser(updatedUser);
      return true; 
    }
    return false; 
  };

  const value = { 
    isLoggedIn, 
    login, 
    logout, 
    register, 
    user, 
    updateUser,
    gastarMoeda,
    loading,
    error,
    setError,
    isInitializing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}