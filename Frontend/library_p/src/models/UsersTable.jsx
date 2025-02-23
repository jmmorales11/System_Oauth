import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const UsersTable = ({ onUserSelect }) => {  // Recibir la función como prop
    const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
    const [loading, setLoading] = useState(true); // Estado para mostrar carga
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado

    // Función para obtener los usuarios desde la API
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/some-data`);
            const userData = response.data;
            setUsers(userData);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            setLoading(false);
        }
    };

    // Llamada a la API cuando el componente se monta
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtra los usuarios según el término de búsqueda
    const filteredUsers = users.filter(user => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            user.id_user.toString().toLowerCase().includes(lowercasedSearchTerm) || 
            user.user_name.toLowerCase().includes(lowercasedSearchTerm) || 
            user.user_last_name.toLowerCase().includes(lowercasedSearchTerm) || 
            user.code.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    // Maneja la selección de un usuario
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        onUserSelect(user);  // Llamar a la función onUserSelect para pasar el usuario seleccionado
        setSearchTerm('');
    };

    // Maneja el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (selectedUser) {
            setSelectedUser(null);
        }
    };

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

                    {!selectedUser && searchTerm && filteredUsers.length > 0 ? (
                        <ul className="list-group mb-4">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.id_user}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.code}  | {user.user_name} {user.user_last_name} 
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
                                        <th>Grado</th>
                                        <th>Correo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedUser.id_user}</td>
                                        <td>{selectedUser.code}</td>
                                        <td>{selectedUser.role}</td>
                                        <td>{selectedUser.user_name}</td>
                                        <td>{selectedUser.user_last_name}</td>
                                        <td>{selectedUser.grade}</td>
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
