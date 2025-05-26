import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import SubirArchivo from "../components/Archivos/SubirArchivos";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";

const SeguimientoTicketCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useContext(AuthContext);

    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [resolucion, setResolucion] = useState(null);
    const [ultimaAsignacion, setUltimaAsignacion] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [archivosAdicionales, setArchivosAdicionales] = useState([]);
    const [subiendoAdicional, setSubiendoAdicional] = useState(false);
    const fileInputRefAdicional = useRef(null);

    const [tecnicoAsignado, setTecnicoAsignado] = useState(null);

    

      useEffect(() => {
            window.scrollTo(0, 0);
        }, []);

    // Cargar ticket
    useEffect(() => {
        const fetchTicket = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/${id}`);
                setTicket(res.data);
            } catch {
                setError("No se pudo cargar el ticket.");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    // Cargar historial
    useEffect(() => {
        if (!ticket?.id_ticket) return;
        const fetchHistorial = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/historial/${ticket.id_ticket}`);
                setHistorial(res.data);
            } catch {
                setHistorial([]);
            }
        };
        fetchHistorial();
    }, [ticket?.id_ticket]);

    // Cargar tareas
    useEffect(() => {
        if (!ticket?.id_ticket) return;
        const fetchTareas = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/tarea/tareas-por-ticket/${ticket.id_ticket}`);
                setTareas(res.data);
            } catch {
                setTareas([]);
            }
        };
        fetchTareas();
    }, [ticket?.id_ticket]);

    // Cargar resolución
    useEffect(() => {
        if (!ticket?.id_ticket) return;
        const fetchResolucion = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/resolucion/${ticket.id_ticket}`);
                setResolucion(res.data);
            } catch {
                setResolucion(null);
            }
        };
        fetchResolucion();
    }, [ticket?.id_ticket]);

    // Cargar última asignación
    useEffect(() => {
        if (!ticket?.id_ticket) return;
        const fetchUltimaAsignacion = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/ultima-asignacion/${ticket.id_ticket}`);
                setUltimaAsignacion(res.data);
            } catch {
                setUltimaAsignacion(null);
            }
        };
        fetchUltimaAsignacion();
    }, [ticket?.id_ticket]);

    // Cargar técnico asignado
    useEffect(() => {
        if (!ticket?.id_ticket) return;
        const fetchTecnicoAsignado = async () => {
            try {
                const res = await axios.get(`https://localhost:7106/api/ticket/tecnico-asignado/${ticket.id_ticket}`);
                setTecnicoAsignado(res.data);
            } catch {
                setTecnicoAsignado(null);
            }
        };
        fetchTecnicoAsignado();
    }, [ticket?.id_ticket]);

    // Cargar categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await axios.get("https://localhost:7106/api/categoria/getAllCategories");
                setCategorias(res.data);
            } catch {
                setCategorias([]);
            }
        };
        fetchCategorias();
    }, []);

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
    const getNombreCategoria = (id_categoria) => {
        const cat = categorias.find(c => c.id_categoria === id_categoria);
        return cat ? cat.nombre_categoria : "Sin categoría";
    };
    const getEstadoTicket = (estado) => {
        if (estado === "A") return { texto: "Abierto", clase: "text-warning" };
        if (estado === "C") return { texto: "Cerrado", clase: "text-success" };
        return { texto: estado, clase: "" };
    };
    const getEstadoAsignacion = (estado) => {
        if (estado === "P") return { texto: "En progreso", clase: "text-primary" };
        if (estado === "E") return { texto: "En Espera de Información del Cliente", clase: "text-warning" };
        if (estado === "R") return { texto: "Resuelto", clase: "text-success" };
        if (estado === "A") return { texto: "Asignado", clase: "text-info" };
        if (estado === "D") return { texto: "Desasignado", clase: "text-danger" };
        return { texto: estado || "Sin estado", clase: "" };
    };

    // Comentarios (permitido para cliente)
    const enviarComentario = async () => {
        if (!nuevoComentario.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Comentario vacío",
                text: "El comentario no puede estar vacío.",
                confirmButtonColor: "#3085d6"
            });
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
            await Swal.fire({
                icon: "success",
                title: "Comentario enviado",
                text: "Tu comentario fue enviado correctamente.",
                confirmButtonColor: "#3085d6"
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo enviar el comentario.",
                confirmButtonColor: "#d33"
            });
        }
    };

    const ticketCerrado = ticket?.estado === "C";

    // Calcula si los botones deben estar habilitados
    const puedeGestionarResolucion =
        ultimaAsignacion?.estado_ticket === "R" &&
        resolucion &&
        resolucion.resolucion &&
        resolucion.resolucion.trim() !== "";

    // Manejo de archivos adicionales
    const handleDropOrPasteAdicional = (files) => {
        const nuevosArchivos = files.filter(
            (file) =>
                !archivosAdicionales.some(
                    (a) => a.file.name === file.name && a.file.size === file.size
                )
        );
        if (archivosAdicionales.length + nuevosArchivos.length > 5) {
            alert("Solo puedes adjuntar hasta 5 archivos adicionales.");
            return;
        }
        setArchivosAdicionales((prev) => [
            ...prev,
            ...nuevosArchivos.map((file) => ({
                id: `${file.name}_${file.size}_${Date.now()}_${Math.random()}`,
                file,
                url: null,
                estado: "pendiente",
                nombreArchivo: null,
            })),
        ]);
    };

    const handleArchivoSubidoAdicional =
        (id) =>
            ({ url, error, nombreArchivo }) => {
                setArchivosAdicionales((prev) =>
                    prev.map((a) =>
                        a.id === id
                            ? {
                                ...a,
                                url,
                                estado: error ? "error" : "completado",
                                nombreArchivo,
                            }
                            : a
                    )
                );
            };

    const handleArchivoEliminadoAdicional = (id) => () => {
        setArchivosAdicionales((prev) => prev.filter((a) => a.id !== id));
    };

    // Entregar información adicional
    const handleEntregarInfoAdicional = async () => {
        setSubiendoAdicional(true);
        // Validar archivos subidos
        if (
            archivosAdicionales.some((a) => a.estado === "subiendo" || a.estado === "pendiente")
        ) {
            alert("Espera a que todos los archivos terminen de subir.");
            setSubiendoAdicional(false);
            return;
        }
        if (archivosAdicionales.some((a) => a.estado === "error")) {
            alert("Corrige los errores de subida antes de continuar.");
            setSubiendoAdicional(false);
            return;
        }

        // Subir archivos adjuntos si hay
        if (archivosAdicionales.length > 0) {
            try {
                await axios.post("https://localhost:7106/api/ticket/agregar-archivos", {
                    id_ticket: ticket.id_ticket,
                    archivos: archivosAdicionales.map((a) => ({
                        nombre: a.file.name,
                        url: a.url,
                    })),
                });
            } catch {
                alert("No se pudieron agregar los archivos adicionales.");
                setSubiendoAdicional(false);
                return;
            }
        }

        // Llamar endpoint entregar-info-adicional
        try {
            await axios.post("https://localhost:7106/api/ticket/entregar-info-adicional", {
                id_ticket: ticket.id_ticket,
                id_usuario_entrega: usuario.id_usuario,
            });
            setArchivosAdicionales([]);
            await Swal.fire({
                icon: "success",
                title: "¡Información adicional entregada!",
                text: "Se notificó al técnico y el ticket vuelve a estar en proceso.",
                confirmButtonColor: "#3085d6"
            });
            window.location.reload();
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo entregar la información adicional.",
                confirmButtonColor: "#d33"
            });
        }
        setSubiendoAdicional(false);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Cargando ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-5">
                {error}
            </Alert>
        );
    }

    if (!ticket) {
        return (
            <Alert variant="warning" className="mt-5">
                Ticket no encontrado.
            </Alert>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <Button variant="outline-secondary" onClick={() => navigate('/')}>
                <i className="bi bi-arrow-left"></i> Volver
            </Button>
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
                                    <p>
                                        <strong>Técnico asignado:</strong>{" "}
                                        {tecnicoAsignado && tecnicoAsignado.usuario
                                            ? `${tecnicoAsignado.usuario.nombre} ${tecnicoAsignado.usuario.apellido}`
                                            : "No disponible"}
                                    </p>
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
                            {!ticket?.archivos_adjuntos || ticket.archivos_adjuntos.length === 0 ? (
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

                    {ultimaAsignacion?.estado_ticket === "E" && (
                        <div className="mt-4">
                            <div className="alert alert-info text-start mb-3" role="alert">
                                <strong>Nota:</strong> Si necesitas responder con texto o dar una explicación al técnico, por favor escribe tu mensaje en la sección de <b>Comentarios</b> y luego haz clic en <b>Entregar información adicional</b>. Si además necesitas adjuntar archivos, agrégalos aquí y luego haz clic en <b>Entregar información adicional</b>.
                            </div>
                            <h5 className="fw-bolder">Entregar información adicional</h5>
                            <div
                                className="border rounded p-3 mb-2 text-center"
                                style={{ minHeight: 80, background: "#f8f9fa", cursor: ticketCerrado ? "not-allowed" : "pointer", opacity: ticketCerrado ? 0.6 : 1 }}
                                onDrop={ticketCerrado ? undefined : (e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files);
                                    handleDropOrPasteAdicional(files);
                                }}
                                onDragOver={ticketCerrado ? undefined : (e) => e.preventDefault()}
                                onPaste={ticketCerrado ? undefined : (e) => {
                                    const files = Array.from(e.clipboardData.files);
                                    if (files.length) handleDropOrPasteAdicional(files);
                                }}
                                onClick={ticketCerrado ? undefined : () => fileInputRefAdicional.current && fileInputRefAdicional.current.click()}
                            >
                                <span className="text-muted">
                                    Arrastra y suelta archivos aquí, pégalos o haz click para seleccionar (máx. 5)
                                </span>
                                <ul className="list-group mt-2">
                                    {archivosAdicionales.map((a) =>
                                        a.file ? (
                                            <SubirArchivo
                                                key={a.id}
                                                archivo={a.file}
                                                onArchivoSubido={handleArchivoSubidoAdicional(a.id)}
                                                onArchivoEliminado={ticketCerrado ? undefined : handleArchivoEliminadoAdicional(a.id)}
                                            />
                                        ) : null
                                    )}
                                </ul>
                                <input
                                    type="file"
                                    multiple
                                    style={{ display: "none" }}
                                    ref={fileInputRefAdicional}
                                    onChange={ticketCerrado ? undefined : (e) => {
                                        const files = Array.from(e.target.files);
                                        handleDropOrPasteAdicional(files);
                                        e.target.value = "";
                                    }}
                                    accept="*"
                                    disabled={ticketCerrado}
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    className="btn btn-primary px-4"
                                    disabled={
                                        ticketCerrado ||
                                        subiendoAdicional ||
                                        archivosAdicionales.some(a => a.estado === "subiendo" || a.estado === "pendiente" || a.estado === "error")
                                    }
                                    onClick={ticketCerrado ? undefined : handleEntregarInfoAdicional}
                                >
                                    {subiendoAdicional ? "Enviando..." : "Entregar información adicional"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="row mb-4 py-3">
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
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button
                            className="btn btn-outline-danger px-4 fw-bold"
                            style={{ minWidth: 180, fontSize: "1.1em" }}
                            disabled={!puedeGestionarResolucion || ticketCerrado}
                            onClick={ticketCerrado ? undefined : async () => {
                                try {
                                    await axios.post(`https://localhost:7106/api/ticket/rechazar-resolucion`, {
                                        id_ticket: ticket.id_ticket,
                                        id_usuario_rechaza: usuario.id_usuario
                                    });
                                    await Swal.fire({
                                        icon: "success",
                                        title: "Resolución rechazada",
                                        text: "El técnico será notificado.",
                                        confirmButtonColor: "#3085d6"
                                    });
                                    window.location.reload();
                                } catch {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "No se pudo rechazar la resolución.",
                                        confirmButtonColor: "#d33"
                                    });
                                }
                            }}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Rechazar resolución
                        </button>
                        <button
                            className="btn btn-outline-success px-4 fw-bold"
                            style={{ minWidth: 180, fontSize: "1.1em" }}
                            disabled={!puedeGestionarResolucion || ticketCerrado}
                            onClick={ticketCerrado ? undefined : async () => {
                                const result = await Swal.fire({
                                    title: "¿Estás seguro?",
                                    text: "¿Deseas cerrar este ticket? De cerrar el ticket, solo se podrá reactivar al ponerse en contacto con Soporte Técnico.",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Sí, cerrar ticket",
                                    cancelButtonText: "Cancelar"
                                });
                                if (result.isConfirmed) {
                                    try {
                                        await axios.put(`https://localhost:7106/api/ticket/cerrar/${ticket.id_ticket}`);
                                        await Swal.fire({
                                            icon: "success",
                                            title: "Ticket cerrado",
                                            text: "Ticket cerrado correctamente.",
                                            confirmButtonColor: "#3085d6"
                                        });
                                        window.location.reload();
                                    } catch {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "No se pudo cerrar el ticket.",
                                            confirmButtonColor: "#d33"
                                        });
                                    }
                                }
                            }}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Cerrar ticket
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SeguimientoTicketCliente;
