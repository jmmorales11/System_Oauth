import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaBook,
    FaRecycle,
    FaEnvelope,
    FaUser,
    FaBookOpen,
    FaSignOutAlt,
} from "react-icons/fa";
import "../style/Navbar.css";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Obtener el rol del usuario desde localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem("user_role");
        setUserRole(storedRole);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            // Llamar al backend para cerrar sesión correctamente
            await fetch("http://localhost:9000/logout", {
                method: "GET",
                credentials: "include", // Importante para incluir cookies
            });
    
            // Limpiar almacenamiento local
            localStorage.clear();
    
            // Redirigir al login
            window.location.href = "http://localhost:5173";
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (
        <div className="layout">
            {/* Navbar superior */}
            <nav className="navbar navbar-light bg-primary text-center py-2 w-100 top-navbar">
                <div className="container d-flex justify-content-between align-items-center">
                    <button
                        className="navbar-toggler border-0 d-lg-none"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen ? "true" : "false"}
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list text-white fs-3"></i>
                    </button>
                    <img src="/img/logo_lr.png" alt="Logo" className="logo ms-auto me-1" />
                </div>
            </nav>

            {/* Sidebar */}
            <nav
                className={`sidebar navbar navbar-expand-lg navbar-light bg-primary vh-100 d-flex flex-column align-items-start p-3 fixed-top ${isMenuOpen ? "d-block" : "d-none"
                    } d-md-block`}
            >
                <h1 className="text-white mb-5 d-none d-md-block">Biblioteca</h1>

                <div
                    className={`navbar-collapse ${isMenuOpen ? "d-block" : "d-none"}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/">
                                <FaHome className="me-2" /> Inicio
                            </a>
                            <hr className="border-white" />
                        </li>
                        {(userRole === "USER" || userRole === "ADMIN") && (
                            <li className="nav-item">
                                <a className="nav-link text-white fw-bold" href="/usuarios">
                                    <FaUser className="me-2" /> Usuarios
                                </a>
                                <hr className="border-white" />
                            </li>
                        )}
                        <li className="nav-item">
                            <a className="nav-link text-white fw-bold" href="/contacto">
                                <FaEnvelope className="me-2" /> Contacto
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
                            <a className="nav-link text-white fw-bold" href="/prestamos">
                                <FaBook className="me-2" /> Préstamo
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
                            <button
                                className="nav-link text-white fw-bold btn btn-link"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="me-2" /> Salir
                            </button>
                            <hr className="border-white" />
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;