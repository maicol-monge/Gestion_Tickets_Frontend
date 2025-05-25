import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import "../styles/Informes.css";
import { AuthContext } from "../context/AuthContext";
import Ticket from "../components/Ticket";

const Informes = () => {
  const { usuario } = useContext(AuthContext);

  const [filtros, setFiltros] = useState({
    fecha: "",
    personal: "",
    categoria: ""
  });

  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar filtros dinámicos: fechas, usuarios, categorías
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [resCategorias, resUsuarios, resFechas] = await Promise.all([
          fetch("https://localhost:7106/api/Filtro/obtener-categorias"),
          fetch("https://localhost:7106/api/Filtro/obtener-usuarios"),
          fetch("https://localhost:7106/api/Filtro/obtener-fechas")
        ]);

        const dataCategorias = await resCategorias.json();
        const dataUsuarios = await resUsuarios.json();
        const dataFechas = await resFechas.json();

        setCategorias(dataCategorias);
        setUsuarios(dataUsuarios);
        setFechasDisponibles(dataFechas);
      } catch (error) {
        console.error("Error al cargar filtros:", error);
      }
    };

    cargarFiltros();
  }, []);

  // Filtrar automáticamente al cambiar filtros
  useEffect(() => {
    obtenerTicketsFiltrados();
    // eslint-disable-next-line
  }, [filtros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerTicketsFiltrados = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filtros.fecha) params.append("fecha", filtros.fecha);
      if (filtros.personal) params.append("personal", filtros.personal);
      if (filtros.categoria) params.append("categoria", filtros.categoria);

      const response = await fetch(`https://localhost:7106/api/Filtro/tickets-todos?${params.toString()}`);
      if (!response.ok) throw new Error("Error al cargar tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (tipoReporte) => {
    const params = new URLSearchParams();

    if (filtros.fecha) params.append("fecha", filtros.fecha);
    if (filtros.personal) params.append("personal", filtros.personal);
    if (filtros.categoria) params.append("categoria", filtros.categoria);

    const url = `https://localhost:7106/api/Informes/generar-pdf-${tipoReporte}?${params.toString()}`;

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error generando PDF:\n" + errorText);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${tipoReporte}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Error inesperado: " + error.message);
    }
  };

  // Utilidades para mostrar datos
  const getNombreCategoria = (nombreCategoria) => nombreCategoria || "Desconocido";
  const getNombreUsuario = (nombreUsuario) => nombreUsuario || "Desconocido";
  const formatFecha = (fechaString) => {
    if (!fechaString) return "";
    return new Date(fechaString).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };
  const getPrioridad = (prioridad) => {
    const prioridades = {
      critico: "Crítico",
      importante: "Importante",
      baja: "Baja",
    };
    return prioridades[prioridad] || prioridad;
  };

  return (
    <div className="informes-container">
      <div className="informes-wrapper">
        <h2>Informes</h2>
        <h5>Filtra y genera reportes:</h5>

        <div className="filtros-box">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3">
              <label>Fecha:</label>
              <select
                name="fecha"
                value={filtros.fecha}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Todas</option>
                {fechasDisponibles.map((f, i) => (
                  <option key={i} value={f}>
                    {new Date(f).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Personal:</label>
              <select
                name="personal"
                value={filtros.personal}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id_usuario} value={`${u.nombre} ${u.apellido}`}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={filtros.categoria}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.nombre_categoria}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mt-3">
            <button className="boton-reporte" onClick={obtenerTicketsFiltrados}>
              Buscar Tickets
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <button className="boton-reporte mx-2" onClick={() => descargarPDF("tendencias")}>
            Tendencias de Problemas
          </button>
          <button className="boton-reporte mx-2" onClick={() => descargarPDF("tiempos")}>
            Tiempos de Resolución
          </button>
          <button className="boton-reporte mx-2" onClick={() => descargarPDF("estadisticas")}>
            Estadísticas Entrantes
          </button>
        </div>


        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p>Cargando tickets...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">Error al cargar los tickets: {error}</Alert>
          ) : tickets.length === 0 ? (
            <p className="text-center">No hay tickets que coincidan con los filtros.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {tickets.map((t) => (
                <Ticket
                  key={t.idTicket}
                  titulo={t.titulo}
                  fecha={formatFecha(t.fechaCreacion)}
                  descripcion={t.descripcion || ""}
                  prioridad={getPrioridad(t.prioridad)}
                  estado={t.estado || ""}
                  asignado={getNombreUsuario(t.nombreUsuario)}
                  categoria={getNombreCategoria(t.nombreCategoria)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Informes;
