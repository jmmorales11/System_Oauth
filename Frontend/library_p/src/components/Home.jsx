import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../style/Footer.css";
import "../index.css";

export default function Home() {
  const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Obtenemos el "code" del query param ?code=...
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");

    setAuthCode(codeParam);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("user_role");
    const storedUserId = localStorage.getItem("user_id");

    const clientId = "oauth-client";
      const clientSecret = "12345678910";
      const redirectUri = "http://localhost:5173/"; // Debe coincidir con la que usaste
  
    if (storedToken && storedRole  && storedUserId) {
      setAccessToken(storedToken);
      setUserRole(storedRole);
      setUserId(storedUserId);
    } else if (authCode) {
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
              redirect_uri: redirectUri,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Error al obtener token: ${response.statusText}`);
          }
  
          const data = await response.json();
          setAccessToken(data.access_token);
          setUserRole(jwtDecode(data.access_token).role);
          setUserId(jwtDecode(data.access_token).user_id);
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("user_role", jwtDecode(data.access_token).role);
          localStorage.setItem("user_id", jwtDecode(data.access_token).user_id);
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchToken();
    }
  }, [authCode]);
  

  return (
    <>
      <div id="root">
        <Navbar />
        <div className="page">
          <h1>Página Home</h1>

          {/* Mostramos el code si existe */}
          {authCode && (
            <p>
              El código de autorización es: <strong>{authCode}</strong>
            </p>
          )}

          {/* Mostramos el token si ya lo obtuvimos */}
          {accessToken && (
            <p>
              Tu Access Token es: <strong>{accessToken}</strong>
            </p>
          )}

          {/* Mostramos el rol si ya lo obtuvimos */}
          {userRole && (
            <p>
              Tu rol es: <strong>{userRole}</strong>
            </p>
          )}

          {/* Mostramos el user_id si ya lo obtuvimos */}
          {userId && (
            <p>
              Tu ID de usuario es: <strong>{userId}</strong>
            </p>
          )}

          {/* Mostramos error si hay alguno */}
          {error && (
            <p style={{ color: "red" }}>Ocurrió un error: {error}</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}