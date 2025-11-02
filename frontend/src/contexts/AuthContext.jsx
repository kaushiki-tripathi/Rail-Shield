import React, { createContext, useState, useEffect } from 'react';
import { setAccessToken as setApiAccessToken } from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
      const token = localStorage.getItem('accessToken');
      if (token) setApiAccessToken(token);
    } catch {
      setUser(null);
    }
  }, []);

  const login = (accessToken, userObj) => {
    try { localStorage.setItem('user', JSON.stringify(userObj)); } catch { /* ignore */ }
    setApiAccessToken(accessToken);
    setUser(userObj);
  };

  const logout = () => {
    try { localStorage.removeItem('user'); } catch { /* ignore */ }
    try { localStorage.removeItem('accessToken'); } catch { /* ignore */ }
    setApiAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
