import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const SeguimientoTicketEmpleado = () => {
    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [tareas, setTareas] = useState([]);
    const [resolucion, setResolucion] = useState(null);
    const [ultimaAsignacion, setUltimaAsignacion] = useState(null);
    const [resolucionTexto, setResolucionTexto] = useState("");
    const [nuevaTarea, setNuevaTarea] = useState("");
    const [estadoAsignacion, setEstadoAsignacion] = useState(""); // Nuevo estado para el select
    const [categorias, setCategorias] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/${id}`);
                setTicket(res.data);
            } catch {
                Swal.fire("Error", "No se pudo cargar el ticket.", "error");
            }
        };
        fetchTicket();
    }, [id]);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`);
                setHistorial(res.data);
            } catch {
                setHistorial([]);
            }
        };
        fetchHistorial();
    }, [ticket?.id_ticket]);

    useEffect(() => {
        const fetchTareas = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/tarea/tareas-por-ticket/${ticket.id_ticket}`);
                setTareas(res.data);
            } catch {
                setTareas([]);
            }
        };
        fetchTareas();
    }, [ticket?.id_ticket]);

    useEffect(() => {
        const fetchResolucion = async () => {
            if (!ticket?.id_ticket) return;
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/resolucion/${ticket.id_ticket}`);
                setResolucion(res.data);
            } catch {
                setResolucion(null);
            }
        };
        fetchResolucion();
    }, [ticket?.id_ticket]);

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

    // Cargar categorías desde la BD al montar
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await axios.get("https://localhost:7106/api/categoria/getAllCategories");
                setCategorias(res.data);
            } catch (error) {
                setCategorias([]);
            }
        };
        fetchCategorias();
    }, []);

    // Actualiza el texto si ya hay resolución
    useEffect(() => {
        if (resolucion && resolucion.resolucion) {
            setResolucionTexto(resolucion.resolucion);
        }
    }, [resolucion]);

    // Al cargar la última asignación, inicializa el select
    useEffect(() => {
        if (ultimaAsignacion && ultimaAsignacion.estado_ticket) {
            setEstadoAsignacion(ultimaAsignacion.estado_ticket);
        }
    }, [ultimaAsignacion]);

    const getEstadoTicket = (estado) => {
        if (estado === "A") return { texto: "Abierto", clase: "text-warning" };
        if (estado === "C") return { texto: "Cerrado", clase: "text-success" };
        return { texto: estado, clase: "" };
    };

    // Estado de asignación
    const getEstadoAsignacion = (estado) => {
        if (estado === "P") return { texto: "En progreso", clase: "text-primary" };
        if (estado === "E") return { texto: "En Espera de Información del Cliente", clase: "text-warning" };
        if (estado === "R") return { texto: "Resuelto", clase: "text-success" };
        if (estado === "A") return { texto: "Asignado", clase: "text-info" };
        if (estado === "D") return { texto: "Desasignado", clase: "text-danger" };
        return { texto: estado || "Sin estado", clase: "" };
    };

    // Comentarios
    const enviarComentario = async () => {
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
        } catch {
            Swal.fire("Error", "No se pudo enviar el comentario.", "error");
        }
    };

    // Guardar o actualizar resolución
    const guardarResolucion = async () => {
        if (!resolucionTexto.trim()) {
            Swal.fire("Error", "La resolución no puede estar vacía.", "error");
            return;
        }
        try {
            await axios.put(
                `https://localhost:7106/api/ticket/actualizar-resolucion/${ticket.id_ticket}`,
                { resolucion: resolucionTexto }
            );
            Swal.fire("Éxito", "Resolución actualizada correctamente.", "success");
            // Refresca la resolución
            const res = await axios.get(`https://localhost:7106/api/ticket/resolucion/${ticket.id_ticket}`);
            setResolucion(res.data);
        } catch {
            Swal.fire("Error", "No se pudo actualizar la resolución.", "error");
        }
    };

    // Cambiar estado de asignación
    const handleCambiarEstadoAsignacion = async (e) => {
        e.preventDefault();
        if (!estadoAsignacion) {
            Swal.fire("Error", "Selecciona un estado.", "error");
            return;
        }
        try {
            await axios.post("https://localhost:7106/api/ticket/cambiar-estado-asignacion", {
                id_ticket: ticket.id_ticket,
                id_usuario_tecnico: usuario.id_usuario,
                estado_ticket: estadoAsignacion
            });
            Swal.fire("Éxito", "Estado de asignación actualizado.", "success");
            // Refresca la última asignación y el historial
            const [asignacionRes, historialRes] = await Promise.all([
                axios.get(`https://localhost:7106/api/ticket/ultima-asignacion/${ticket.id_ticket}`),
                axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`)
            ]);
            setUltimaAsignacion(asignacionRes.data);
            setHistorial(historialRes.data);
        } catch {
            Swal.fire("Error", "No se pudo actualizar el estado.", "error");
        }
    };

    // Función para agregar tarea
    const agregarTarea = async () => {
        if (!nuevaTarea.trim()) {
            Swal.fire("Error", "La tarea no puede estar vacía.", "error");
            return;
        }
        try {
            await axios.post("https://localhost:7106/api/tarea/agregar-tarea", {
                id_ticket: ticket.id_ticket,
                id_usuario: usuario.id_usuario,
                contenido: nuevaTarea
            });
            setNuevaTarea("");
            // Refresca tareas y el historial
            const [tareasRes, historialRes] = await Promise.all([
                axios.get(`https://localhost:7106/api/tarea/tareas-por-ticket/${ticket.id_ticket}`),
                axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`)
            ]);
            setTareas(tareasRes.data);
            setHistorial(historialRes.data);
            Swal.fire("Éxito", "Tarea agregada correctamente.", "success");
        } catch {
            Swal.fire("Error", "No se pudo agregar la tarea.", "error");
        }
    };

    // Función para eliminar tarea
    const eliminarTarea = async (id_tarea) => {
        try {
            await axios.delete(`https://localhost:7106/api/tarea/eliminar-tarea/${id_tarea}`);
            // Refresca tareas y el historial
            const [tareasRes, historialRes] = await Promise.all([
                axios.get(`https://localhost:7106/api/tarea/tareas-por-ticket/${ticket.id_ticket}`),
                axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`)
            ]);
            setTareas(tareasRes.data);
            setHistorial(historialRes.data);
            Swal.fire("Éxito", "Tarea eliminada correctamente.", "success");
        } catch {
            Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
        }
    };

    // Utilidades
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

    // Función para obtener el nombre de la categoría por id
    const getNombreCategoria = (id_categoria) => {
        const cat = categorias.find(c => c.id_categoria === id_categoria);
        return cat ? cat.nombre_categoria : "Sin categoría";
    };

    const ticketCerrado = ticket?.estado === "C";

    return (
        <div className="container mt-5 mb-5">
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/MisAsignaciones')}
            >
                <i className="bi bi-arrow-left"></i> Volver
            </button>
            <div className="mt-4">
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

                {/* estado_ticket */}
                {/* opciones:
                (P = En progreso, E = En
                Espera de Información del Cliente, R
                = Resuelto) */}
                <div className="row p-2 m-2">
                    <div className="col-md d-flex flex-column justify-content-center d-flex align-items-center text-center  p-4" style={{ border: '2px solid #2B3945', borderRadius: '8px' }}>
                        <form onSubmit={handleCambiarEstadoAsignacion}>
                            <div className="col mb-3">
                                <label className="form-label">Estado de asignación:</label>
                                <select
                                    className="form-select"
                                    value={estadoAsignacion}
                                    onChange={e => setEstadoAsignacion(e.target.value)}
                                    required
                                    disabled={ticketCerrado}
                                >
                                    <option value="">Selecciona un estado</option>
                                    <option value="P">En progreso</option>
                                    <option value="E">En Espera de Información del Cliente</option>
                                    <option value="R">Resuelto</option>
                                </select>
                            </div>
                            <button className="w-100 btn btn-primary" type="submit" disabled={ticketCerrado}>
                                Cambiar estado
                            </button>
                        </form>
                    </div>
                </div>

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
                                    onClick={enviarComentario}
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
                <div className="row mb-4 py-3">
                    <div className="col-md-6">
                        <h5 className="fw-bolder">Resolución:</h5>
                        <div className="border p-4 text-light rounded-1 pt-3" style={{ background: '#2B3945', height: '275px', overflowY: 'auto' }}>
                            <textarea
                                className="form-control mb-2"
                                placeholder="Escribe la resolución..."
                                value={resolucionTexto}
                                onChange={e => setResolucionTexto(e.target.value)}
                                rows={4}
                                style={{ resize: "vertical" }}
                                disabled={ticketCerrado || getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto !== "Resuelto"}
                            />
                            <button
                                className="btn btn-success"
                                onClick={guardarResolucion}
                                disabled={ticketCerrado || getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto !== "Resuelto"}
                            >
                                {resolucion ? "Actualizar resolución" : "Guardar resolución"}
                            </button>
                            {resolucion && resolucion.tecnico_resolutor && (
                                <div className="mt-3">
                                    <strong>Resuelto por:</strong>{" "}
                                    {resolucion.tecnico_resolutor.nombre_completo}
                                </div>
                            )}
                            {getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto !== "Resuelto" && (
                                <div className="mt-2 text-warning">
                                    Solo puedes actualizar la resolución cuando el estado es <b>Resuelto</b>.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h5 className="fw-bolder">Tareas realizadas:</h5>
                        <div className="mb-2 d-flex">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Agregar nueva tarea..."
                                value={nuevaTarea}
                                onChange={e => setNuevaTarea(e.target.value)}
                                disabled={ticketCerrado || getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto === "Resuelto"}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={agregarTarea}
                                disabled={ticketCerrado || getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto === "Resuelto"}
                            >
                                Agregar
                            </button>
                        </div>
                        {getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto === "Resuelto" && (
                            <div className="mb-2 text-warning">
                                No puedes agregar tareas cuando el estado es <b>Resuelto</b>.
                            </div>
                        )}
                        <ul className="list-group text-light rounded-1 p-5" style={{ background: '#2B3945', height: '228px', overflowY: 'auto' }}>
                            {tareas.length === 0 ? (
                                <li className="text-light">No hay tareas registradas para este ticket.</li>
                            ) : (
                                tareas.map((tarea) => (
                                    <li key={tarea.id_tarea} className="d-flex justify-content-between align-items-center">
                                        <div>
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
                                        </div>
                                        <button
                                            className="btn btn-danger btn-sm ms-2"
                                            onClick={() => eliminarTarea(tarea.id_tarea)}
                                            disabled={ticketCerrado || getEstadoAsignacion(ultimaAsignacion?.estado_ticket).texto === "Resuelto"}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SeguimientoTicketEmpleado;