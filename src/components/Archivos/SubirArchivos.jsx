import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wuluxasrfhivhpxcobxy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bHV4YXNyZmhpdmhweGNvYnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjM2NTMsImV4cCI6MjA2MzI5OTY1M30.x6UXhPNtOx15vDTcUxyu-gmUYCyCdxXahyFbPb5-Iaw"
);

const SubirArchivo = ({ archivo, onArchivoSubido, onArchivoEliminado }) => {
  const [estado, setEstado] = useState("subiendo");
  const [url, setUrl] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState(null);

  // Función para subir el archivo (usada en useEffect y en reintentar)
  const subirArchivo = async () => {
    const nombre = `${Date.now()}_${archivo.name.replace(/\s/g, "_")}`;
    setNombreArchivo(nombre);
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(nombre, archivo);

    const { data, error: urlError } = supabase.storage.from("files").getPublicUrl(nombre);

    if (uploadError || !data || !data.publicUrl) {
      // Si el archivo se subió pero no se pudo obtener la URL, intenta eliminarlo
      if (!uploadError) {
        await supabase.storage.from("files").remove([nombre]);
      }
      setEstado("error");
      onArchivoSubido({
        url: null,
        error: uploadError || urlError || "No se obtuvo URL",
        nombreArchivo: nombre,
      });
      return;
    }

    // Guardar el nombre del archivo subido en localStorage
    let archivosGuardados = JSON.parse(localStorage.getItem("archivos_subidos") || "[]");
    archivosGuardados.push(nombre);
    localStorage.setItem("archivos_subidos", JSON.stringify(archivosGuardados));

    setUrl(data.publicUrl);
    setEstado("completado");
    onArchivoSubido({
      url: data.publicUrl,
      error: null,
      nombreArchivo: nombre,
    });
  };

  useEffect(() => {
    subirArchivo();
    // eslint-disable-next-line
  }, []);

  // Eliminar archivo de Supabase y avisar al padre
  const eliminarArchivo = async () => {
    if (!nombreArchivo) {
      alert("El archivo aún no está listo para eliminar.");
      return;
    }
    setEstado("eliminando");
    const { error } = await supabase.storage
      .from("files")
      .remove([nombreArchivo]);
    if (error) {
      setEstado("error");
      alert("No se pudo eliminar el archivo en Supabase: " + error.message);
      console.error("Supabase remove error:", error);
      return;
    }
    setEstado("eliminado");

    // Quitar el archivo de localStorage
    let archivosGuardados = JSON.parse(localStorage.getItem("archivos_subidos") || "[]");
    archivosGuardados = archivosGuardados.filter((n) => n !== nombreArchivo);
    localStorage.setItem("archivos_subidos", JSON.stringify(archivosGuardados));

    if (onArchivoEliminado) onArchivoEliminado(nombreArchivo);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        {archivo.name}{" "}
        {estado === "subiendo" && (
          <span className="text-primary">Subiendo...</span>
        )}
        {estado === "completado" && <span className="text-success">✔</span>}
        {estado === "error" && (
          <>
            <button
              type="button"
              className="btn btn-sm btn-warning ms-2"
              onClick={(e) => {
                e.stopPropagation();
                setEstado("subiendo");
                setUrl(null);
                setNombreArchivo(null);
                subirArchivo();
              }}
            >
              Reintentar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2"
              title="Descartar archivo"
              onClick={async (e) => {
                e.stopPropagation();
                if (nombreArchivo) {
                  setEstado("eliminando");
                  await supabase.storage.from("files").remove([nombreArchivo]);
                }
                // Quitar el archivo de localStorage
                let archivosGuardados = JSON.parse(
                  localStorage.getItem("archivos_subidos") || "[]"
                );
                archivosGuardados = archivosGuardados.filter(
                  (n) => n !== nombreArchivo
                );
                localStorage.setItem(
                  "archivos_subidos",
                  JSON.stringify(archivosGuardados)
                );
                if (onArchivoEliminado) onArchivoEliminado(nombreArchivo);
              }}
            >
              ×
            </button>
          </>
        )}
      </span>
    </li>
  );
};

export default SubirArchivo;