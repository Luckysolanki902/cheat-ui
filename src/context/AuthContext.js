// src/context/AuthContext.js

'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); // Optional: to handle loading state

  useEffect(() => {
    // Check if user is already authenticated
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/check');
        if (res.data.username) {
          setUsername(res.data.username);
        }
      } catch (error) {
        console.error('Auth Check Error:', error);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (usernameInput) => {
    try {
      const res = await axios.post('/api/auth', { username: usernameInput });
      if (res.status === 200) {
        setUsername(usernameInput);
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const logout = () => {
    // Clear auth tokens and state
    setUsername(null);
    // Remove the token cookie by setting it to expire
    document.cookie = 'token=; Max-Age=0; path=/;';
  };

  return (
    <AuthContext.Provider value={{ username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
