import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CrearUsuarioInterno() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave]   = useState("");
  const [rol, setRol]       = useState("Administrador");

  const crearUsuario = (e) => {
    e.preventDefault();
    console.log({ nombre, correo, clave, rol });
  };

  return (
    
    <div style={{ width: "100vw", height: "100vh" }}
         className="d-flex flex-column justify-content-start align-items-center pt-4">

      
      <h2 className="fw-bold mb-4 text-center">Usuarios Internos</h2>

      {/* Formulario dentro de un “panel” */}
      <form onSubmit={crearUsuario}
            className="w-100"
            style={{ maxWidth: "950px" }}                      
      >
        <div className="border rounded-3 p-4">

          {/* Nombre */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">
              Nombre:
            </label>
            <div className="col">
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Correo */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">
              Correo:
            </label>
            <div className="col">
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">
              Contraseña:
            </label>
            <div className="col">
              <input
                type="password"
                className="form-control"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Rol */}
          <div className="row mb-1 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">
              Rol:
            </label>
            <div className="col">
              <select
                className="form-select"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
                
              </select>
            </div>
          </div>

        </div>

        {/* Botón Crear */}
        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn text-white fw-semibold px-5 py-2"
            style={{ backgroundColor: "#243746", minWidth: "200px" }}
          >
            CREAR USUARIO
          </button>
        </div>
      </form>
    </div>
  );
}
