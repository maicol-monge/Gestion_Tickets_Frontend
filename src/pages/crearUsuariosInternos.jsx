import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


export default function CrearUsuarioInterno() {
  const navigate = useNavigate(); 

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [rol, setRol] = useState("admin");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [errorContrasena, setErrorContrasena] = useState("");
  const [contrasenaBloqueada, setContrasenaBloqueada] = useState(false);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await fetch("https://localhost:7106/api/Usuario/Categoria");
        const data = await respuesta.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías", error);
      }
    };
    obtenerCategorias();
  }, []);

  const generarContrasenaTemporal = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let tempContrasena = 't3Mp';
    
    for (let i = 0; i < 12; i++) {
      tempContrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    
    setContrasena(tempContrasena);
    setContrasenaBloqueada(true);
    setErrorContrasena("");
  };

  const validarContrasena = (valor) => {
    if (!contrasenaBloqueada) {
      setContrasena(valor);
      /*const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!regex.test(valor)) {
        setErrorContrasena("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial.");
      } else {
        setErrorContrasena("");
      }*/
    }
  };

  const validarTelefono = (valor) => {
    const soloNumeros = valor.replace(/\D/g, '');
    setTelefono(soloNumeros);
    
    if (soloNumeros.length !== 8) {
      setErrorTelefono("El teléfono debe tener exactamente 8 dígitos");
    } else {
      setErrorTelefono("");
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setErrorTelefono("");
    setCorreo("");
    setErrorCorreo("");
    setContrasena("");
    setRol("admin");
    setCategoria("");
    setErrorContrasena("");
    setContrasenaBloqueada(false);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    // Validar teléfono antes de enviar
    if (telefono.length !== 8) {
      setErrorTelefono("El teléfono debe tener exactamente 8 dígitos");
      return;
    }

    /*const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(contrasena)) {
      setErrorContrasena("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial.");
      return;
    }*/

    try {
      const respuesta = await fetch("https://localhost:7106/api/Usuario/registrar-interno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
          correo,
          contrasena,
          rol,
          id_categoria: categoria !== "" ? parseInt(categoria) : null,
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert("Usuario interno creado correctamente");
        limpiarCampos();
      } else {
        // Verificar si el error es por correo existente
        if (data.message && data.message.toLowerCase().includes("correo")) {
          setErrorCorreo("Este correo electrónico ya está registrado");
        } else {
          alert(data.message || "Error al crear usuario");
        }
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="d-flex flex-column justify-content-start align-items-center pt-4">
      <div className="d-flex justify-content-between align-items-center w-100" style={{ maxWidth: "950px" }}>
        <h2 className="fw-bold mb-4 text-center flex-grow-1">Usuarios Internos</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline-secondary"
          style={{ marginLeft: "auto" }}
        >
          <i className="bi bi-arrow-left"></i> Volver
        </button>
      </div>
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
              <input 
                type="tel" 
                className={`form-control ${errorTelefono ? "is-invalid" : ""}`}
                value={telefono} 
                onChange={(e) => validarTelefono(e.target.value)} 
                required 
                maxLength={8}
              />
              {errorTelefono && <div className="invalid-feedback d-block">{errorTelefono}</div>}
            </div>
          </div>

          {/* Correo */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Correo:</label>
            <div className="col">
              <input 
                type="email" 
                className={`form-control ${errorCorreo ? "is-invalid" : ""}`}
                value={correo} 
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setErrorCorreo(""); // Limpiar error cuando el usuario modifica el correo
                }} 
                required 
              />
              {errorCorreo && <div className="invalid-feedback d-block">{errorCorreo}</div>}
            </div>
          </div>

          {/* Contraseña con ícono */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Contraseña:</label>
            <div className="col input-group">
              <input
                type={mostrarContrasena ? "text" : "password"}
                className={`form-control ${errorContrasena ? "is-invalid" : ""}`}
                value={contrasena}
                onChange={(e) => validarContrasena(e.target.value)}
                required
                readOnly={contrasenaBloqueada}
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

          {/* Botón para generar contraseña temporal */}
          <div className="row mb-3">
            <div className="col-12 col-sm-3"></div>
            <div className="col">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={generarContrasenaTemporal}
              >
                Generar contraseña temporal
              </button>
            </div>
          </div>

          {/* Rol */}
          <div className="row mb-3 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Rol:</label>
            <div className="col">
              <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="administrador">Administrador</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>
          </div>

          {/* Categoría */}
          <div className="row mb-1 align-items-center">
            <label className="col-12 col-sm-3 col-form-label fw-semibold">Categoría:</label>
            <div className="col">
              <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
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