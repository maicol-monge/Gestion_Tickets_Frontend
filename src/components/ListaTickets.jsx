import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import Filtro from "./Filtro";
import Ticket from "./Ticket";

const ListaTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  //const [usuario, setUsuario] = useState();

  // Función para cargar tickets con filtros
  const cargarTickets = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();

      // Asegúrate que los nombres coincidan con el backend
      if (filters.estado) params.append("estado", filters.estado);
      if (filters.prioridad) params.append("prioridad", filters.prioridad);
      if (filters.idCategoria)
        params.append("idCategoria", filters.idCategoria);
      if (filters.mes) params.append("mes", filters.mes);
      if (filters.anio) params.append("anio", filters.anio);
      if (filters.textoBusqueda)
        params.append("textoBusqueda", filters.textoBusqueda);

      const url = `https://localhost:7106/api/Filtro/buscar?${params.toString()}`;
      console.log("URL de búsqueda:", url); // Para depuración
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales (tickets, categorías y usuarios)
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Cargar categorías
        const catResponse = await fetch(
          "https://localhost:7106/api/Filtro/obtener-categorias"
        );
        if (!catResponse.ok) throw new Error("Error al cargar categorías");
        const catData = await catResponse.json();
        setCategorias(catData);

        // Cargar tickets iniciales
        await cargarTickets();
      } catch (err) {
        setError(err.message);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Manejar cambio de filtros
  const handleFilterChange = (filters) => {
    cargarTickets(filters);
  };

  // Obtener nombre de categoría por ID
  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((c) => c.id_categoria === idCategoria);
    return categoria ? categoria.nombre_categoria : "Desconocido";
  };

  // Obtener nombre de usuario por ID (simulado)
  const getNombreUsuario = (idUsuario) => {
    return `Usuario ${idUsuario}`;
  };

  // Formatear fecha
  const formatFecha = (fechaString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fechaString).toLocaleDateString("es-ES", options);
  };

  // Traducir prioridad
  const getPrioridad = (prioridad) => {
    const prioridades = {
      critico: "Crítico",
      importante: "Importante",
      baja: "Baja",
    };
    return prioridades[prioridad] || prioridad;
  };

  // Traducir estado
  const getEstado = (estado) => {
    return estado === "A" ? "Activo" : "Cerrado";
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Gestión de Tickets</h2>

      {/* Componente de Filtro */}
      <Filtro onFilterChange={handleFilterChange} />

      {/* Resultados */}
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
          <Alert variant="info">
            No se encontraron tickets con los filtros seleccionados
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
  );
};

export default ListaTickets;
