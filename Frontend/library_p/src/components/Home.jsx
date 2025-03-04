import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../style/Footer.css";
import "../index.css";

export default function Home() {
  const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Obtenemos el "code" del query param ?code=...
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");

    setAuthCode(codeParam);
  }, []);

  useEffect(() => {
    // 2) Cuando tengamos un code, llamamos al endpoint /oauth2/token
    if (authCode) {
      // Aquí van tus datos de cliente
      const clientId = "oauth-client";
      const clientSecret = "12345678910";
      const redirectUri = "http://localhost:5173/"; // Debe coincidir con la que usaste

      // Función asíncrona para pedir el token
      const fetchToken = async () => {
        try {
          const response = await fetch("http://localhost:9000/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // Autenticación tipo Basic Auth
              Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: authCode,
              redirect_uri: redirectUri,
            }),
          });

          if (!response.ok) {
            // Por ejemplo, si hay un error 400 o 401
            const text = await response.text();
            throw new Error(
              `Error al obtener token. Status: ${response.status} - ${text}`
            );
          }

          const data = await response.json();
          setAccessToken(data.access_token);
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
