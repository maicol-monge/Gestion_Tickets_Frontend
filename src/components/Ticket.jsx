import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Ticket.css";

const Ticket = ({
  titulo,
  fecha,
  descripcion,
  prioridad,
  estado,
  asignado,
  categoria,
  id_ticket,
  origen,
}) => {
  const navigate = useNavigate();

  const handleVerMas = () => {
    if (origen === "mis-asignaciones") {
      navigate(`/mis-asignaciones/${id_ticket}`);
    } else if (origen === "mis-tickets") {
      navigate(`/seguimiento-cliente/${id_ticket}`);
    } else {
      navigate(`/tickets/${id_ticket}`);
    }
  };

  return (
    <div
      className="container mt-4 py-3 px-5 container-reporte"
      style={{ borderRadius: "10px" }}
    >
      <h3 className="text-white" id="tituloReporte">
        {titulo}
      </h3>
      <p className="text-white text-start">
        <b>ID de Seguimiento: </b>
        {id_ticket}
      </p>
      <nav className="text-start text-white" id="FechaReporte">
        {fecha}
      </nav>

      <div className="d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between">
        <div className="col-8">
          <p className="text-white text-start">
            <b>Descripción: </b>
            {descripcion}
          </p>
        </div>
        <div className="col-4">
          <p className="text-white text-start">
            <b>Prioridad: </b>
            {prioridad}
          </p>
          <p className="text-white text-start">
            <b>Estado: </b>
            {estado}
          </p>
          <p className="text-white text-start">
            <b>Asignado: </b>
            {categoria}
          </p>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between">
        <button
          onClick={handleVerMas}
          className="w-25 text-center p-2 btn-vermas"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default Ticket;
