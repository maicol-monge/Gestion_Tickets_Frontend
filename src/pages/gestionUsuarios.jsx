import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function UsuariosFiltros() {
  const [tipoUsuario, setTipoUsuario] = useState("todos");
  const [rol, setRol] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Función para obtener usuarios filtrados
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("https://localhost:7106/api/Usuario/filtrar", {
        params: {
          tipoUsuario,
          rol,
          busqueda
        }
      });
      
      setUsuarios(response.data);
    } catch (err) {
      setError("Error al cargar usuarios. Por favor intenta nuevamente.");
      console.error("Error fetching usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para filtrar cuando cambian los parámetros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsuarios();
    }, 500); // Debounce para evitar muchas llamadas mientras se escribe
    
    return () => clearTimeout(timer);
  }, [tipoUsuario, rol, busqueda]);

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <div className="container-fluid h-100 d-flex flex-column">
        <div className="row flex-grow-1">
          <div className="col-12 col-lg-10 mx-auto py-3">
            {/* ───── Botones CREAR ───── */}
            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
              <button
                className="btn text-white fw-semibold px-4 py-2"
                style={{ backgroundColor: "#243746" }}
                onClick={() => navigate("/crear-usuario-interno")}
              >
                CREAR USUARIO INTERNO
              </button>

              <button
                className="btn text-white fw-semibold px-4 py-2"
                style={{ backgroundColor: "#243746" }}
                onClick={() => navigate("/crear-usuario-externo")}
              >
                CREAR USUARIO EXTERNO
              </button>
            </div>

            {/* ───── Filtros ───── */}
            <div
              className="border rounded p-3 mx-auto w-100 mb-4"
              style={{ maxWidth: "1100px" }}   
            >
              <strong>Filtros:</strong>

              <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                {/* Tipo de Usuario */}
                <label className="d-flex align-items-center gap-1 mb-0">
                  Tipo:
                  <select
                    className="form-select form-select-sm w-auto"
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="interno">Interno</option>
                    <option value="externo">Externo</option>
                  </select>
                </label>

                {/* Rol */}
                <label className="d-flex align-items-center gap-1 mb-0">
                  Rol:
                  <select
                    className="form-select form-select-sm w-auto"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="admin">Administrador</option>
                    <option value="empleado">Empleado</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </label>

                {/* Búsqueda */}
                <label className="d-flex align-items-center gap-1 flex-grow-1 mb-0">
                  Buscar:
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nombre, apellido o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* ───── Resultados ───── */}
            <div className="mx-auto w-100" style={{ maxWidth: "1100px" }}>
              {loading && (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )} 

              {!loading && !error && (
                <>
                  <h5 className="mb-3">
                    {usuarios.length} {usuarios.length === 1 ? "usuario encontrado" : "usuarios encontrados"}
                  </h5>

                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {usuarios.map((usuario) => (
                      <div key={usuario.id_usuario} className="col">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title">
                              {usuario.nombre} {usuario.apellido}
                            </h5>
                            <p className="card-text">
                              <strong>Correo:</strong> {usuario.correo}<br />
                              <strong>Rol:</strong> {usuario.rol}<br />
                              <strong>Tipo:</strong> {usuario.tipo_usuario}
                            </p>
                          </div>
                          {/*<div className="card-footer bg-transparent d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminar(usuario.id_usuario)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                          </div>*/}
                        </div>
                      </div>
                    ))}
                  </div>

                  {usuarios.length === 0 && !loading && (
                    <div className="text-center py-5">
                      <p className="text-muted">No se encontraron usuarios con los filtros seleccionados</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}