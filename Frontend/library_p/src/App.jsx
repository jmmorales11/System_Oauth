import { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './components/Home';
import Contact from './components/Contact';
import Loan from './components/Loan';
import ReturnBook from './components/ReturnBook';
import BooksPage from './components/BooksPage';
import UserPage from './components/UserPage';
import Login from './components/Login';
import Register from './components/Register';
import PropTypes from 'prop-types';

function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  const userRole = localStorage.getItem('user_role');
  const roles = ['USER', 'ADMIN']; // Define the roles array

  if (loading) return <div>Cargando sesión...</div>; // Evita redirección prematura

  if (!user) return <Navigate to="/login" replace />;

  if (role && !roles.includes(userRole)) return <Navigate to="/" replace />; // Redirección si el rol no coincide

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

function App() {
  const { user } = useContext(AuthContext);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<PrivateRoute role={['USER', 'ADMIN']}><Contact /></PrivateRoute>} />
          <Route path="/prestamos" element={<PrivateRoute role={['USER', 'ADMIN']}><Loan /></PrivateRoute>} />
          <Route path="/devolver" element={<PrivateRoute role={['USER', 'ADMIN']}><ReturnBook /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute role={['USER', 'ADMIN']}><UserPage /></PrivateRoute>} />
          <Route path="/libros" element={<PrivateRoute role={['USER', 'ADMIN']}><BooksPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
