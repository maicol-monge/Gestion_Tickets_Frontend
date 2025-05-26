import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/Filtro.css";

const Filtro = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    estado: "todos",
    prioridad: "",
    idCategoria: "",
    mes: "",
    anio: "",
    textoBusqueda: "",
    id_ticket: "", // <-- agrega esto
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anios, setAnios] = useState([]);

  useEffect(() => {
    const fetchAnios = async () => {
      try {
        // Cambia la URL por la de tu API
        const response = await fetch(
          "https://localhost:7106/api/Filtro/obtener-anio-mas-antiguo"
        );
        // El endpoint retorna un número, es decir, el año más antiguo
        const anioMasAntiguo = await response.json();
        const currentYear = new Date().getFullYear();
        // Se construye el arreglo agregando en primer lugar la opción "todos"
        const years = [{ value: "", label: "todos" }];
        // Se recorre desde el año más antiguo hasta el año actual
        for (let year = anioMasAntiguo; year <= currentYear; year++) {
          years.push({ value: year, label: year });
        }
        setAnios(years);
      } catch (error) {
        console.error("Error al consultar el año más antiguo:", error);
      }
    };

    fetchAnios();
  }, []);

  // Obtener categorías de la API al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          "https://localhost:7106/api/Filtro/obtener-categorias"
        );
        if (!response.ok) {
          throw new Error("Error al obtener categorías");
        }
        const data = await response.json();

        // Mapear los datos de la API al formato que espera tu componente
        const categoriasFormateadas = data.map((cat) => ({
          value: cat.id_categoria,
          label: cat.nombre_categoria, // Asumiendo que hay un campo 'nombre' en tu modelo
        }));

        // Agregar la opción "todos" al principio
        setCategorias([
          { value: "", label: "todos" },
          ...categoriasFormateadas,
        ]);
      } catch (error) {
        console.error("Error:", error);
        // Opción de respaldo en caso de error
        setCategorias([
          { value: "", label: "todos" },
          { value: 1, label: "ventas" },
          { value: 2, label: "compras" },
          { value: 3, label: "marketing" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const prioridades = [
    { value: "", label: "todos" },
    { value: "critico", label: "crítico" },
    { value: "importante", label: "importante" },
    { value: "baja", label: "baja" },
  ];

  const meses = [
    { value: "", label: "todos" },
    { value: 1, label: "enero" },
    { value: 2, label: "febrero" },
    { value: 3, label: "marzo" },
    { value: 4, label: "abril" },
    { value: 5, label: "mayo" },
    { value: 6, label: "junio" },
    { value: 7, label: "julio" },
    { value: 8, label: "agosto" },
    { value: 9, label: "septiembre" },
    { value: 10, label: "octubre" },
    { value: 11, label: "noviembre" },
    { value: 12, label: "diciembre" },
  ];

  //const anios = obtenerAnios();

  // const anios = [
  //   { value: "", label: "todos" },
  //   { value: 2023, label: 2023 },
  //   { value: 2024, label: 2024 },
  //   { value: 2025, label: 2025 },
  // ];

  const handleEstadoChange = (nuevoEstado) => {
    const newFilters = { ...filters, estado: nuevoEstado };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const newFilters = { ...filters, [id]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBuscarChange = (e) => {
    const { value } = e.target;
    const newFilters = { ...filters, textoBusqueda: value };
    setFilters(newFilters);
  };

  const handleBuscarSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="mt-5">
      <div
        className="d-flex justify-content-center align-items-center p-3"
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          onSubmit={handleBuscarSubmit}
          className="row g-3"
          style={{ width: "100%" }}
        >
          <nav className="text-start">Filtros</nav>

          {/* Contenedor principal responsive */}
          <div className="d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between">
            {/* Filtro Activo/Todos */}
            <div className="d-flex align-items-center gap-2">
              {/* Botón para "Activos" */}
              <label
                className={`filtro-toggle ${filters.estado === "activos" ? "activo" : ""
                  }`}
                onClick={() => handleEstadoChange("activos")}
                style={{ cursor: "pointer" }}
              >
                Activos
                {/* Si necesitas actualizar el input, éste se puede ocultar */}
                <input
                  type="radio"
                  name="estado"
                  value="activos"
                  checked={filters.estado === "activos"}
                  onChange={() => { }}
                  style={{ display: "none" }}
                />
              </label>

              {/* Botón para "Todos" */}
              <label
                className={`filtro-toggle ${filters.estado === "todos" ? "activo" : ""
                  }`}
                onClick={() => handleEstadoChange("todos")}
                style={{ cursor: "pointer" }}
              >
                Todos
                <input
                  type="radio"
                  name="estado"
                  value="todos"
                  checked={filters.estado === "todos"}
                  onChange={() => { }}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* Prioridad y Categoría */}
            <div className="d-flex flex-column gap-2 mb-3 mb-md-0">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                <Form.Label htmlFor="prioridad" className="m-0">
                  Prioridad:
                </Form.Label>
                <Form.Select
                  id="prioridad"
                  value={filters.prioridad}
                  onChange={handleInputChange}
                >
                  {prioridades.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                <Form.Label htmlFor="idCategoria" className="m-0">
                  Categoría:
                </Form.Label>
                <Form.Select
                  id="idCategoria"
                  value={filters.idCategoria}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {categorias.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>

            {/* Mes y Año */}
            <div className="d-flex flex-column gap-2 mb-3 mb-md-0">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                <Form.Label htmlFor="mes" className="m-0">
                  Mes:
                </Form.Label>
                <Form.Select
                  id="mes"
                  value={filters.mes}
                  onChange={handleInputChange}
                  style={{ minWidth: "20vh" }}
                >
                  {meses.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                <Form.Label htmlFor="anio" className="m-0">
                  Año:
                </Form.Label>
                <Form.Select
                  id="anio"
                  value={filters.anio}
                  onChange={handleInputChange}
                  style={{ minWidth: "20vh" }}
                >
                  {anios.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </div>

          {/* Campo Buscar */}
          <div className="d-flex flex-column flex-sm-row align-items-center gap-2 mt-3 col-12">
            <Form.Label htmlFor="textoBusqueda" className="m-0">
              Buscar:
            </Form.Label>
            <Form.Control
              className="w-25"
              type="number"
              id="id_ticket"
              value={filters.id_ticket || ""}
              onChange={(e) =>
                setFilters({ ...filters, id_ticket: e.target.value })
              }
              placeholder="ID"
              min={1}
            />
            <Form.Control
              type="text"
              id="textoBusqueda"
              value={filters.textoBusqueda}
              onChange={handleBuscarChange}
              placeholder="Buscar por título o descripción"
            />

            <Button variant="primary" type="submit">
              Buscar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Filtro;
