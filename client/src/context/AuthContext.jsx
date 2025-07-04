import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLoader } from './LoaderContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        showLoader();
        const res = await axios.get(`${BASE_URL}api/auth/me`, {
          withCredentials: true, 
        });
        setUser(res.data.userData);
      } catch (err) {
        setUser(null);
      } finally {
        hideLoader();
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      showLoader();
      const res = await axios.post(
        `${BASE_URL}api/auth/login`,
        { email, password, rememberMe },
        { withCredentials: true } 
      );
      setUser(res.data.userData);
    } catch (err) {
      console.error('Login Error:', err);
      throw err;
    } finally {
      hideLoader();
    }
  };

  const logout = async () => {
    try {
      showLoader();
      await axios.post(`${BASE_URL}api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      hideLoader();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
