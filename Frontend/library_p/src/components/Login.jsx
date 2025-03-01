import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/Login.css'; // Importar el archivo CSS personalizado

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError('Por favor, complete todos los campos.');
      return;
    }
    setFormError(null);
    await login(username, password);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h3 className="text-center">Iniciar sesión</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
          <div className="text-center mt-3">
            <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;