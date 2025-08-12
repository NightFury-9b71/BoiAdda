import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";
import { AUTH_STORAGE_KEYS } from "../constants/auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on load
  useEffect(() => {
    const t = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const u = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    if (t && u) {
      setToken(t);
      try { setUser(JSON.parse(u)); } catch { setUser(null); }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user); // user.role_name is available
    return res.user;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role_name === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
