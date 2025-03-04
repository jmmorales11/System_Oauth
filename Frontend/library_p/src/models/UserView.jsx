import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL_USER } from '../config';
import { AuthContext } from '../context/AuthContext';

const UsersView = () => {
    const { user: authenticatedUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '', last_name: '', mail: '', password: '', code: '', role: 'USER'
    });

    // Obtener usuarios desde la API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRole = localStorage.getItem('user_role');
                const userId = localStorage.getItem('user_id');
                let response;

                if (userRole === 'ADMIN') {
                    response = await axios.get(`${API_URL_USER}/some-data`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                } else {
                    response = await axios.get(`${API_URL_USER}/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                }

                const userData = Array.isArray(response.data) ? response.data : [response.data];
                setUsers(userData);
                console.log("Usuarios obtenidos:", userData); // Agregar console.log para verificar los registros
            } catch (error) {
                console.error('❌ Error al cargar los usuarios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Crear nuevo usuario
    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${API_URL_USER}/register-user`, newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUsers([...users, response.data]); // Agregar usuario a la tabla
            alert("👤 Usuario agregado correctamente.");
            setNewUser({ first_name: '', last_name: '', mail: '', password: '', code: '', role: 'USER' });
            setShowForm(false);
        } catch (error) {
            console.error("❌ Error al agregar el usuario:", error);
            alert("Error al agregar el usuario.");
        }
    };

    // Editar usuario
    const handleEditUser = (user) => {
        if (editingUser && editingUser.id_user === user.id_user) {
            setEditingUser(null);
            setShowForm(false);
        } else {
            setEditingUser(user);
            setNewUser(user);
            setShowForm(true);
        }
    };

    // Guardar edición
    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${API_URL_USER}/update-user/${editingUser.id_user}`, newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUsers(users.map(user => (user.id_user === editingUser.id_user ? response.data : user)));
            alert("✅ Usuario actualizado correctamente.");
            setEditingUser(null);
            setNewUser({ first_name: '', last_name: '', mail: '', password: '', code: '', role: 'USER' });
            setShowForm(false);
        } catch (error) {
            console.error("❌ Error al actualizar el usuario:", error);
            alert("Error al actualizar el usuario.");
        }
    };

    // Filtrar usuarios según el rol del usuario autenticado
    const userId = localStorage.getItem('user_id');
    const usersToDisplay = authenticatedUser.role === 'ADMIN' ? users : users.filter(user => user.id_user === parseInt(userId));

    return (
        <div className="container-fluid mt-4">
            {loading ? (
                <p className="text-center">Cargando usuarios...</p>
            ) : (
                <div className="row">
                    <div className="col-12 col-md-10 mx-auto">
                        <h2 className="text-center mb-4">👥 Gestión de Usuarios</h2>

                        {/* Filtro de búsqueda */}
                        {authenticatedUser.role === 'ADMIN' && (
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Buscar por nombre, apellido o correo"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        )}

                        {/* Botón para agregar usuario */}
                        {authenticatedUser.role === 'ADMIN' && (
                            <button
                                className="btn btn-success mb-3"
                                onClick={() => {
                                    if (showForm && !editingUser) {
                                        setShowForm(false);
                                    } else {
                                        setEditingUser(null);
                                        setNewUser({ first_name: '', last_name: '', mail: '', password: '', code: '', role: 'USER' });
                                        setShowForm(true);
                                    }
                                }}>
                                {showForm && !editingUser ? "❌ Cerrar Formulario" : "➕ Agregar Usuario"}
                            </button>
                        )}

                        {/* Tabla de usuarios */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Correo Electrónico</th>
                                        <th>Código</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersToDisplay
                                        .filter(user =>
                                            (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (user.mail || '').toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((user) => (
                                            <tr key={user.id_user}>
                                                <td>{user.id_user}</td>
                                                <td>{user.first_name}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.mail}</td>
                                                <td>{user.code}</td>
                                                <td>
                                                    <button className="btn btn-warning me-2" onClick={() => handleEditUser(user)}>
                                                        {editingUser?.id_user === user.id_user ? "❌ Cerrar Edición" : "✏️ Editar"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Formulario de agregar/editar usuario */}
                        {showForm && (
                            <div className="card p-4">
                                <h3>{editingUser ? "✏️ Editar Usuario" : "➕ Agregar Usuario"}</h3>
                                <div className="row">
                                    {[
                                        { key: "first_name", label: "Nombre" },
                                        { key: "last_name", label: "Apellido" },
                                        { key: "mail", label: "Correo Electrónico", type: "email" },
                                        { key: "password", label: "Contraseña", type: "password" },
                                        { key: "code", label: "Código" }
                                    ].map(({ key, label, type = "text" }) => (
                                        <div className="col-md-6 col-lg-4 mb-3" key={key}>
                                            <label className="form-label">{label}</label>
                                            <input
                                                type={type}
                                                className="form-control"
                                                name={key}
                                                value={newUser[key]}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                    {authenticatedUser.role === 'ADMIN' && (
                                        <div className="col-md-6 col-lg-4 mb-3">
                                            <label className="form-label">Rol</label>
                                            <select
                                                className="form-control"
                                                name="role"
                                                value={newUser.role}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <button className="btn btn-primary" onClick={editingUser ? handleSaveEdit : handleCreateUser}>
                                    {editingUser ? "💾 Guardar Cambios" : "➕ Agregar Usuario"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersView;