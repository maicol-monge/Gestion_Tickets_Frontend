import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import '../styles/Estadisticas.css';

const Estadisticas = () => {
  const [resumen, setResumen] = useState({
    abiertos: 0,
    cerrados: 0,
    enProgreso: 0,
    enEspera: 0,
    resueltos: 0,
    asignados: 0,
    desasignados: 0
  });

  const [tendencias, setTendencias] = useState([]);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await axios.get('https://localhost:7106/api/estadistica/resumen-tickets');
        setResumen(response.data);
      } catch (error) {
        console.error("Error al obtener resumen de tickets:", error);
      }
    };

    const fetchTendencias = async () => {
      try {
        const response = await axios.get('https://localhost:7106/api/estadistica/tendencias');
        const datosFormateados = response.data.map(d => ({
          ...d,
          MesAnio: `${d.mes}/${d.anio}`,
          Total: (d.abiertos || 0) + (d.cerrados || 0),
          Abiertos: d.abiertos || 0,
          Cerrados: d.cerrados || 0
        }));
        setTendencias(datosFormateados);
      } catch (error) {
        console.error("Error al obtener tendencias:", error);
      }
    };

    fetchResumen();
    fetchTendencias();

    // Refrescar cada 30 segundos
    const interval = setInterval(() => {
      fetchResumen();
      fetchTendencias();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="asignaciones-container">
      <main className="main-content">
        <h2 className="text-center">Estado General de los Tickets</h2>
        <div className="text-center mt-4">
            <Link to="/informes" className="btn btn-primary">
                Informes
            </Link>
        </div>

        <div className="card shadow p-4 text-center mt-4">
          <h5 className="mb-4"><strong>Detalles en tiempo real:</strong></h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets Abiertos:</label>
              <input type="text" className="form-control text-center" value={resumen.abiertos} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets Cerrados:</label>
              <input type="text" className="form-control text-center" value={resumen.cerrados} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets en Progreso:</label>
              <input type="text" className="form-control text-center" value={resumen.enProgreso} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets en Espera de Cliente:</label>
              <input type="text" className="form-control text-center" value={resumen.enEspera} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets Resueltos:</label>
              <input type="text" className="form-control text-center" value={resumen.resueltos} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets Asignados:</label>
              <input type="text" className="form-control text-center" value={resumen.asignados} readOnly />
            </div>
            <div className="col-md-3 mb-3">
              <label>Cantidad de Tickets Desasignados:</label>
              <input type="text" className="form-control text-center" value={resumen.desasignados} readOnly />
            </div>
          </div>
        </div>

        {/* La gráfica solo se mostrará si hay un endpoint real de tendencias */}
        <div className="mt-5">
          <h5 className="text-center">Tendencias de Tickets</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tendencias}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="MesAnio" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Total" stroke="#007bff" strokeWidth={2} name="Total Tickets" />
              <Line type="monotone" dataKey="Abiertos" stroke="#28a745" strokeWidth={2} name="Abiertos" />
              <Line type="monotone" dataKey="Cerrados" stroke="#dc3545" strokeWidth={2} name="Cerrados" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
};

export default Estadisticas;
