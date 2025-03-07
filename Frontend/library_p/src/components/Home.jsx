import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../style/Footer.css";
import "../index.css";

export default function Home() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <div id="root">
      <Navbar />
      <div className="page">
        <div className="container mt-5">
          <div className="jumbotron text-center">
            <h1 className="display-4">¡Bienvenido a la Biblioteca!</h1>
            {userRole && (
              <p className="lead">
                Gracias por ingresar al sistema. Has iniciado sesión como{" "}
                {userRole === "ADMIN" ? "Administrador" : "Usuario"}.
              </p>
            )}
            <hr className="my-4" />
            <p>
              Utiliza la barra de navegación para acceder a las diferentes
              funcionalidades del sistema.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}