import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const BooksTable = ({ onBooksSelect }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/book`);
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los libros:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBookSelect = (book) => {
        setSelectedBooks(prevBooks => {
            const newSelectedBooks = [...prevBooks, book];
            onBooksSelect(newSelectedBooks);
            return newSelectedBooks;
        });
        setSearchTerm('');
    };

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

                    {searchTerm && filteredBooks.length > 0 && (
                        <ul className="list-group mb-4">
                            {filteredBooks.map((book) => (
                                <li
                                    key={book.id_book}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleBookSelect(book)}
                                >
                                    {book.code} |   {book.title}
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
                                        <th>Acciones</th> {/* Nueva columna */}
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
                                                    onClick={() => handleBookRemove(book.id_book)} // Eliminar el libro
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
