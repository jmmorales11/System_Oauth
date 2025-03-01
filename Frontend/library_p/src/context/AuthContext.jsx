import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_USER } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Para evitar redirecciones incorrectas
  useEffect(() => {
    const checkUserSession = async () => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                
                // Evita actualizar el estado si el usuario ya está configurado
                if (!user || user.id_user !== userData.id_user) {
                    const response = await axios.get(`${API_URL_USER}/${userData.id_user}`);
                    if (response.data && response.data.id_user === userData.id_user) {
                        setUser(response.data);
                    } else {
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error validando sesión:', error);
                localStorage.removeItem('user');
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
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setError(null);
    } catch (error) {
      setError('Credenciales inválidas');
      console.error('Error en login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return <div>Cargando sesión...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
