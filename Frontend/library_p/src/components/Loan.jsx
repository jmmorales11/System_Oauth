import React, { useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import UsersTable from "../models/UsersTable";
import BooksTable from "../models/BooksTable";
import DateDisplay from './DateDisplay';
import { API_URL } from '../config';

export default function Loan() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [loanDate, setLoanDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        console.log(" Usuario seleccionado:", user);
    };

    const handleBooksSelect = (books) => {
        setSelectedBooks(books);
        console.log(" Libros seleccionados:", books);
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
            console.error(" Error: Fecha inválida.");
            alert("Formato de fecha incorrecto.");
            return;
        }

        const formattedLoanDate = new Date(loanDate).toISOString().split('T')[0];
        const formattedReturnDate = new Date(returnDate).toISOString().split('T')[0];

        for (const book of selectedBooks) {
            const loanData = {
                acquisition_date: formattedLoanDate,
                date_of_devolution: formattedReturnDate,
                book: { id_book: book.id_book },
                user: { id_user: selectedUser.id_user }
            };

            console.log("Enviando solicitud con:", JSON.stringify(loanData, null, 2));

            try {
                const response = await fetch(`${API_URL}/loan`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loanData)
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("Respuesta exitosa:", data);
                    alert("Préstamo solicitado correctamente.");
                } else {
                    console.error("Error en la respuesta:", data);
                    alert("Error: " + data.message);
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
                    <UsersTable onUserSelect={handleUserSelect} />
                    <BooksTable onBooksSelect={handleBooksSelect} />

                    <button className="btn btn-primary mt-3" onClick={requestLoan}>Solicitar Libro</button>
                </div>
                <Footer />
            </div>
        </>
    );
}
