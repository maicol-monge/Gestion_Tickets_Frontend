import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import Filtro from "../components/Filtro";
import Ticket from "../components/Ticket";
import { AuthContext } from "../context/AuthContext";
import "../styles/MisAsignaciones.css"; // Asegúrate de tener este archivo CSS

const MisAsignaciones = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [idUsuario, setIdUsuario] = useState();
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    if (usuario?.id_usuario) {
      setIdUsuario(usuario.id_usuario);
      console.log("El id del usuario es: " + usuario.id_usuario);
    }
  }, [usuario]);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (!idUsuario) return;

      try {
        const catResponse = await fetch(
          "https://localhost:7106/api/Filtro/obtener-categorias"
        );
        if (!catResponse.ok) throw new Error("Error al cargar categorías");
        const catData = await catResponse.json();
        setCategorias(catData);

        await cargarTickets();
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [idUsuario]);

  const cargarTickets = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Construimos query params con idUsuario y filtros
      const params = new URLSearchParams({ idUsuario });

      // Añadir filtros sólo si tienen valor
      if (filters.estado && filters.estado !== "todos")
        params.append("estado", filters.estado);
      if (filters.prioridad) params.append("prioridad", filters.prioridad);
      if (filters.idCategoria)
        params.append("idCategoria", filters.idCategoria);
      if (filters.mes) params.append("mes", filters.mes);
      if (filters.anio) params.append("anio", filters.anio);
      if (filters.textoBusqueda)
        params.append("textoBusqueda", filters.textoBusqueda);

      const response = await fetch(
        `https://localhost:7106/api/Filtro/mis-asignaciones?${params.toString()}`
      );
      if (!response.ok) throw new Error("Error al cargar asignaciones");
      const data = await response.json();

      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Aquí puedes modificar la función para aplicar filtros adicionales si tu backend lo permite
    cargarTickets(filters);
  };

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((c) => c.id_categoria === idCategoria);
    return categoria ? categoria.nombre_categoria : "Desconocido";
  };

  const getNombreUsuario = (idUsuario) => {
    return `Usuario ${idUsuario}`;
  };

  const formatFecha = (fechaString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fechaString).toLocaleDateString("es-ES", options);
  };

  const getPrioridad = (prioridad) => {
    const prioridades = {
      critico: "Crítico",
      importante: "Importante",
      baja: "Baja",
    };
    return prioridades[prioridad] || prioridad;
  };

  const getEstado = (estado) => {
    return estado === "A" ? "Activo" : "Cerrado";
  };

  return (
    <div className="px-4 asignaciones-container">
      <div className="d-flex justify-content-center pt-3">
        <div style={{ width: "75%" }}>
          <Container className="my-4">
            <h2 className="mb-4">Mis Asignaciones</h2>

            <Filtro onFilterChange={handleFilterChange} />

            <div className="mt-4">
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Cargando asignaciones...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">
                  Error al cargar las asignaciones: {error}
                </Alert>
              ) : tickets.length === 0 ? (
                <Alert variant="info">
                  No se encontraron asignaciones para tu usuario
                </Alert>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {tickets.map((ticket) => (
                    <Ticket
                      key={ticket.id_ticket}
                      titulo={ticket.titulo}
                      fecha={formatFecha(ticket.fecha_creacion)}
                      descripcion={ticket.descripcion}
                      prioridad={getPrioridad(ticket.prioridad)}
                      estado={getEstado(ticket.estado)}
                      asignado={getNombreUsuario(ticket.id_usuario)}
                      categoria={getNombreCategoria(ticket.id_categoria)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MisAsignaciones;
