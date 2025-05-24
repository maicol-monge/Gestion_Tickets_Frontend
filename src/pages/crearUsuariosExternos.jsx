import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CrearUsuarioExterno() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [rol, setRol] = useState("admin");
  const [empresa, setEmpresa] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [errorContrasena, setErrorContrasena] = useState("");

  useEffect(() => {
    fetch("https://localhost:7106/api/Usuario/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, []);

  const validarContrasena = (valor) => {
    setContrasena(valor);
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(valor)) {
      setErrorContrasena("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial.");
    } else {
      setErrorContrasena("");
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setCorreo("");
    setContrasena("");
    setEmpresa("");
    setMostrarContrasena(false);
    setErrorContrasena("");
  };

  const crearUsuario = (e) => {
    e.preventDefault();

    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(contrasena)) {
      setErrorContrasena("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial.");
      return;
    }

    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      correo,
      contrasena,
      rol,
      id_empresa: parseInt(empresa),
    };

    fetch("https://localhost:7106/api/Usuario/registrar-externo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Usuario creado:", data);
        alert("Usuario externo creado correctamente");
        limpiarCampos(); // Limpiamos los campos después del registro exitoso
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
        alert("Hubo un error al crear el usuario");
      });
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="d-flex flex-column justify-content-start align-items-center pt-4"
    >
      <h2 className="fw-bold mb-4 text-center">Usuarios Externos</h2>

      <form onSubmit={crearUsuario} className="w-100" style={{ maxWidth: "950px" }}>
        <div className="border rounded-3 p-4">

          {/* Nombre */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Nombre:</label>
            <div className="col">
              <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          </div>

          {/* Apellido */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Apellido:</label>
            <div className="col">
              <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>

          {/* Teléfono */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Teléfono:</label>
            <div className="col">
              <input type="tel" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
          </div>

          {/* Correo */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Correo:</label>
            <div className="col">
              <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
          </div>

          {/* Contraseña con ícono y validación */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Contraseña:</label>
            <div className="col input-group">
              <input
                type={mostrarContrasena ? "text" : "password"}
                className={`form-control ${errorContrasena ? "is-invalid" : ""}`}
                value={contrasena}
                onChange={(e) => validarContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                tabIndex={-1}
              >
                <i className={`bi ${mostrarContrasena ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
              {errorContrasena && <div className="invalid-feedback d-block">{errorContrasena}</div>}
            </div>
          </div>

          {/* Empresa (cargada desde la BD) */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Empresa:</label>
            <div className="col">
              <select className="form-select" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required>
                <option value="">Selecciona una empresa</option>
                {empresas.map((e) => (
                  <option key={e.id_empresa} value={e.id_empresa}>
                    {e.nombre_empresa}
                  </option>
                ))}
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