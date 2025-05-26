import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import "../styles/Informes.css";
import { AuthContext } from "../context/AuthContext";
import Ticket from "../components/Ticket";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import logoEmpresa from "../assets/logo_sistema.png"; // Asegúrate de descargar el logo y guardarlo en src/assets
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    fecha: "",
    personal: "",
    categoria: "",
  });

  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Cargar filtros dinámicos: fechas, usuarios, categorías
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [resCategorias, resUsuarios, resFechas] = await Promise.all([
          fetch("https://localhost:7106/api/Filtro/obtener-categorias"),
          fetch("https://localhost:7106/api/Filtro/obtener-tecnicos"),
          fetch("https://localhost:7106/api/Filtro/obtener-fechas"),
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

      const response = await fetch(
        `https://localhost:7106/api/Filtro/tickets-todos?${params.toString()}`
      );
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

  const generarPdf = async (tipoReporte, filtros) => {
    if (!tickets || tickets.length === 0) {
      // Mejor diseño usando un modal simple de Bootstrap
      const alerta = document.createElement("div");
      alerta.className =
        "alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3 shadow";
      alerta.style.zIndex = 9999;
      alerta.style.width = "fit-content";
      alerta.innerHTML = `
      <strong>¡Atención!</strong> No hay tickets que coincidan con los filtros. No se puede generar el PDF.
    `;
      document.body.appendChild(alerta);
      setTimeout(() => {
        alerta.remove();
      }, 3000);
      return;
    }

    const params = new URLSearchParams(filtros);
    const url = `https://localhost:7106/api/Informes/${tipoReporte}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error obteniendo datos para el PDF");
      const { titulo, encabezados, filas } = await response.json();

      const doc = new jsPDF();

      // Logo arriba del todo (ajusta la ruta si es necesario)
      const logoImg = new Image();
      logoImg.src = "https://i.ibb.co/4nRfHRqz/Sistema-de-tickets-Logo-removebg-preview.png";
      logoImg.onload = () => {
        doc.addImage(logoImg, "PNG", 85, 5, 40, 40); // Centrado arriba, cuadrado 40x40
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(titulo, 20, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(
          `Fecha de generación: ${new Date().toLocaleDateString()}`,
          20,
          65
        );

        // Mostrar los filtros usados debajo de la fecha
        let filtrosTexto = "Filtros: ";
        const filtrosUsados = [];
        if (filtros.fecha) filtrosUsados.push(`Fecha: ${new Date(filtros.fecha).toLocaleDateString()}`);
        if (filtros.personal) filtrosUsados.push(`Personal: ${filtros.personal}`);
        if (filtros.categoria) filtrosUsados.push(`Categoría: ${filtros.categoria}`);
        filtrosTexto += filtrosUsados.length > 0 ? filtrosUsados.join(" | ") : "Ninguno";
        doc.setFontSize(11);
        doc.text(filtrosTexto, 20, 72);

        autoTable(doc, {
          startY: 80,
          head: [encabezados],
          body: filas,
          theme: "grid",
          styles: { fontSize: 12 },
        });

        // Generar el PDF como Blob y mostrarlo en un iframe
        const pdfBlob = doc.output("blob");
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
      };
    } catch (error) {
      alert("Error generando PDF: " + error.message);
    }
  };

  // Limpia el blobUrl anterior cuando se desmonta el componente o se genera uno nuevo
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // const descargarPDF = async (tipoReporte) => {
  //   const params = new URLSearchParams();

  //   if (filtros.fecha) params.append("fecha", filtros.fecha);
  //   if (filtros.personal) params.append("personal", filtros.personal);
  //   if (filtros.categoria) params.append("categoria", filtros.categoria);

  //   const url = `https://localhost:7106/api/Informes/generar-pdf-${tipoReporte}?${params.toString()}`;

  //   try {
  //     const response = await fetch(url, { method: "GET" });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       alert("Error generando PDF:\n" + errorText);
  //       return;
  //     }

  //     const blob = await response.blob();
  //     const downloadUrl = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = downloadUrl;
  //     a.download = `${tipoReporte}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     alert("Error inesperado: " + error.message);
  //   }
  // };

  // Utilidades para mostrar datos
  const getNombreCategoria = (nombreCategoria) =>
    nombreCategoria || "Desconocido";
  const getNombreUsuario = (nombreUsuario) => nombreUsuario || "Desconocido";
  const formatFecha = (fechaString) => {
    if (!fechaString) return "";
    return new Date(fechaString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="mb-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/estadisticas")}
          >
            Volver
          </button>
        </div>
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
                  <option
                    key={u.id_usuario}
                    value={`${u.nombre} ${u.apellido}`}
                  >
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
        </div>

        <div className="text-center mt-3">
          <button
            className="boton-reporte mx-2"
            onClick={() => generarPdf("generar-pdf-tendencias", filtros)}
          >
            Tendencias de Problemas
          </button>
          <button
            className="boton-reporte mx-2"
            onClick={() => generarPdf("generar-pdf-tiempos", filtros)}
          >
            Tiempos de Resolución
          </button>
          <button
            className="boton-reporte mx-2"
            onClick={() => generarPdf("generar-pdf-estadisticas", filtros)}
          >
            Estadísticas Entrantes
          </button>
        </div>

        {/* Vista previa del PDF */}
        {pdfUrl && (
          <div className="mt-4 d-flex justify-content-center">
            <iframe
              src={pdfUrl}
              title="Vista previa del PDF"
              width="100%"
              height="600px"
              style={{ border: "1px solid #ccc", minHeight: "600px" }}
            />
          </div>
        )}

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
            <p className="text-center">
              No hay tickets que coincidan con los filtros.
            </p>
          ) : (
            // <div className="d-flex flex-column gap-3">
            //   {tickets.map((t) => (
            //     <Ticket
            //       key={t.idTicket}
            //       titulo={t.titulo}
            //       fecha={formatFecha(t.fechaCreacion)}
            //       descripcion={t.descripcion || ""}
            //       prioridad={getPrioridad(t.prioridad)}
            //       estado={t.estado || ""}
            //       asignado={getNombreUsuario(t.nombreUsuario)}
            //       categoria={getNombreCategoria(t.nombreCategoria)}
            //     />
            //   ))}
            // </div>
            null
          )}
        </div>
      </div>
    </div>
  );
};

export default Informes;
