import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UsuariosFiltros() {
  const [soloInternos, setSoloInternos] = useState(false);
  const [todos, setTodos] = useState(false);
  const [rol, setRol] = useState("Tecnico");
  const [busqueda, setBusqueda] = useState("");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="container-fluid h-100 d-flex flex-column">

        <div className="row flex-grow-1">
          <div className="col-12 col-lg-10 mx-auto py-3">

            {/* ───── Botones CREAR ───── */}
            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
              <button
                className="btn text-white fw-semibold px-4 py-2"
                style={{ backgroundColor: "#243746" }}
                onClick={() => console.log("Crear interno")}
              >
                CREAR USUARIO INTERNO
              </button>

              <button
                className="btn text-white fw-semibold px-4 py-2"
                style={{ backgroundColor: "#243746" }}
                onClick={() => console.log("Crear externo")}
              >
                CREAR USUARIO EXTERNO
              </button>
            </div>

            <div
              className="border rounded p-3 mx-auto w-100"
              style={{ maxWidth: "1100px" }}   
            >
              <strong>Filtros:</strong>

              <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                {/* Internos */}
                <label className="d-flex align-items-center gap-1 mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={soloInternos}
                    onChange={(e) => setSoloInternos(e.target.checked)}
                  />
                  Internos
                </label>

                {/* Todos */}
                <label className="d-flex align-items-center gap-1 mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={todos}
                    onChange={(e) => setTodos(e.target.checked)}
                  />
                  Todos
                </label>

                {/* Rol */}
                <label className="d-flex align-items-center gap-1 mb-0">
                  Rol:
                  <select
                    className="form-select form-select-sm w-auto"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                  >
                    <option value="Tecnico">Tecnico</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Usuario">Usuario</option>
                  </select>
                </label>

                {/* Búsqueda */}
                <label className="d-flex align-items-center gap-1 flex-grow-1 mb-0">
                  Buscar:
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Escribe para buscar…"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
