import React, { useState } from "react";
import { FaHome, FaBook, FaRecycle, FaEnvelope, FaUser, FaBookOpen } from 'react-icons/fa'; // Importar íconos
import "../style/Navbar.css";

function Navbar() {
    // Estado para controlar la visibilidad del menú
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="layout">
            {/* Título en la parte superior */}
            <nav className="navbar navbar-light bg-primary text-center py-2 w-100 top-navbar">
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Ícono de hamburguesa a la izquierda */}
                    <button 
                        className="navbar-toggler border-0 d-lg-none" 
                        type="button" 
                        onClick={toggleMenu} // Cambiar el estado al hacer clic
                        aria-expanded={isMenuOpen ? "true" : "false"} // Cambiar el estado de expansión
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list text-white fs-3"></i>
                    </button>

                    {/* Logo a la derecha con un margen extra */}
                    <img 
                        src="/img/logo_lr.png" 
                        alt="Logo" 
                        className="logo ms-auto me-1"
                    />
                </div>
            </nav>

            {/* Barra lateral de navegación */}
            <nav className={`sidebar navbar navbar-expand-lg navbar-light bg-primary vh-100 d-flex flex-column align-items-start p-3 fixed-top ${isMenuOpen ? 'd-block' : 'd-none'} d-md-block`}>
                {/* Título de la sección */}
                <h1 className="text-white mb-5 d-none d-md-block">Biblioteca</h1>

                {/* Enlaces alineados */}
                <div className={`navbar-collapse ${isMenuOpen ? 'd-block' : 'd-none'}`} id="navbarNav">
                    <ul className="navbar-nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/">
                                <FaHome className="me-2" /> Inicio
                            </a>
                            <hr className="border-white" />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/prestamos">
                                <FaBook className="me-2" /> Préstamo
                            </a>
                            <hr className="border-white" />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/devolver">
                                <FaRecycle className="me-2" /> Devolución
                            </a>
                            <hr className="border-white" />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/usuarios">
                                <FaUser className="me-2" /> Usuarios
                            </a>
                            <hr className="border-white" />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/libros">
                                <FaBookOpen className="me-2" /> Libros
                            </a>
                            <hr className="border-white" />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/contacto">
                                <FaEnvelope className="me-2" /> Contacto
                            </a>
                            <hr className="border-white" />
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
