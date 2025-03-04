import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_USER } from '../config';

const UsersTable = ({ onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRole = localStorage.getItem('user_role');
                const userId = localStorage.getItem('user_id');
                const token = localStorage.getItem('access_token');

                let response;

                if (userRole === 'ADMIN') {
                    response = await axios.get(`${API_URL_USER}/some-data`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsers(response.data);
                } else {
                    response = await axios.get(`${API_URL_USER}/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsers([response.data]); // Se envuelve en un array para mantener consistencia
                }

                console.log("Usuarios obtenidos:", response.data); // Agregar console.log para verificar los registros
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            user.id_user.toString().includes(lowercasedSearchTerm) || 
            user.first_name.toLowerCase().includes(lowercasedSearchTerm) ||  
            user.last_name.toLowerCase().includes(lowercasedSearchTerm) ||  
            user.code.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

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

    const userRole = localStorage.getItem('user_role');

    return (
        <div className="container mt-5">
            {loading ? (
                <p className="text-center">Cargando usuarios...</p>
            ) : (
                <div>
                    {userRole === 'ADMIN' && (
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
                    )}

                    {!selectedUser && searchTerm && filteredUsers.length > 0 ? (
                        <ul className="list-group mb-4">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.id_user}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.code} | {user.first_name} {user.last_name}
                                </li>
                            ))}
                        </ul>
                    ) : searchTerm && !selectedUser && filteredUsers.length === 0 ? (
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
                                        <td>{selectedUser.first_name}</td>
                                        <td>{selectedUser.last_name}</td>
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