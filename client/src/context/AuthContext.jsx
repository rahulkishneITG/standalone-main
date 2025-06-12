import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLoader } from './LoaderContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { showLoader, hideLoader } = useLoader();

  const login = async (email, password, rememberMe) => {
    try {
      
      showLoader();
      const res = await axios.post(`${BASE_URL}api/auth/login`, { email, password, rememberMe });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.userData));
      setUser(res.data.userData);
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    } finally {
      hideLoader();
    }
  };


  const logout = async () => {
    try {
      showLoader();
      setTimeout(() => {
        localStorage.removeItem('token');
        setUser(null);
        hideLoader();
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error.message);
      hideLoader(); 
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
