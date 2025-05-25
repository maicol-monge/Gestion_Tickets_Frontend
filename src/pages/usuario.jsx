import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TarjetaUsuario({ usuario, onVerMas, onEliminar }) {
  return (
    <div
      className="d-flex justify-content-between align-items-start px-4 py-3 rounded mb-3 flex-wrap"
      style={{
        backgroundColor: "#243746",
        color: "white",
        maxWidth: "1100px",
        width: "100%",
      }}
    >
      <div className="d-flex justify-content-between flex-wrap align-items-center w-100">
        <div className="flex-grow-1" style={{ minWidth: "200px" }}>
          <div className="fw-bold">{usuario.nombre}</div>
          <div className="fst-italic" style={{ fontSize: "0.9rem" }}>{usuario.correo}</div>
        </div>

        <div className="d-flex gap-5 flex-shrink-0">
          <div>
            <strong>Usuario:</strong> {usuario.tipo_usuario}
          </div>
          <div>
            <strong>Rol:</strong> {usuario.rol}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
          <button 
            className="btn btn-sm btn-link text-white p-0" 
            onClick={() => onEliminar(usuario)}
            title="Eliminar usuario"
          >
            <i className="bi bi-trash-fill fs-5"></i>
          </button>
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={() => onVerMas(usuario)}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsuariosLista({ usuarios, onVerMas, onEliminar }) {
  return (
    <div className="w-100">
      <div className="w-100" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="fw-bold mb-4 text-center">Usuarios Encontrados</h2>
        
        {usuarios.length === 0 ? (
          <div className="alert alert-info text-center">
            No se encontraron usuarios con los filtros seleccionados
          </div>
        ) : (
          usuarios.map((usuario) => (
            <TarjetaUsuario
              key={usuario.id_usuario}
              usuario={usuario}
              onVerMas={onVerMas}
              onEliminar={onEliminar}
            />
          ))
        )}
      </div>
    </div>
  );
}