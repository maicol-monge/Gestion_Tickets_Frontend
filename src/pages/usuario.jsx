import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TarjetaUsuario({ nombre, correo, tipoUsuario, rol, onVerMas, onEliminar }) {
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
        <div className="d-flex justify-content-between  flex-wrap align-items-center ">
        {/* Izquierda: Nombre y correo */}
        <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <div className="fw-bold">{nombre}</div>
            <div className="fst-italic" style={{ fontSize: "0.9rem" }}>{correo}</div>
        </div>

        {/* Derecha: Usuario y rol */}
        <div className="d-flex gap-5 flex-shrink-0">
            <div>
            <strong>usuario:</strong> {tipoUsuario}
            </div>
            <div>
            <strong>Rol:</strong> {rol}
            </div>
        </div>
        </div>

      

      {/* Botones */}
      <div className="d-flex align-items-center gap-3 mt-2">
        <button className="btn btn-sm btn-link text-white p-0" onClick={onEliminar}>
          <i className="bi bi-trash-fill fs-5"></i>
        </button>

        <button className="btn btn-outline-light btn-sm" onClick={onVerMas}>
          Ver más
        </button>
      </div>
    </div>
  );
}


export default function UsuariosLista() {
  const usuarios = [
    {
      nombre: "Ana Torres",
      correo: "ana.torres@gmail.com",
      tipoUsuario: "Interno",
      rol: "Técnico",
    },
    {
      nombre: "Carlos Pérez",
      correo: "carlos.perez@hotmail.com",
      tipoUsuario: "Externo",
      rol: "Administrador",
    },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="container-fluid h-100 d-flex flex-column align-items-center pt-5">
        <div className="w-100" style={{ maxWidth: "1100px" }}>
            <h2 className="fw-bold mb-4 text-center">Usuarios Encontrados</h2>
          {usuarios.map((u, index) => (
            <TarjetaUsuario
              key={index}
              nombre={u.nombre}
              correo={u.correo}
              tipoUsuario={u.tipoUsuario}
              rol={u.rol}
              onVerMas={() => alert(`Ver más de ${u.nombre}`)}
              onEliminar={() => alert(`Eliminar a ${u.nombre}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
