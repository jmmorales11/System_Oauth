import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_BOOK } from '../config';

const BooksView = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBook, setEditingBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newBook, setNewBook] = useState({ 
        title: '', author: '', language: '', code: '', description: '', 
        physical_state: '', price: '', status: true 
    });

    // Obtener el rol del usuario desde el localStorage
    const userRole = localStorage.getItem('user_role');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(API_URL_BOOK, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                console.log("📚 Libros recibidos de la API:", response.data);
                setBooks(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('❌ Error al cargar los libros:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleCreateBook = async () => {
        try {
            const response = await axios.post(API_URL_BOOK, newBook, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setBooks([...books, response.data]);
            alert("📘 Libro agregado correctamente.");
            setNewBook({ title: '', author: '', language: '', code: '', description: '', physical_state: '', price: '', status: true });
            setShowForm(false);
        } catch (error) {
            console.error("❌ Error al agregar el libro:", error);
            alert("Error al agregar el libro.");
        }
    };

    const handleEditBook = (book) => {
        if (editingBook && editingBook.id_book === book.id_book) {
            setEditingBook(null);
            setShowForm(false);
        } else {
            setEditingBook(book);
            setNewBook(book);
            setShowForm(true);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${API_URL_BOOK}/update/${editingBook.id_book}`, newBook, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setBooks(books.map(book => (book.id_book === editingBook.id_book ? response.data : book)));
            alert("📗 Libro actualizado correctamente.");
            setEditingBook(null);
            setNewBook({ title: '', author: '', language: '', code: '', description: '', physical_state: '', price: '', status: true });
            setShowForm(false);
        } catch (error) {
            console.error("❌ Error al actualizar el libro:", error);
            alert("Error al actualizar el libro.");
        }
    };

    return (
        <div className="container-fluid mt-4">
            {loading ? (
                <p className="text-center">Cargando libros...</p>
            ) : (
                <div className="row">
                    <div className="col-12 col-md-10 mx-auto">
                        <h2 className="text-center mb-4">📚 Gestión de Libros</h2>
                        
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Buscar por código, título o autor"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {userRole === 'ADMIN' && (
                            <button 
                                className="btn btn-success mb-3" 
                                onClick={() => {
                                    if (showForm && !editingBook) {
                                        setShowForm(false);
                                    } else {
                                        setEditingBook(null);
                                        setNewBook({ title: '', author: '', language: '', code: '', description: '', physical_state: '', price: '', status: true });
                                        setShowForm(true);
                                    }
                                }}>
                                {showForm && !editingBook ? "❌ Cerrar Formulario" : "➕ Agregar Libro"}
                            </button>
                        )}

                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Código</th>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Idioma</th>
                                        <th>Estado Físico</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books
                                        .filter(book =>
                                            book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            book.author.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((book) => (
                                            <tr key={book.id_book}>
                                                <td>{book.id_book}</td>
                                                <td>{book.code}</td>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.language}</td>
                                                <td>{book.physical_state}</td>
                                                <td>${book.price}</td>
                                                <td>
                                                    <span className={`badge ${book.status ? "bg-success" : "bg-danger"}`}>
                                                        {book.status ? "Disponible" : "No disponible"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {userRole === 'ADMIN' && (
                                                        <button className="btn btn-warning me-2 mb-1" onClick={() => handleEditBook(book)}>
                                                            {editingBook?.id_book === book.id_book ? "❌ Cerrar Edición" : "✏️ Editar"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {showForm && userRole === 'ADMIN' && (
                            <div className="card p-4">
                                <h3>{editingBook ? "✏️ Editar Libro" : "➕ Agregar Libro"}</h3>
                                <div className="row">
                                    {["code", "title", "author", "language", "description", "physical_state", "price"].map((field) => (
                                        <div className="col-md-6 col-lg-4 mb-3" key={field}>
                                            <label className="form-label">{field.replace("_", " ").toUpperCase()}</label>
                                            <input 
                                                type={field === "price" ? "number" : "text"} 
                                                className="form-control" 
                                                name={field} 
                                                value={newBook[field]} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                    ))}
                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <label className="form-label">Estado</label>
                                        <select 
                                            className="form-control" 
                                            name="status" 
                                            value={newBook.status} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="true">Disponible</option>
                                            <option value="false">No Disponible</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={editingBook ? handleSaveEdit : handleCreateBook}>
                                    {editingBook ? "💾 Guardar Cambios" : "➕ Agregar Libro"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksView;