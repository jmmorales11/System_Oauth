import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const LoanTable = () => {
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro

    // Cargar los préstamos
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get(`${API_URL}/loan/some-data`);
                setLoans(response.data);
                setFilteredLoans(response.data); // Establecer los préstamos filtrados
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los préstamos:', error);
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    // Filtrar los préstamos
    const filterLoans = (term) => {
        const filtered = loans.filter(loan => {
            // Convertir todos los campos a minúsculas y verificar si contienen el término de búsqueda
            const loanData = `${loan.codeUser} ${loan.user_name} ${loan.user_last_name} ${loan.codeBook} ${loan.author} ${loan.title} ${loan.acquisition_date} ${loan.date_of_devolution || ''}`;
            return loanData.toLowerCase().includes(term.toLowerCase());
        });
        setFilteredLoans(filtered); // Actualizar la lista filtrada
    };

    // Manejar el cambio en el filtro de búsqueda
    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        filterLoans(value); // Filtrar préstamos cada vez que cambia el término de búsqueda
    };

    // Devolver un libro
    const handleReturnBook = async (loanId, returnDate) => {
        try {
            const response = await axios.put(`${API_URL}/loan/returned-book/${loanId}`, {
                date_of_devolution: returnDate
            });

            if (response.status === 200) {
                // Actualizar la tabla tras devolver el libro
                setLoans(loans.filter(loan => loan.id_loan !== loanId));
                setFilteredLoans(filteredLoans.filter(loan => loan.id_loan !== loanId));
                alert('Libro devuelto exitosamente');
            } else {
                alert('Error al devolver el libro');
            }
        } catch (error) {
            alert('Error al intentar devolver el libro');
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            {loading ? (
                <p className="text-center">Cargando préstamos...</p>
            ) : (
                <div>
                    {/* Filtro de búsqueda */}
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar por Cédula, Nombre, Libro..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Código</th>
                                <th>Autor</th>
                                <th>Libro</th>
                                <th>Adquisición</th>
                                <th>Devolución</th>
                                <th>Acciones</th> {/* Columna de acciones */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.map((loan) => (
                                <tr key={loan.id_loan}>
                                    <td>{loan.codeUser}</td>
                                    <td>{loan.user_name}</td>
                                    <td>{loan.user_last_name}</td>
                                    <td>{loan.codeBook}</td>
                                    <td>{loan.author}</td>
                                    <td>{loan.title}</td>
                                    <td>{loan.acquisition_date}</td>
                                    <td>{loan.date_of_devolution || 'Pendiente'}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleReturnBook(loan.id_loan, new Date().toISOString())}
                                        >
                                            Devolver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LoanTable;
