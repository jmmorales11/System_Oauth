import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL_LOAN } from '../config';

const LoanTable = () => {
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Obtener datos del usuario desde el localStorage
    const userRole = localStorage.getItem('user_role');
    const userId = localStorage.getItem('user_id');

    // Cargar los préstamos según el rol
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                let response;
                if (userRole === 'ADMIN') {
                    response = await axios.get(`${API_URL_LOAN}/some-data`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
                    });
                } else {
                    response = await axios.get(`${API_URL_LOAN}/some-data/${userId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
                    });
                }

                console.log("📋 Préstamos recibidos:", response.data);

                const data = Array.isArray(response.data) ? response.data : [response.data];
                const filteredData = data.filter(loan => !loan.confirm_devolution);
                setLoans(filteredData);
                setFilteredLoans(filteredData);
            } catch (error) {
                console.error('❌ Error al cargar los préstamos:', error);
                setLoans([]);
                setFilteredLoans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [userRole, userId]);

    // Filtrar préstamos (solo para ADMIN)
    useEffect(() => {
        if (userRole === 'ADMIN') {
            const filtered = loans.filter(loan => {
                const loanData = `${loan.codeUser} ${loan.user_name} ${loan.user_last_name} ${loan.codeBook} ${loan.author} ${loan.title} ${loan.acquisition_date} ${loan.date_of_devolution || ''}`;
                return loanData.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setFilteredLoans(filtered);
        }
    }, [searchTerm, loans, userRole]);

    // Manejar cambio en el filtro de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Devolver un libro
    const handleReturnBook = async (loanId) => {
        const formattedDate = new Date().toISOString().split('T')[0];

        try {
            const response = await axios.put(`${API_URL_LOAN}/returned-book/${loanId}`, {
                date_of_devolution: formattedDate
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            if (response.status === 200) {
                const updatedLoans = loans.filter(loan => loan.id_loan !== loanId);
                setLoans(updatedLoans);
                setFilteredLoans(updatedLoans);
                alert('📚 Libro devuelto exitosamente');
            } else {
                alert('⚠️ Error al devolver el libro');
            }
        } catch (error) {
            alert('❌ Error al intentar devolver el libro');
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            {loading ? (
                <p className="text-center">Cargando préstamos...</p>
            ) : (
                <div>
                    {/* Filtro de búsqueda solo para ADMIN */}
                    {userRole === 'ADMIN' && (
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Buscar por Cédula, Nombre, Libro..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    )}

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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map((loan) => (
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
                                                onClick={() => handleReturnBook(loan.id_loan)}
                                            >
                                                Devolver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted">
                                        No hay préstamos disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LoanTable;
