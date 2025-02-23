import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Importar iconos
import "../style/Footer.css";

function Footer() {
  return (
    <footer className="bg-primary text-white py-4">
      <div className="container">


        <hr className="border-white" />
        <div className="text-center">
          <p className="m-0">© 2025 Biblioteca. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
