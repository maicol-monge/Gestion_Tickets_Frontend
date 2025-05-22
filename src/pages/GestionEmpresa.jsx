import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://localhost:7106/api/empresa";

const MAX_LENGTHS = {
  nombre_empresa: 150,
  direccion: 100,
  nombre_contacto_principal: 65,
  correo: 50,
  telefono: 20,
};

const GestionEmpresa = () => {
  const [empresas, setEmpresas] = useState([]);
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    nombre_empresa: "",
    direccion: "",
    nombre_contacto_principal: "",
    correo: "",
    telefono: "",
  });
  const [filtro, setFiltro] = useState("");
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [empresaEditada, setEmpresaEditada] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar campos
  const validarEmpresa = (empresa) => {
    if (
      !empresa.nombre_empresa.trim() ||
      !empresa.direccion.trim() ||
      !empresa.nombre_contacto_principal.trim() ||
      !empresa.correo.trim() ||
      !empresa.telefono.trim()
    ) {
      Swal.fire("Campos requeridos", "Completa todos los campos.", "warning");
      return false;
    }
    // Validar longitud
    if (empresa.nombre_empresa.length > MAX_LENGTHS.nombre_empresa) {
      Swal.fire("Nombre muy largo", `Máximo ${MAX_LENGTHS.nombre_empresa} caracteres para el nombre de la empresa.`, "warning");
      return false;
    }
    if (empresa.direccion.length > MAX_LENGTHS.direccion) {
      Swal.fire("Dirección muy larga", `Máximo ${MAX_LENGTHS.direccion} caracteres para la dirección.`, "warning");
      return false;
    }
    if (empresa.nombre_contacto_principal.length > MAX_LENGTHS.nombre_contacto_principal) {
      Swal.fire("Contacto muy largo", `Máximo ${MAX_LENGTHS.nombre_contacto_principal} caracteres para el contacto.`, "warning");
      return false;
    }
    if (empresa.correo.length > MAX_LENGTHS.correo) {
      Swal.fire("Correo muy largo", `Máximo ${MAX_LENGTHS.correo} caracteres para el correo.`, "warning");
      return false;
    }
    if (empresa.telefono.length > MAX_LENGTHS.telefono) {
      Swal.fire("Teléfono muy largo", `Máximo ${MAX_LENGTHS.telefono} caracteres para el teléfono.`, "warning");
      return false;
    }
    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(empresa.correo)) {
      Swal.fire("Correo inválido", "Ingresa un correo válido.", "warning");
      return false;
    }
    return true;
  };

  // Cargar todas las empresas
  const cargarEmpresas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/GetAll`);
      setEmpresas(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las empresas.", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  // Buscar empresa por nombre
  const buscarEmpresa = async () => {
  if (!filtro.trim()) {
    Swal.fire("Campo requerido", "Ingresa un nombre para buscar.", "info");
    return;
  }
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/Find/${filtro}`);
    setEmpresas(response.data || []);
    if (!response.data || response.data.length === 0) {
      Swal.fire("No encontrado", "No se encontraron empresas.", "warning");
    }
  } catch (error) {
    setEmpresas([]);
    Swal.fire("No encontrado", "No se encontraron empresas.", "warning");
  }
  setLoading(false);
};

  // Agregar empresa
  const agregarEmpresa = async () => {
    if (!validarEmpresa(nuevaEmpresa)) return;
    try {
      await axios.post(`${API_URL}/Add`, nuevaEmpresa);
      setNuevaEmpresa({
        nombre_empresa: "",
        direccion: "",
        nombre_contacto_principal: "",
        correo: "",
        telefono: "",
      });
      cargarEmpresas();
      Swal.fire("Éxito", "Empresa agregada.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar la empresa.", "error");
    }
  };

  // Editar empresa (activar modo edición)
  const activarEdicion = (empresa) => {
    setEmpresaEditando(empresa.id_empresa);
    setEmpresaEditada({ ...empresa });
  };

  // Guardar edición
  const guardarEdicion = async (id) => {
    if (!validarEmpresa(empresaEditada)) return;
    try {
      await axios.put(`${API_URL}/Actualizar/${id}`, empresaEditada);
      setEmpresaEditando(null);
      setEmpresaEditada({});
      cargarEmpresas();
      Swal.fire("Actualizada", "Empresa actualizada.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la empresa.", "error");
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEmpresaEditando(null);
    setEmpresaEditada({});
  };

  // Reset filtro y mostrar todas
  const limpiarBusqueda = () => {
    setFiltro("");
    cargarEmpresas();
  };

  return (
    <div className="home-container mt-5">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold mb-4 text-center">Gestión de Empresas</h2>

        {/* Agregar empresa */}
        <div className="card p-3 mb-4">
          <h5 className="mb-3">Agregar Empresa</h5>
          <div className="row g-2">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                maxLength={MAX_LENGTHS.nombre_empresa}
                value={nuevaEmpresa.nombre_empresa}
                onChange={(e) =>
                  setNuevaEmpresa({ ...nuevaEmpresa, nombre_empresa: e.target.value })
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                maxLength={MAX_LENGTHS.direccion}
                value={nuevaEmpresa.direccion}
                onChange={(e) =>
                  setNuevaEmpresa({ ...nuevaEmpresa, direccion: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-12 col-md-4 mb-2 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre de contacto"
                maxLength={MAX_LENGTHS.nombre_contacto_principal}
                value={nuevaEmpresa.nombre_contacto_principal}
                onChange={(e) =>
                  setNuevaEmpresa({
                    ...nuevaEmpresa,
                    nombre_contacto_principal: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-4 mb-2 mb-md-0">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                maxLength={MAX_LENGTHS.correo}
                value={nuevaEmpresa.correo}
                onChange={(e) =>
                  setNuevaEmpresa({ ...nuevaEmpresa, correo: e.target.value })
                }
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                maxLength={MAX_LENGTHS.telefono}
                value={nuevaEmpresa.telefono}
                onChange={(e) =>
                  setNuevaEmpresa({ ...nuevaEmpresa, telefono: e.target.value })
                }
              />
            </div>
          </div>
          <div className="text-end mt-2">
            <button className="btn btn-dark" onClick={agregarEmpresa}>
              Agregar
            </button>
          </div>
        </div>

        {/* Buscar empresa */}
        <div className="card p-3 mb-4">
          <h5 className="mb-3">Buscar Empresa por Nombre</h5>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre a buscar"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button className="btn btn-outline-dark" onClick={buscarEmpresa}>
              Buscar
            </button>
            <button className="btn btn-outline-secondary" onClick={limpiarBusqueda}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Lista de empresas */}
        <div className="card p-3 mb-5" style={{ maxHeight: 350, overflowY: "auto" }}>
          <h5 className="mb-3">Lista de Empresas</h5>
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border" role="status" />
            </div>
          ) : empresas.length === 0 ? (
            <div className="text-center text-muted">No hay empresas registradas.</div>
          ) : (
            <div className="table-responsive ">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Contacto</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa) =>
                    empresaEditando === empresa.id_empresa ? (
                      <tr key={empresa.id_empresa}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={MAX_LENGTHS.nombre_empresa}
                            value={empresaEditada.nombre_empresa}
                            onChange={(e) =>
                              setEmpresaEditada({
                                ...empresaEditada,
                                nombre_empresa: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={MAX_LENGTHS.direccion}
                            value={empresaEditada.direccion}
                            onChange={(e) =>
                              setEmpresaEditada({
                                ...empresaEditada,
                                direccion: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={MAX_LENGTHS.nombre_contacto_principal}
                            value={empresaEditada.nombre_contacto_principal}
                            onChange={(e) =>
                              setEmpresaEditada({
                                ...empresaEditada,
                                nombre_contacto_principal: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="form-control"
                            maxLength={MAX_LENGTHS.correo}
                            value={empresaEditada.correo}
                            onChange={(e) =>
                              setEmpresaEditada({
                                ...empresaEditada,
                                correo: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            maxLength={MAX_LENGTHS.telefono}
                            value={empresaEditada.telefono}
                            onChange={(e) =>
                              setEmpresaEditada({
                                ...empresaEditada,
                                telefono: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2 mb-1"
                            onClick={() => guardarEdicion(empresa.id_empresa)}
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm mb-1"
                            onClick={cancelarEdicion}
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={empresa.id_empresa}>
                        <td>{empresa.nombre_empresa}</td>
                        <td>{empresa.direccion}</td>
                        <td>{empresa.nombre_contacto_principal}</td>
                        <td>{empresa.correo}</td>
                        <td>{empresa.telefono}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => activarEdicion(empresa)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionEmpresa;