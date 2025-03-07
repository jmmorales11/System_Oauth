import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { API_URL_USER } from '../config';
import { AuthContext } from '../context/AuthContext';
import $ from 'jquery';
import 'jquery-validation';

const UsersView = () => {
    const { user: authenticatedUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        mail: '',
        password: '',
        code: '',
        role: 'USER'
    });

    const formRef = useRef(null);

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
                console.log("Usuarios obtenidos:", userData);
            } catch (error) {
                console.error('❌ Error al cargar los usuarios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (showForm) {
            // Add custom validation method for letters only
            $.validator.addMethod("lettersOnly", function(value, element) {
                return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
            }, "Por favor ingrese solo letras");

            $(formRef.current).validate({
                rules: {
                    first_name: {
                        required: true,
                        lettersOnly: true,
                        maxlength: 15,
                    },
                    last_name: {
                        required: true,
                        lettersOnly: true,
                        maxlength: 15,
                    },
                    mail: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: !editingUser,
                        minlength: 8
                    },
                    code: {
                        required: true,
                        minlength: 10,
                        maxlength: 10
                    }
                },
                messages: {
                    first_name: {
                        required: "Por favor ingrese el nombre",
                        lettersOnly: "Por favor ingrese solo letras",
                        maxlength: "El nombre no puede tener más de 15 caracteres"
                    },
                    last_name: {
                        required: "Por favor ingrese el apellido",
                        lettersOnly: "Por favor ingrese solo letras",
                        maxlength: "El apellido no puede tener más de 15 caracteres"
                    },
                    mail: {
                        required: "Por favor ingrese el correo electrónico",
                        email: "Por favor ingrese un correo electrónico válido"
                    },
                    password: {
                        required: "Por favor ingrese la contraseña",
                        minlength: "La contraseña debe tener al menos 8 caracteres"
                    },
                    code: {
                        required: "Por favor ingrese la cédula",
                        minlength: "La cédula debe tener exactamente 10 caracteres",
                        maxlength: "La cédula debe tener exactamente 10 caracteres"
                    }
                },
                errorElement: "div",
                errorPlacement: function (error, element) {
                    error.addClass("invalid-feedback");
                    element.closest(".form-group").append(error);
                },
                highlight: function (element) {
                    $(element).addClass("is-invalid").removeClass("is-valid");
                },
                unhighlight: function (element) {
                    $(element).addClass("is-valid").removeClass("is-invalid");
                }
            });
        }
    }, [showForm, editingUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = async () => {
        if (!$(formRef.current).valid()) return;

        try {
            const response = await axios.post(`${API_URL_USER}/register-user`, newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUsers([...users, response.data]);
            alert("👤 Usuario agregado correctamente.");
            setNewUser({ first_name: '', last_name: '', mail: '', password: '', code: '', role: 'USER' });
            setShowForm(false);
        } catch (error) {
            console.error("❌ Error al agregar el usuario:", error);
            alert("Error al agregar el usuario.");
        }
    };

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

    const handleSaveEdit = async () => {
        if (!$(formRef.current).valid()) return;

        try {
            const userToUpdate = { ...newUser };

            if (authenticatedUser.role === 'USER') {
                delete userToUpdate.password;
                delete userToUpdate.code;
                delete userToUpdate.role;
            } else {
                if (editingUser && (!userToUpdate.password || userToUpdate.password.trim() === "")) {
                    userToUpdate.password = editingUser.password;
                }
            }

            const url =
                authenticatedUser.role === 'ADMIN'
                    ? `${API_URL_USER}/update-admin/${editingUser.id_user}`
                    : `${API_URL_USER}/update-user/${editingUser.id_user}`;

            const response = await axios.put(url, userToUpdate, {
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

    const userId = localStorage.getItem('user_id');
    const usersToDisplay =
        authenticatedUser.role === 'ADMIN'
            ? users
            : users.filter(user => user.id_user === parseInt(userId));

    return (
        <div className="container-fluid mt-4">
            {loading ? (
                <p className="text-center">Cargando usuarios...</p>
            ) : (
                <div className="row">
                    <div className="col-12 col-md-10 mx-auto">
                        <h2 className="text-center mb-4">👥 Gestión de Usuarios</h2>

                        {authenticatedUser.role === 'ADMIN' && (
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Buscar por nombre, apellido o correo"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        )}

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

                        {showForm && (
                            <div className="card p-4">
                                <h3>{editingUser ? "✏️ Editar Usuario" : "➕ Agregar Usuario"}</h3>
                                <form ref={formRef}>
                                    <div className="row">
                                        {authenticatedUser.role === 'USER' ? (
                                            <>
                                                <div className="col-md-6 col-lg-4 mb-3 form-group">
                                                    <label className="form-label">Nombre</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="first_name"
                                                        value={newUser.first_name || ""}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 col-lg-4 mb-3 form-group">
                                                    <label className="form-label">Apellido</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="last_name"
                                                        value={newUser.last_name || ""}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 col-lg-4 mb-3 form-group">
                                                    <label className="form-label">Correo Electrónico</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="mail"
                                                        value={newUser.mail || ""}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {[
                                                    { key: "first_name", label: "Nombre", type: "text" },
                                                    { key: "last_name", label: "Apellido", type: "text" },
                                                    { key: "mail", label: "Correo Electrónico", type: "email" },
                                                    { key: "code", label: "Código", type: "text" }
                                                ].map(({ key, label, type }) => (
                                                    <div className="col-md-6 col-lg-4 mb-3 form-group" key={key}>
                                                        <label className="form-label">{label}</label>
                                                        <input
                                                            type={type}
                                                            className="form-control"
                                                            name={key}
                                                            value={newUser[key] || ""}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                                {!editingUser && (
                                                    <div className="col-md-6 col-lg-4 mb-3 form-group">
                                                        <label className="form-label">Contraseña</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            name="password"
                                                            value={newUser.password || ""}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                <div className="col-md-6 col-lg-4 mb-3 form-group">
                                                    <label className="form-label">Rol</label>
                                                    <select
                                                        className="form-control"
                                                        name="role"
                                                        value={newUser.role || ""}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="USER">Usuario</option>
                                                        <option value="ADMIN">Administrador</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button className="btn btn-primary" onClick={editingUser ? handleSaveEdit : handleCreateUser}>
                                        {editingUser ? "💾 Guardar Cambios" : "➕ Agregar Usuario"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersView;