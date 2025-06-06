import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../styles/CambiarContrasena.css"; // Asegúrate de tener este archivo CSS

const CambiarContrasena = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    contrasenaActual: false,
    nuevaContrasena: false,
    confirmarContrasena: false
  });

  const toggleShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleClose = () => {
    navigate(-1); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contrasenaActual) {
      newErrors.contrasenaActual = "La contraseña actual es requerida";
    }

    if (!formData.nuevaContrasena) {
      newErrors.nuevaContrasena = "La nueva contraseña es requerida";
    } else if (formData.nuevaContrasena.length < 8) {
      newErrors.nuevaContrasena =
        "La contraseña debe tener al menos 8 caracteres";
    } else if (!/[A-Z]/.test(formData.nuevaContrasena)) {
      newErrors.nuevaContrasena =
        "La contraseña debe contener al menos una letra mayúscula";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.nuevaContrasena)) {
      newErrors.nuevaContrasena =
        "La contraseña debe contener al menos un carácter especial";
    }

    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      const response = await axios.post(
        "https://localhost:7106/api/Usuario/cambiar-contrasena",
        {
          IdUsuario: usuario.id_usuario,
          ContrasenaActual: formData.contrasenaActual,
          NuevaContrasena: formData.nuevaContrasena,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "Tu contraseña ha sido actualizada correctamente",
        confirmButtonText: "Aceptar",
      });

      navigate("/");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      let errorMessage = "Ocurrió un error al cambiar la contraseña";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div
              className="card-header text-white p-3 d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#2C3E50" }}
            >
              <h3 className="mb-0">Cambiar Contraseña</h3>
              <button 
                type="button" 
                className="btn btn-close btn-close-white" 
                onClick={handleClose}
                aria-label="Cerrar"
              />
            </div>
            
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="contrasenaActual" className="form-label">
                    Contraseña Actual
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.contrasenaActual ? "text" : "password"}
                      className={`form-control ${
                        errors.contrasenaActual ? "is-invalid" : ""
                      }`}
                      id="contrasenaActual"
                      name="contrasenaActual"
                      value={formData.contrasenaActual}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleShowPassword("contrasenaActual")}
                    >
                      <i className={`bi bi-eye${showPassword.contrasenaActual ? "-slash" : ""}`}></i>
                    </button>
                    {errors.contrasenaActual && (
                      <div className="invalid-feedback">
                        {errors.contrasenaActual}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="nuevaContrasena" className="form-label">
                    Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.nuevaContrasena ? "text" : "password"}
                      className={`form-control ${
                        errors.nuevaContrasena ? "is-invalid" : ""
                      }`}
                      id="nuevaContrasena"
                      name="nuevaContrasena"
                      value={formData.nuevaContrasena}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleShowPassword("nuevaContrasena")}
                    >
                      <i className={`bi bi-eye${showPassword.nuevaContrasena ? "-slash" : ""}`}></i>
                    </button>
                    {errors.nuevaContrasena && (
                      <div className="invalid-feedback">
                        {errors.nuevaContrasena}
                      </div>
                    )}
                  </div>
                  <small className="text-muted">
                   
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmarContrasena" className="form-label">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.confirmarContrasena ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmarContrasena ? "is-invalid" : ""
                      }`}
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleShowPassword("confirmarContrasena")}
                    >
                      <i className={`bi bi-eye${showPassword.confirmarContrasena ? "-slash" : ""}`}></i>
                    </button>
                    {errors.confirmarContrasena && (
                      <div className="invalid-feedback">
                        {errors.confirmarContrasena}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Procesando...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambiarContrasena;