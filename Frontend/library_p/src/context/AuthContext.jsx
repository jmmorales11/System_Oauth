import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { API_URL_USER } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Para evitar redirecciones incorrectas

  useEffect(() => {
    const checkUserSession = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          setUser({ token: storedToken, role: decodedToken.role });
        } catch (error) {
          console.error('Error validando sesión:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_role');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUserSession();
  }, []); // 🚀 Se ejecuta solo una vez al montar el componente

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL_USER}/login`, {
        code: username,
        password: password,
      });
      const userData = response.data;
      const decodedToken = jwtDecode(userData.access_token);
      setUser({ token: userData.access_token, role: decodedToken.role });
      localStorage.setItem('access_token', userData.access_token);
      localStorage.setItem('user_role', decodedToken.role);
      setError(null);
    } catch (error) {
      setError('Credenciales inválidas');
      console.error('Error en login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  };

  if (loading) return <div>Cargando sesión...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};