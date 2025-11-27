'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

//Definir el Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  //cargar el token y usuario al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
      
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setLoading(false);
      return response.data;

    } catch (error) {
      setLoading(false);
      throw error.response ? error.response.data : new Error('Error de red');
    }
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete axios.defaults.headers.common['Authorization'];
  };

  // Función para actualizar el saldo del usuario
  const updateSaldo = (newSaldo) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, saldo: newSaldo };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  };

  const contextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateSaldo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Muestra un cargador si la carga inicial de datos del token no ha terminado */}
      {loading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};