import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Loan from "./components/Loan";
import ReturnBook from "./components/ReturnBook";
import BooksPage from "./components/BooksPage";
import UserPage from "./components/UserPage";
import Login from "./components/Login";
import Register from "./components/Register";
import PropTypes from "prop-types";

function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  const storedToken = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

  if (loading) return <div>Cargando sesión...</div>; // Esperar a que termine la validación

  // Si no hay token en localStorage o no hay usuario en el contexto, redirigir a "/"
  if (!storedToken || !user) {
    return <Navigate to="/" replace />;
  }

  // Si se especifica un rol y el usuario no lo tiene, redirigir a "/"
  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string, // Rol opcional para verificar
};

// Componente personalizado para la ruta principal
function HomeRoute() {
  const { user } = useContext(AuthContext);

  // Limpiar credenciales si no hay usuario al cargar la ruta principal
  useEffect(() => {
    if (!user) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
    }
  }, [user]);

  // Si hay usuario, redirigir a /home; si no, mostrar Login
  return user ? <Navigate to="/home" replace /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route index path="/" element={<HomeRoute />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />


          {/* Rutas protegidas */}
          <Route
            path="/contacto"
            element={<PrivateRoute><Contact /></PrivateRoute>}
          />
          <Route
            path="/prestamos"
            element={<PrivateRoute><Loan /></PrivateRoute>}
          />
          <Route
            path="/devolver"
            element={<PrivateRoute><ReturnBook /></PrivateRoute>}
          />
          <Route
            path="/usuarios"
            element={<PrivateRoute><UserPage /></PrivateRoute>} // Permitir USER y ADMIN
          />
          <Route
            path="/libros"
            element={<PrivateRoute><BooksPage /></PrivateRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;