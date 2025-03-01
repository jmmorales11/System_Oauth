import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL_USER } from '../config';
import '../style/Register.css'; // Importar el archivo CSS personalizado

function Register() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !password || !firstName || !lastName || !email) {
      setFormError('Por favor, complete todos los campos.');
      return;
    }
    setFormError(null);
    try {
      await axios.post(`${API_URL_USER}/register-user`, {
        code: code,
        password: password,
        first_name: firstName,
        last_name: lastName,
        mail: email,
        role: 'USER', // Rol por defecto
        status: true, // Estado por defecto
        failed_attempts: 0, // Intentos fallidos por defecto
      });
      navigate('/login');
    } catch (error) {
      setError('Error al registrar el usuario');
      console.error('Error en registro:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <h3 className="text-center">Registro</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="code">Código:</label>
              <input
                type="text"
                id="code"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="firstName">Nombre:</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="lastName">Apellido:</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {formError && <div className="alert alert-danger">{formError}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Registrar</button>
          </form>
          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-link">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;