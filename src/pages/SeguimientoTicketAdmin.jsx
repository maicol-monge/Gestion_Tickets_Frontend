import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const SeguimientoTicketAdmin = () => {
    const [categorias, setCategorias] = useState([]);
    const [cargandoCategorias, setCargandoCategorias] = useState(false);
    const [categoria, setCategoria] = useState("");
    const [tipoTicket, setTipoTicket] = useState("");
    const [prioridad, setPrioridad] = useState("");
    const [tecnicos, setTecnicos] = useState([]);
    const [cargandoTecnicos, setCargandoTecnicos] = useState(false);
    const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
    const [personalAsignado, setPersonalAsignado] = useState([]);
    const [busquedaNombre, setBusquedaNombre] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [ticket, setTicket] = useState(null);
    const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [tareas, setTareas] = useState([]);
    const [resolucion, setResolucion] = useState(null);
    const [ultimaAsignacion, setUltimaAsignacion] = useState(null);
    const { id } = useParams(); // Asegúrate de que la ruta incluya :id
    const navigate = useNavigate(); // <-- inicializa useNavigate

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Supón que tienes el usuario logueado en localStorage/session o contexto
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    // Cargar categorías desde la BD al montar
    useEffect(() => {
        const fetchCategorias = async () => {
            setCargandoCategorias(true);
            try {
                const res = await axios.get(
                    "https://localhost:7106/api/categoria/getAllCategories"
                );
                setCategorias(res.data);
            } catch (error) {
                setCategorias([]);
                Swal.fire("Error", "No se pudieron cargar las categorías.", "error");
            }
            setCargandoCategorias(false);
        };
        fetchCategorias();
    }, []);

    // Cargar técnicos al montar
    useEffect(() => {
        const fetchTecnicos = async () => {
            setCargandoTecnicos(true);
            try {
                const res = await axios.get("https://localhost:7106/api/usuario/tecnicos");
                setTecnicos(res.data);
            } catch (error) {
                setTecnicos([]);
                Swal.fire("Error", "No se pudieron cargar los técnicos.", "error");
            }
            setCargandoTecnicos(false);
        };
        fetchTecnicos();
    }, []);

    // Obtener datos del ticket al montar
    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/${id}`);
                setTicket(res.data);
                // Opcional: setear valores iniciales de los selects si quieres editar
                setTipoTicket(res.data.tipo_ticket || "");
                setPrioridad(res.data.prioridad || "");
                setCategoria(res.data.id_categoria ? String(res.data.id_categoria) : "");
            } catch (error) {
                Swal.fire("Error", "No se pudo cargar el ticket.", "error");
            }
        };
        fetchTicket();
    }, [id]);

    // Cargar técnico asignado al ticket
    useEffect(() => {
        const fetchPersonalAsignado = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/tecnico-asignado/${ticket.id_ticket}`);
                setPersonalAsignado(res.data ? [res.data] : []);
            } catch (error) {
                setPersonalAsignado([]);
                // Opcional: puedes mostrar un mensaje si lo deseas
            }
        };
        fetchPersonalAsignado();
    }, [ticket?.id_ticket]);

    // Cargar archivos adjuntos del ticket
    useEffect(() => {
        const fetchArchivosAdjuntos = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/archivos-adjuntos/${ticket.id_ticket}`);
                setArchivosAdjuntos(res.data);
            } catch (error) {
                setArchivosAdjuntos([]);
            }
        };
        fetchArchivosAdjuntos();
    }, [ticket?.id_ticket]);

    // Cargar historial del ticket
    useEffect(() => {
        const fetchHistorial = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`);
                setHistorial(res.data);
            } catch (error) {
                setHistorial([]);
            }
        };
        fetchHistorial();
    }, [ticket?.id_ticket]);

    // Cargar tareas del ticket
    useEffect(() => {
        const fetchTareas = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/tarea/tareas-por-ticket/${ticket.id_ticket}`);
                setTareas(res.data);
            } catch (error) {
                setTareas([]);
            }
        };
        fetchTareas();
    }, [ticket?.id_ticket]);

    // Cargar resolución del ticket
    useEffect(() => {
        const fetchResolucion = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/resolucion/${ticket.id_ticket}`);
                setResolucion(res.data);
            } catch (error) {
                setResolucion(null);
            }
        };
        fetchResolucion();
    }, [ticket?.id_ticket]);

    // Cargar última asignación del ticket
    useEffect(() => {
        const fetchUltimaAsignacion = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/ultima-asignacion/${ticket.id_ticket}`);
                setUltimaAsignacion(res.data);
            } catch {
                setUltimaAsignacion(null);
            }
        };
        fetchUltimaAsignacion();
    }, [ticket?.id_ticket]);

    // Función para obtener el nombre de la categoría por id
    const getNombreCategoria = (id_categoria) => {
        const cat = categorias.find(c => c.id_categoria === id_categoria);
        return cat ? cat.nombre_categoria : "Sin categoría";
    };

    // Filtrar técnicos por nombre y categoría
    const tecnicosFiltrados = tecnicos.filter((tec) => {
        const nombreCompleto = `${tec.usuario.nombre} ${tec.usuario.apellido}`.toLowerCase();
        const coincideNombre = nombreCompleto.includes(busquedaNombre.toLowerCase());
        const coincideCategoria = filtroCategoria === "" || String(tec.id_categoria) === filtroCategoria;
        return coincideNombre && coincideCategoria;
    });

    // Función para mostrar el estado con el texto y color correcto
    const getEstadoTicket = (estado) => {
        if (estado === "A") return { texto: "Abierto", clase: "text-warning" };
        if (estado === "C") return { texto: "Cerrado", clase: "text-success" };
        return { texto: estado, clase: "" };
    };

    // Nueva función para mostrar el estado de asignación con texto y color
    const getEstadoAsignacion = (estado) => {
        if (estado === "P") return { texto: "En progreso", clase: "text-primary" };
        if (estado === "E") return { texto: "En Espera de Información del Cliente", clase: "text-warning" };
        if (estado === "R") return { texto: "Resuelto", clase: "text-success" };
        if (estado === "A") return { texto: "Asignado", clase: "text-info" };
        if (estado === "D") return { texto: "Desasignado", clase: "text-danger" };
        return { texto: estado || "Sin estado", clase: "" };
    };

    const handleActualizarDetalles = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `https://localhost:7106/api/ticket/actualizar/${ticket.id_ticket}`,
                {
                    tipo_ticket: tipoTicket,
                    prioridad: prioridad,
                    id_categoria: parseInt(categoria, 10),
                }
            );
            Swal.fire("Éxito", "Los detalles fueron actualizados correctamente.", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudieron actualizar los detalles.", "error");
        }
    };

    const getTextoTipoTicket = (tipo) => {
        if (tipo === "fallo") return "Fallo";
        if (tipo === "nuevo_servicio") return "Nuevo servicio";
        return "Sin tipo";
    };

    const getTextoPrioridad = (prioridad) => {
        if (prioridad === "critico") return "Crítico";
        if (prioridad === "importante") return "Importante";
        if (prioridad === "baja") return "Baja";
        return "Sin prioridad";
    };

    const reactivarTicket = async () => {
        try {
            await axios.put(`https://localhost:7106/api/ticket/reactivar/${ticket.id_ticket}`);
            Swal.fire("Éxito", "Ticket reactivado correctamente.", "success");
            // Recargar datos del ticket para reflejar el nuevo estado
            const res = await axios.get(`https://localhost:7106/api/ticket/${ticket.id_ticket}`);
            setTicket(res.data);
        } catch (error) {
            Swal.fire("Error", error.response?.data?.Message || "No se pudo reactivar el ticket.", "error");
        }
    };

    // Función para refrescar historial
    const refrescarHistorial = async () => {
        try {
            const res = await axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`);
            setHistorial(res.data);
        } catch {
            setHistorial([]);
        }
    };

    // Refrescar última asignación
    const refrescarUltimaAsignacion = async () => {
        try {
            const res = await axios.get(`https://localhost:7106/api/ticket/ultima-asignacion/${ticket.id_ticket}`);
            setUltimaAsignacion(res.data);
        } catch {
            setUltimaAsignacion(null);
        }
    };

    const ticketCerrado = ticket?.estado === "C";

    return (
        <>

            <div className="container mt-5 mb-5">
                {/* Botón Volver a la página anterior */}
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/gestion-tickets')}
                >
                    <i className="bi bi-arrow-left"></i> Volver
                </button>
                <div className="mt-4">

                    {/* Encabezado */}
                    <div className="text-center mb-4">

                        <h6 className={getEstadoTicket(ticket?.estado).clase}>
                            {ticket ? getEstadoTicket(ticket.estado).texto : ""}
                        </h6>
                        <h2>{ticket?.titulo || "Cargando..."}</h2>
                        <p className="text-muted">ID: {ticket?.id_ticket || ""}</p>
                        <p className="text-muted">
                            {ticket?.fecha_cierre
                                ? `Finalizado ${new Date(ticket.fecha_cierre).toLocaleDateString()}`
                                : ticket?.fecha_creacion
                                    ? `Creado ${new Date(ticket.fecha_creacion).toLocaleDateString()}`
                                    : ""}
                        </p>
                    </div>

                    {/* Sección superior */}
                    <div className="row p-2 m-2 border border-dark">
                        <div className="col-md-4 d-flex flex-column justify-content-center border-end border-dark">
                            <form onSubmit={handleActualizarDetalles}>
                                <div className="col mb-3">
                                    <label className="form-label">Tipo de ticket:</label>
                                    <select
                                        className="form-select"
                                        value={tipoTicket}
                                        onChange={(e) => setTipoTicket(e.target.value)}
                                        required
                                        disabled={ticketCerrado}
                                    >
                                        <option value="">Selecciona un tipo</option>
                                        <option value="fallo">Fallo</option>
                                        <option value="nuevo_servicio">Nuevo servicio</option>
                                    </select>
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Prioridad:</label>
                                    <select
                                        className="form-select"
                                        value={prioridad}
                                        onChange={(e) => setPrioridad(e.target.value)}
                                        required
                                        disabled={ticketCerrado}
                                    >
                                        <option value="">Selecciona una prioridad</option>
                                        <option value="critico">Crítico</option>
                                        <option value="importante">Importante</option>
                                        <option value="baja">Baja</option>
                                    </select>
                                </div>
                                <div className="col mb-3">
                                    <label className="form-label">Categoría:</label>
                                    {cargandoCategorias ? (
                                        <div className="form-text">Cargando categorías...</div>
                                    ) : categorias.length === 0 ? (
                                        <div className="form-text text-danger">
                                            No hay categorías disponibles.
                                        </div>
                                    ) : (
                                        <select
                                            className="form-select"
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                            required
                                            disabled={categorias.length === 0 || ticketCerrado}
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categorias.map((cat) => (
                                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                                    {cat.nombre_categoria}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <button className="w-100" type="submit" style={{ background: '#2B3945' }} disabled={ticketCerrado}>
                                    Cambiar detalles
                                </button>
                            </form>
                        </div>
                        <div className="col-md-4 d-flex flex-column justify-content-center my-2">
                            <h6 className="form-label">Personal disponible:</h6>
                            {/* Buscador y filtro */}
                            <div className="mb-3 d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre..."
                                    value={busquedaNombre}
                                    onChange={e => setBusquedaNombre(e.target.value)}
                                    style={{ maxWidth: 180 }}
                                />
                                <select
                                    className="form-select"
                                    value={filtroCategoria}
                                    onChange={e => setFiltroCategoria(e.target.value)}
                                    style={{ maxWidth: 180 }}
                                >
                                    <option value="">Todas las categorías</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nombre_categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {cargandoTecnicos ? (
                                <div className="form-text">Cargando técnicos...</div>
                            ) : tecnicosFiltrados.length === 0 ? (
                                <div className="form-text text-danger">
                                    No hay técnicos disponibles.
                                </div>
                            ) : (
                                <div style={{ height: 180, overflowY: "auto", border: "1px solid #ccc", borderRadius: 4 }}>
                                    <ul className="list-group ">
                                        {tecnicosFiltrados.map((tec) => (
                                            <li
                                                key={tec.id_tecnico}
                                                className={` text-light list-group-item list-group-item-action${tecnicoSeleccionado && tecnicoSeleccionado.id_tecnico === tec.id_tecnico ? " active" : ""}`}
                                                style={{ cursor: "pointer", background: '#2B3945' }}
                                                onClick={() => setTecnicoSeleccionado(tec)}

                                            >
                                                {tec.usuario.nombre} {tec.usuario.apellido}
                                                <br />
                                                <span className="text-light" style={{ fontSize: "0.9em" }}>
                                                    Categoría: {getNombreCategoria(tec.id_categoria)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Asignar personal */}
                            <button
                                className="mt-2"
                                style={{ background: '#2B3945' }}
                                disabled={
                                    ticketCerrado ||
                                    !tecnicoSeleccionado ||
                                    personalAsignado.length > 0 ||
                                    personalAsignado.some(p => p.id_tecnico === tecnicoSeleccionado.id_tecnico)
                                }
                                onClick={async () => {
                                    if (
                                        tecnicoSeleccionado &&
                                        personalAsignado.length === 0 &&
                                        !personalAsignado.some(p => p.id_tecnico === tecnicoSeleccionado.id_tecnico)
                                    ) {
                                        try {
                                            await axios.post("https://localhost:7106/api/ticket/asignar", {
                                                id_ticket: ticket.id_ticket,
                                                id_tecnico: tecnicoSeleccionado.id_tecnico,
                                                estado_ticket: "A"
                                            });
                                            setPersonalAsignado([...personalAsignado, tecnicoSeleccionado]);
                                            setTecnicoSeleccionado(null);
                                            await refrescarHistorial();
                                            await refrescarUltimaAsignacion(); // <-- Actualiza el estado en Datos Generales
                                            Swal.fire("Éxito", "Personal asignado correctamente.", "success");
                                        } catch (error) {
                                            Swal.fire("Error", "No se pudo asignar el personal.", "error");
                                        }
                                    }
                                }}
                            >
                                Asignar personal
                            </button>


                        </div>
                        <div className="col-md-4">
                            <div className="mt-3">
                                <h6>Personal asignado:</h6>
                                <ul className="list-group">
                                    {personalAsignado.length === 0 ? (
                                        <li className="list-group-item text-muted">Ninguno</li>
                                    ) : (
                                        personalAsignado.map((tec) => (
                                            <li key={tec.id_tecnico} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    {tec.usuario.nombre} {tec.usuario.apellido}
                                                    <br />
                                                    <span className="text-muted" style={{ fontSize: "0.9em" }}>
                                                        Categoría: {getNombreCategoria(tec.id_categoria)}
                                                    </span>
                                                </div>
                                                {/* Desasignar personal */}
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={async () => {
                                                        const result = await Swal.fire({
                                                            title: "¿Estás seguro?",
                                                            text: "Esta acción desasignará al técnico del ticket.",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            confirmButtonText: "Sí, desasignar",
                                                            cancelButtonText: "Cancelar"
                                                        });
                                                        if (result.isConfirmed) {
                                                            try {
                                                                await axios.post("https://localhost:7106/api/ticket/desasignar", {
                                                                    id_ticket: ticket.id_ticket,
                                                                    id_tecnico: tec.id_tecnico
                                                                });
                                                                setPersonalAsignado(personalAsignado.filter(p => p.id_tecnico !== tec.id_tecnico));
                                                                await refrescarHistorial();
                                                                await refrescarUltimaAsignacion(); // <-- Actualiza el estado en Datos Generales
                                                                Swal.fire("Éxito", "Personal desasignado correctamente.", "success");
                                                            } catch (error) {
                                                                Swal.fire("Error", "No se pudo desasignar el personal.", "error");
                                                            }
                                                        }
                                                    }}
                                                    disabled={ticketCerrado}
                                                >
                                                    Desasignar
                                                </button>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Datos Generales y Resolución */}
                    <div className="row my-4">
                        <div className="col-12 col-md-6">
                            <h5 className="fw-bolder mt-3">Datos Generales:</h5>
                            <div className="p-4 text-light rounded-1 pt-3" style={{ background: '#2B3945', height: '400px', overflowY: 'auto' }}>
                                <p><strong>Descripción:</strong> {ticket?.descripcion || "Sin descripción"}</p>
                                <div className="row border border-end-0 border border-start-0 border-light my-2 py-2">
                                    <div className="col-12 col-md-6">
                                        <p><strong>Tipo de Ticket:</strong> {getTextoTipoTicket(ticket?.tipo_ticket)}</p>
                                        <p><strong>Prioridad:</strong> {getTextoPrioridad(ticket?.prioridad)}</p>
                                        <p><strong>Categoría:</strong> {getNombreCategoria(ticket?.id_categoria)}</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <p><strong>Solicitante:</strong> {ticket?.creador?.nombre_completo || "No disponible"}</p>
                                        <p><strong>Técnico asignado:</strong> {personalAsignado[0] ? `${personalAsignado[0].usuario.nombre} ${personalAsignado[0].usuario.apellido}` : "Ninguno"}</p>
                                    </div>
                                </div>
                                <p className="text-center">
                                    <strong>Estado:</strong>{" "}
                                    {ultimaAsignacion
                                        ? <span className={getEstadoAsignacion(ultimaAsignacion.estado_ticket).clase}>
                                            {getEstadoAsignacion(ultimaAsignacion.estado_ticket).texto}
                                        </span>
                                        : "Sin estado"}
                                </p>
                            </div>
                            <h5 className="fw-bolder my-4">Archivos adjuntos:</h5>
                            <div className="p-4" style={{ border: '2px solid #2B3945', borderRadius: '8px', height: '122px', overflowY: 'auto' }}>
                                {ticketCerrado ? (
                                    <span className="text-muted">No puedes consultar archivos en un ticket cerrado.</span>
                                ) : !ticket?.archivos_adjuntos || ticket.archivos_adjuntos.length === 0 ? (
                                    <span className="text-muted">No hay archivos adjuntos.</span>
                                ) : (
                                    <ul className="list-group">
                                        {ticket.archivos_adjuntos.map((archivo) => (
                                            <li key={archivo.id_archivo} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{archivo.nombre_archivo}</span>
                                                <a
                                                    href={archivo.ruta_archivo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Ver/Descargar
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <h5 className="fw-bolder mt-3">Comentarios:</h5>
                            <div className="p-3" style={{ border: '2px solid #2B3945', borderRadius: '8px', height: '170px', overflowY: 'auto' }}>
                                <div className="mb-2">
                                    <textarea
                                        className="form-control"
                                        placeholder="Escribe un comentario..."
                                        value={nuevoComentario}
                                        onChange={e => setNuevoComentario(e.target.value)}
                                        rows={3}
                                        style={{ resize: "vertical" }}
                                        disabled={ticketCerrado}
                                    />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            if (!nuevoComentario.trim()) {
                                                Swal.fire("Error", "El comentario no puede estar vacío.", "error");
                                                return;
                                            }
                                            try {
                                                await axios.post("https://localhost:7106/api/ticket/comentario", {
                                                    id_ticket: ticket.id_ticket,
                                                    id_usuario: usuario.id_usuario,
                                                    contenido: nuevoComentario
                                                });
                                                setNuevoComentario("");
                                                // Refresca historial para mostrar el nuevo comentario
                                                const res = await axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`);
                                                setHistorial(res.data);
                                                Swal.fire("Éxito", "Comentario enviado.", "success");
                                            } catch (error) {
                                                Swal.fire("Error", "No se pudo enviar el comentario.", "error");
                                            }
                                        }}
                                        disabled={ticketCerrado}
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </div>
                            <h5 className="fw-bolder mt-3">Historial:</h5>
                            <div className="p-4 text-light rounded-1 pt-3" style={{ background: '#2B3945', height: '375px', overflowY: 'auto' }}>
                                {historial.length === 0 ? (
                                    <span className="text-light">No hay historial para este ticket.</span>
                                ) : (
                                    historial.map((h, idx) => (
                                        <div key={idx} className="mb-3">
                                            <p className="mb-1">
                                                <strong>
                                                    {new Date(h.fecha_hora).toLocaleString("es-MX", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })} — {h.usuario}:
                                                </strong>
                                                <br />
                                                <span className="fw-bold">{h.accion}</span>
                                                {h.detalle && <span className="ms-2">— {h.detalle}</span>}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resolución y Tareas */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5 className="fw-bolder">Resolución:</h5>
                            <div className="border p-4 text-light rounded-1 pt-3" style={{ background: '#2B3945', height: '275px', overflowY: 'auto' }}>
                                {resolucion ? (
                                    <>
                                        <p>
                                            <strong>Resuelto por:</strong>{" "}
                                            {resolucion.tecnico_resolutor
                                                ? resolucion.tecnico_resolutor.nombre_completo
                                                : "No disponible"}
                                        </p>
                                        <p>{resolucion.resolucion || "Sin resolución registrada."}</p>
                                    </>
                                ) : (
                                    <span className="text-light">No hay resolución registrada para este ticket.</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="fw-bolder">Tareas realizadas:</h5>
                            <ul className="list-group text-light rounded-1 p-5" style={{ background: '#2B3945', height: '275px', overflowY: 'auto' }}>
                                {tareas.length === 0 ? (
                                    <li className="text-light">No hay tareas registradas para este ticket.</li>
                                ) : (
                                    tareas.map((tarea) => (
                                        <li key={tarea.id_tarea}>
                                            <i className="bi bi-check-circle-fill text-success"></i>{" "}
                                            {tarea.contenido}
                                            <br />
                                            <span className="text-light" style={{ fontSize: "0.85em" }}>
                                                {new Date(tarea.fecha_tarea).toLocaleString("es-MX", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Botones finales */}
                    <div className="d-flex justify-content-start gap-2">
                        <button
                            className="btn btn-dark"
                            disabled={ticket?.estado !== "C"}
                            onClick={reactivarTicket}
                        >
                            Reactivar Ticket
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SeguimientoTicketAdmin;
