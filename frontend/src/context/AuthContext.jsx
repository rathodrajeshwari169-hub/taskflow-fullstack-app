import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const signup = useCallback(async (email, password) => {
    const data = await api.signup(email, password);
    persist(data.token, data.user);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    persist(data.token, data.user);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
