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

function PrivateRoute({ children}) {
  const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Cargando sesión...</div>; // Evita redirección prematura

    return user ? children : <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

function App() {
  const { user } = useContext(AuthContext);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home /> }/>
          <Route path="/contacto" element={<Contact />} />
          <Route path="/prestamos" element={<Loan />} />
          <Route path="/devolver" element={<ReturnBook />} />
          <Route path="/usuarios" element={<UserPage />} />
          <Route path="/libros" element={<BooksPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;