import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../style/Login.css";

export default function Login() {
  const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configuración del OAuth2
  const clientId = "oauth-client";
  const clientSecret = "12345678910";
  const redirectUri = "http://localhost:5173/login"; // Redirige de vuelta a /login
  const authServerUrl = "http://localhost:9000/oauth2/authorize"; // URL del auth server

  // 1) Verificar si ya hay un token almacenado
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("user_role");
    const storedUserId = localStorage.getItem("user_id");

    // Solo redirigir si hay un token válido y el usuario no está intentando iniciar sesión de nuevo
    if (storedToken && storedRole && storedUserId && !authCode) {
      setAccessToken(storedToken);
      setUserRole(storedRole);
      setUserId(storedUserId);
      navigate("/home"); // Redirigir a /home si ya está autenticado
    }
  }, [navigate, authCode]);

  // 2) Obtener el "code" de la URL si el auth server redirige de vuelta
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");

    if (codeParam) {
      setAuthCode(codeParam);
      // Limpiar los parámetros de la URL después de obtener el code
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // 3) Obtener el token usando el code
  useEffect(() => {
    if (authCode) {
      const fetchToken = async () => {
        try {
          const response = await fetch("http://localhost:9000/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: authCode,
              redirect_uri: redirectUri, // Enviar redirect_uri en el cuerpo, no en la URL de autorización
            }),
          });

          if (!response.ok) {
            throw new Error(`Error al obtener token: ${response.statusText}`);
          }

          const data = await response.json();
          const decodedToken = jwtDecode(data.access_token);

          setAccessToken(data.access_token);
          setUserRole(decodedToken.role);
          setUserId(decodedToken.user_id);

          // Guardar en localStorage
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("user_role", decodedToken.role);
          localStorage.setItem("user_id", decodedToken.user_id);

          // Redirigir a /home después de obtener el token
          navigate("/home");
        } catch (err) {
          setError(err.message);
        }
      };

      fetchToken();
    }
  }, [authCode, navigate]);

  // 4) Función para redirigir al auth server manualmente
  const handleAuthServerLogin = () => {
    // Ajustar la URL de autorización: scope=read y sin redirect_uri
    const authUrl = `${authServerUrl}?response_type=code&client_id=${clientId}&scope=read`;
    window.location.href = authUrl;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h3 className="text-center">Bienvenido</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {authCode ? (
            <p className="text-center">Procesando autenticación...</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              <button
                className="btn btn-primary w-100"
                onClick={handleAuthServerLogin}
              >
                Iniciar sesión con Auth Server
              </button>
              <Link to="/register" className="btn btn-secondary w-100">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}