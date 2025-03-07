import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import 'jquery-validation';
import { API_URL_USER } from '../config';
import '../style/Register.css';

function Register() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      $.validator.addMethod("lettersOnly", function(value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
      }, "Por favor ingrese solo letras");

      $(formRef.current).validate({
        rules: {
          code: { required: true, minlength: 10, maxlength: 10 },
          firstName: { required: true, lettersOnly: true, maxlength: 15 },
          lastName: { required: true, lettersOnly: true, maxlength: 15 },
          email: { required: true, email: true },
          password: { required: true, minlength: 8 }
        },
        messages: {
          code: "El código debe tener 10 caracteres",
          firstName: "Ingrese un nombre válido (solo debe tener letras)",
          lastName: "Ingrese un apellido válido (solo debe tener letras)",
          email: "Ingrese un correo válido",
          password: "La contraseña debe tener al menos 8 caracteres"
        },
        errorElement: "div",
        errorPlacement: function(error, element) {
          error.addClass("invalid-feedback");
          element.closest(".form-group").append(error);
        },
        highlight: function(element) {
          $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
          $(element).addClass("is-valid").removeClass("is-invalid");
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!$(formRef.current).valid()) return;

    setError(null);
    setSuccess(null);

    const userData = {
      code: code,
      first_name: firstName,
      last_name: lastName,
      mail: email,
      password: password,
      role: 'USER',
      status: true,
      failed_attempts: 0
    };

    try {
      await axios.post(`${API_URL_USER}/register-user`, userData);
      setSuccess('¡Usuario registrado correctamente! Serás redirigido al inicio de sesión.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="code">Código:</label>
              <input
                type="text"
                id="code"
                name="code"
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
                name="firstName"
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
                name="lastName"
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
                name="email"
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
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn btn-primary w-100">Registrar</button>
          </form>
          <div className="text-center mt-3">
            <Link 
              to="/" 
              className="btn btn-outline-primary btn-sm px-4 py-2" 
              style={{ 
                borderRadius: '20px', 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;