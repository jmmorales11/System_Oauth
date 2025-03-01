import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL_USER } from '../config';
import { AuthContext } from '../context/AuthContext';

const UsersTable = ({ onUserSelect }) => {
    const { user: authenticatedUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL_USER}/some-data`);
            const userData = Array.isArray(response.data) ? response.data : [];
            setUsers(userData);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = (users || []).filter(user => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            user?.id_user?.toString().toLowerCase().includes(lowercasedSearchTerm) || 
            user?.first_name?.toLowerCase().includes(lowercasedSearchTerm) ||  // ← Corregido
            user?.last_name?.toLowerCase().includes(lowercasedSearchTerm) ||  // ← Corregido
            user?.code?.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    useEffect(() => {
        console.log("Usuarios cargados:", users);
        console.log("Usuarios filtrados:", filteredUsers);
    }, [users, filteredUsers]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (onUserSelect) onUserSelect(user);
        setSearchTerm('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (selectedUser) {
            setSelectedUser(null);
        }
    };

    const usersToDisplay = authenticatedUser.role === 'ADMIN' ? filteredUsers : filteredUsers.filter(user => user.id_user === authenticatedUser.id_user);

    return (
        <div className="container mt-5">
            {loading ? (
                <p className="text-center">Cargando usuarios...</p>
            ) : (
                <div>
                    <div className="mb-4">
                        <label htmlFor="searchInput" className="form-label">Buscar Usuario</label>
                        <input
                            type="text"
                            id="searchInput"
                            className="form-control"
                            placeholder="Buscar por cédula, nombre, apellido o código"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {!selectedUser && searchTerm && usersToDisplay.length > 0 ? (
                        <ul className="list-group mb-4">
                            {usersToDisplay.map((user) => (
                                <li
                                    key={user.id_user}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.code} | {user.first_name} {user.last_name} {/* ← Corregido */}
                                </li>
                            ))}
                        </ul>
                    ) : searchTerm && !selectedUser && usersToDisplay.length === 0 ? (
                        <p>No se encontraron resultados.</p>
                    ) : null}

                    {selectedUser && (
                        <div id="user-details" className="card p-4">
                            <h3 className="mb-4">Detalles del Usuario Seleccionado</h3>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Código</th>
                                        <th>Tipo de usuario</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Correo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedUser.id_user}</td>
                                        <td>{selectedUser.code}</td>
                                        <td>{selectedUser.role}</td>
                                        <td>{selectedUser.first_name}</td> {/* ← Corregido */}
                                        <td>{selectedUser.last_name}</td>  {/* ← Corregido */}
                                        <td>{selectedUser.mail}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UsersTable;