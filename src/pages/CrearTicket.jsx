import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SubirArchivo from "../components/Archivos/SubirArchivos";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wuluxasrfhivhpxcobxy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bHV4YXNyZmhpdmhweGNvYnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjM2NTMsImV4cCI6MjA2MzI5OTY1M30.x6UXhPNtOx15vDTcUxyu-gmUYCyCdxXahyFbPb5-Iaw"
);

const CrearTicket = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const usuarioId = usuario?.id_usuario;
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState(""); // id de la categoría
  const [categorias, setCategorias] = useState([]); // lista de categorías desde la BD
  const [prioridad, setPrioridad] = useState("baja");
  const [tipoTicket, setTipoTicket] = useState("fallo");
  const [archivos, setArchivos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  // Referencia para el input file oculto
  const fileInputRef = useRef(null);

  // Limpiar archivos subidos al recargar la página
  useEffect(() => {
    const limpiarArchivosSubidos = async () => {
      const archivosGuardados = JSON.parse(localStorage.getItem("archivos_subidos") || "[]");
      if (archivosGuardados.length > 0) {
        await supabase.storage.from("files").remove(archivosGuardados);
        localStorage.removeItem("archivos_subidos");
      }
    };
    limpiarArchivosSubidos();
  }, []);

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

  // Manejo de archivos por drag & drop o pegar
  const handleDropOrPaste = (files) => {
    const nuevosArchivos = files.filter(
      (file) =>
        !archivos.some(
          (a) => a.file.name === file.name && a.file.size === file.size
        )
    );
    if (archivos.length + nuevosArchivos.length > 5) {
      Swal.fire(
        "Máximo 5 archivos",
        "Solo puedes adjuntar hasta 5 archivos.",
        "warning"
      );
      return;
    }
    setArchivos((prev) => [
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

  // Callback cuando se sube un archivo
  const handleArchivoSubido =
    (id) =>
    ({ url, error, nombreArchivo }) => {
      setArchivos((prev) =>
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

  const handleArchivoEliminado = (id) => () => {
    setArchivos((prev) => prev.filter((a) => a.id !== id));
  };

  // Validación del formulario
  const validarFormulario = () => {
    if (!titulo.trim()) {
      Swal.fire("Campo requerido", "El título es obligatorio.", "error");
      return false;
    }
    if (titulo.length > 200) {
      Swal.fire(
        "Título muy largo",
        "El título no debe superar 200 caracteres.",
        "error"
      );
      return false;
    }
    if (!descripcion.trim()) {
      Swal.fire("Campo requerido", "La descripción es obligatoria.", "error");
      return false;
    }
    if (descripcion.length > 2000) {
      Swal.fire(
        "Descripción muy larga",
        "La descripción no debe superar 2000 caracteres.",
        "error"
      );
      return false;
    }
    if (!categoria) {
      Swal.fire("Campo requerido", "La categoría es obligatoria.", "error");
      return false;
    }
    if (!prioridad) {
      Swal.fire("Campo requerido", "La prioridad es obligatoria.", "error");
      return false;
    }
    if (!tipoTicket) {
      Swal.fire(
        "Campo requerido",
        "El tipo de ticket es obligatorio.",
        "error"
      );
      return false;
    }
    return true;
  };

  // Subida y envío del ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setSubiendo(false);
      return;
    }

    setSubiendo(true);

    if (
      archivos.some((a) => a.estado === "subiendo" || a.estado === "pendiente")
    ) {
      Swal.fire(
        "Archivos en proceso",
        "Espera a que todos los archivos terminen de subir.",
        "info"
      );
      setSubiendo(false);
      return;
    }
    if (archivos.some((a) => a.estado === "error")) {
      Swal.fire(
        "Error de archivos",
        "Corrige los errores de subida antes de continuar.",
        "error"
      );
      setSubiendo(false);
      return;
    }

    const eliminarArchivosSupabase = async () => {
      for (const archivo of archivos) {
        if (archivo.nombreArchivo) {
          await supabase.storage.from("files").remove([archivo.nombreArchivo]);
        }
      }
    };

    try {
      const datosSend = {
        titulo,
        descripcion,
        categoria_id: categoria,
        prioridad,
        tipo_ticket: tipoTicket,
        usuario_id: usuarioId,
        archivos: archivos.map((a) => ({
          nombre: a.file.name,
          url: a.url,
        })),
      };
      console.log(datosSend);
      await axios.post("https://localhost:7106/api/ticket/crearTicket", datosSend);

      Swal.fire(
        "¡Ticket creado!",
        "El ticket se creó correctamente.",
        "success"
      );

      setTitulo("");
      setDescripcion("");
      setCategoria("");
      setPrioridad("baja");
      setTipoTicket("fallo");
      setArchivos([]);
    } catch (error) {
      await eliminarArchivosSupabase();
      Swal.fire(
        "Error",
        "Error al crear el ticket. Los archivos subidos han sido eliminados.",
        "error"
      );
      setArchivos([]);
    }
    setSubiendo(false);
  };

  // Determina si el botón debe estar deshabilitado
  const disableSubmit =
    subiendo ||
    archivos.some((a) => a.estado === "subiendo" || a.estado === "pendiente" || a.estado === "error") ;

  return (
    <div className="home-container mt-5">
      <h2 className="text-center fw-bold mb-4">Crear un ticket</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label className="form-label">Título:</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={200}
            required
          />
          <div className="form-text">{titulo.length}/200</div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Descripción detallada del problema o solicitud:
          </label>
          <textarea
            className="form-control"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={2000}
            required
          />
          <div className="form-text">{descripcion.length}/2000</div>
        </div>

        <div className="row mb-3">
          <div className="col">
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
                disabled={categorias.length === 0}
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

          <div className="col">
            <label className="form-label">Prioridad:</label>
            <select
              className="form-select"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              required
            >
              <option value="">Selecciona una prioridad</option>
              <option value="critico">Crítico</option>
              <option value="importante">Importante</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="col">
            <label className="form-label">Tipo de ticket:</label>
            <select
              className="form-select"
              value={tipoTicket}
              onChange={(e) => setTipoTicket(e.target.value)}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="fallo">Fallo</option>
              <option value="nuevo_servicio">Nuevo servicio</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Adjuntar archivo: <span className="text-muted">(opcional, arrastra, pega o haz click)</span>
          </label>
          <div
            className="border rounded p-3 mb-2 text-center"
            style={{ minHeight: 80, background: "#f8f9fa", cursor: "pointer" }}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              handleDropOrPaste(files);
            }}
            onDragOver={(e) => e.preventDefault()}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.length) handleDropOrPaste(files);
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <span className="text-muted">
              Arrastra y suelta archivos aquí, pégalos o haz click para seleccionar (máx. 5)
            </span>
            <ul className="list-group mt-2">
              {archivos.map((a) =>
                a.file ? (
                  <SubirArchivo
                    key={a.id}
                    archivo={a.file}
                    onArchivoSubido={handleArchivoSubido(a.id)}
                    onArchivoEliminado={handleArchivoEliminado(a.id)}
                  />
                ) : null
              )}
            </ul>
            {/* Input oculto para seleccionar archivos */}
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleDropOrPaste(files);
                // Limpiar el input para permitir volver a seleccionar los mismos archivos si se desea
                e.target.value = "";
              }}
              accept="*"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            className="btn btn-dark px-4"
            style={{ background: "#2B3945" }}
            disabled={disableSubmit || categorias.length === 0}
          >
            {subiendo ? "Subiendo archivos..." : "CREAR TICKET"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTicket;