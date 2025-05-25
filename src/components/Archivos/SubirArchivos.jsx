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

  useEffect(() => {
    const subir = async () => {
      const nombre = `${Date.now()}_${archivo.name.replace(/\s/g, "_")}`;
      setNombreArchivo(nombre);
      const { error } = await supabase.storage
        .from("files")
        .upload(nombre, archivo);

      const { data } = supabase.storage
        .from("files")
        .getPublicUrl(nombre);

      if (error || !data || !data.publicUrl) {
        setEstado("error");
        onArchivoSubido({ url: null, error: error || "No se obtuvo URL", nombreArchivo: nombre });
        return;
      }

      setUrl(data.publicUrl);
      setEstado("completado");
      onArchivoSubido({ url: data.publicUrl, error: null, nombreArchivo: nombre });
    };

    subir();
    // eslint-disable-next-line
  }, []);

  // Eliminar archivo de Supabase y avisar al padre
  const eliminarArchivo = async () => {
    if (!nombreArchivo) {
      alert("El archivo aún no está listo para eliminar.");
      return;
    }
    setEstado("eliminando");
    const { error } = await supabase.storage.from("files").remove([nombreArchivo]);
    if (error) {
      setEstado("error");
      alert("No se pudo eliminar el archivo en Supabase: " + error.message);
      console.error("Supabase remove error:", error);
      return;
    }
    setEstado("eliminado");
    if (onArchivoEliminado) onArchivoEliminado(nombreArchivo);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        {archivo.name}{" "}
        {estado === "subiendo" && <span className="text-primary">Subiendo...</span>}
        {estado === "completado" && <span className="text-success">✔</span>}
        {estado === "error" && <span className="text-danger">Error</span>}
        {estado === "eliminando" && <span className="text-warning">Eliminando...</span>}
        {estado === "eliminado" && <span className="text-muted">Eliminado</span>}
      </span>
      {estado === "completado" && (
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={eliminarArchivo}
          disabled={estado !== "completado"}
        >
          Quitar
        </button>
      )}
    </li>
  );
};

export default SubirArchivo;