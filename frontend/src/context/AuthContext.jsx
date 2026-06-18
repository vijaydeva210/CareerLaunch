import { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/accounts/login/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    setUser({ token: response.data.access });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};