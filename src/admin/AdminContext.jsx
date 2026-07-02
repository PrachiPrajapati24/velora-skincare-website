import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext(null);

const API = axios.create({ baseURL: '/api/admin' });

// Attach token to every admin request
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser]   = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (adminToken) {
      const stored = localStorage.getItem('adminUser');
      if (stored) setAdminUser(JSON.parse(stored));
    }
  }, [adminToken]);

  const login = async (email, password) => {
    const res = await API.post('/login', { email, password });
    localStorage.setItem('adminToken', res.data.token);
    localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
    setAdminToken(res.data.token);
    setAdminUser(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
  };

  const isAdminAuthenticated = !!adminToken;

  return (
    <AdminContext.Provider value={{ adminUser, adminToken, isAdminAuthenticated, login, logout, API }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
export { API as adminAPI };
