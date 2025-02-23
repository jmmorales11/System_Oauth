import React, { useEffect } from "react";
import "../index.css";

const DateDisplay = ({ onDateChange }) => {
  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 15);

  // Función para formatear la fecha como "yyyy-mm-dd"
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Pasar las fechas al componente padre cuando el componente se monta
  useEffect(() => {
    if (onDateChange) {
      onDateChange({
        loanDate: formatDate(today),
        returnDate: formatDate(deliveryDate),
      });
    }
  }, [onDateChange]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Fechas Importantes</h2>
      <div className="d-flex justify-content-between mb-2">
        <span className="font-medium">Fecha de Préstamo</span>
        <span className="font-medium">Fecha de Devolución</span>
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control w-25 bord-1"
          value={formatDate(today)}
          readOnly
        />
        <input
          type="text"
          className="form-control w-25"
          value={formatDate(deliveryDate)}
          readOnly
        />
      </div>
    </div>
  );
};

export default DateDisplay;
