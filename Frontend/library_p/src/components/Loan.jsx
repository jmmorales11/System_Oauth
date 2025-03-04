import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import UsersTable from "../models/UsersTable";
import BooksTable from "../models/BooksTable";
import DateDisplay from './DateDisplay';
import { API_URL_LOAN } from '../config';

export default function Loan() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [loanDate, setLoanDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        const userId = localStorage.getItem('user_id');
        setUserRole(role);

        if (role === 'USER') {
            setSelectedUser({ id_user: parseInt(userId) });
        }
    }, []);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        console.log("Usuario seleccionado:", user);
    };

    const handleBooksSelect = (books) => {
        setSelectedBooks(books);
        console.log("Libros seleccionados:", books);
    };

    const handleDateChange = (dates) => {
        setLoanDate(dates.loanDate);
        setReturnDate(dates.returnDate);
        console.log("Fechas seleccionadas:", dates);
    };

    const requestLoan = async () => {
        if (!selectedUser || selectedBooks.length === 0 || !loanDate || !returnDate) {
            alert("Por favor, seleccione un usuario, al menos un libro y las fechas.");
            return;
        }

        if (isNaN(Date.parse(loanDate)) || isNaN(Date.parse(returnDate))) {
            console.error("Error: Fecha inválida.");
            alert("Formato de fecha incorrecto.");
            return;
        }

        const formattedReturnDate = new Date(returnDate).toISOString().split('T')[0];
        const token = localStorage.getItem('access_token'); // Obtener el token del localStorage

        for (const book of selectedBooks) {
            const loanData = {
                userId: selectedUser.id_user, 
                bookId: book.id_book,
                dateOfDevolution: formattedReturnDate
            };

            console.log("Enviando solicitud con:", JSON.stringify(loanData, null, 2));

            try {
                const response = await fetch(`${API_URL_LOAN}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Incluir el token en los encabezados
                    },
                    body: JSON.stringify(loanData)
                });

                const textResponse = await response.text();
                console.log("Respuesta completa del servidor:", textResponse);

                let data;
                try {
                    data = JSON.parse(textResponse);
                } catch (parseError) {
                    console.error("Error al analizar la respuesta como JSON:", parseError);
                    alert("El libro ya no se encuentra disponible para préstamo");
                    return;
                }

                if (response.ok) {
                    console.log("Respuesta exitosa:", data);
                    alert("Préstamo solicitado correctamente.");
                } else {
                    console.error("Error en la respuesta:", data);
                    alert("Error: " + (data.message || "Solicitud fallida."));
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Error en la solicitud: " + error.message);
            }
        }
    };

    return (
        <>
            <div id="root">
                <Navbar />
                <div className="page">
                    <h1 className="text-center">Préstamo</h1>

                    <DateDisplay onDateChange={handleDateChange} />
                    {userRole === 'ADMIN' && <UsersTable onUserSelect={handleUserSelect} />}
                    <BooksTable onBooksSelect={handleBooksSelect} />

                    <button className="btn btn-primary mt-3" onClick={requestLoan}>
                        Solicitar Libro
                    </button>
                </div>
                <Footer />
            </div>
        </>
    );
}