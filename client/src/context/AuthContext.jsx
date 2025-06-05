import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${BASE_URL}api/auth/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    console.log(email,password,rememberMe);
    const res = await axios.post(`${BASE_URL}api/auth/login`, { email, password, rememberMe });
    localStorage.setItem('token', res.data.token);
    const userRes = await axios.get(`${BASE_URL}api/auth/`, {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });
    setUser(userRes.data);
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${BASE_URL}api/auth/register`, { name, email, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await axios.get(`${BASE_URL}api/auth/`, {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });
    setUser(userRes.data);
  };


  const logout = async () => {
  try {
    localStorage.removeItem('token');
    setUser(null);
  } catch (error) {
    console.error('Logout error:', error.response?.data?.message || error.message);
    localStorage.removeItem('token'); // Clear token even if API call fails
    setUser(null);
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};