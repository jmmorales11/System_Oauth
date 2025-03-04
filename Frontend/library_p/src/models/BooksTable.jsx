import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_BOOK } from '../config';

const BooksTable = ({ onBooksSelect }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);

    // Obtener el rol del usuario desde el localStorage
    const userRole = localStorage.getItem('user_role');

    // Función para obtener los libros desde la API
    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${API_URL_BOOK}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log("📚 Libros recibidos de la API:", response.data); // 🔍 Log de depuración
            if (Array.isArray(response.data)) {
                setBooks(response.data);
            } else {
                console.error("⚠️ La API no devolvió un array:", response.data);
                setBooks([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('❌ Error al cargar los libros:', error);
            setLoading(false);
        }
    };

    // Cargar los libros cuando el componente se monta
    useEffect(() => {
        fetchBooks();
    }, []);

    // Filtrar libros según el término de búsqueda
    const filteredBooks = (books || []).filter(book =>
        book?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book?.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar la selección de libros
    const handleBookSelect = (book) => {
        setSelectedBooks(prevBooks => {
            if (prevBooks.find(b => b.id_book === book.id_book)) {
                console.warn("⚠️ El libro ya está seleccionado:", book);
                return prevBooks;
            }
            const newSelectedBooks = [...prevBooks, book];
            onBooksSelect(newSelectedBooks);
            return newSelectedBooks;
        });
        setSearchTerm('');
    };

    // Manejar la eliminación de un libro seleccionado
    const handleBookRemove = (bookId) => {
        setSelectedBooks(prevBooks => {
            const newSelectedBooks = prevBooks.filter(book => book.id_book !== bookId);
            onBooksSelect(newSelectedBooks);
            return newSelectedBooks;
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-5">
            {loading ? (
                <p className="text-center">Cargando libros...</p>
            ) : (
                <div>
                    <div className="mb-4">
                        <label htmlFor="searchInput" className="form-label">Buscar Libro</label>
                        <input
                            type="text"
                            id="searchInput"
                            className="form-control"
                            placeholder="Buscar por código, título o autor"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Verificar si la API devolvió libros antes de intentar mostrar */}
                    {books.length === 0 && (
                        <p className="text-center text-danger">⚠️ No hay libros disponibles.</p>
                    )}

                    {searchTerm && filteredBooks.length > 0 && (
                        <ul className="list-group mb-4">
                            {filteredBooks.map((book) => (
                                <li
                                    key={book.id_book}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleBookSelect(book)}
                                >
                                    {book.code} | {book.title}
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedBooks.length > 0 && (
                        <div id="book-details" className="card p-4">
                            <h3 className="mb-4">Libros Seleccionados</h3>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Código</th>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBooks.map((book) => (
                                        <tr key={book.id_book}>
                                            <td>{book.id_book}</td>
                                            <td>{book.code}</td>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.description}</td>
                                            <td>{book.status}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleBookRemove(book.id_book)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BooksTable;