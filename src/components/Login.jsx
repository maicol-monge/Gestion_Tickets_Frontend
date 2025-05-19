import React, { useState, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !contrasena) {
      setError("Por favor ingresa correo y contraseña");
      return;
    }

    try {
      const res = await axios.post("https://localhost:7106/api/Usuario/login", {
        correo,
        contrasena,
      });

      // Verifica que la respuesta tenga el formato esperado
      if (!res.data.token || !res.data.usuario) {
        throw new Error("Respuesta del servidor inválida");
      }

      login(res.data.token, res.data.usuario);
      navigate("/"); // Redirige después del login exitoso
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al iniciar sesión. Por favor intenta nuevamente."
      );
    }
  };

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return (
    <div className="login-container">
      <div>
        <Row className="min-vh-100 align-items-center">
          <Col md={6} xs={12} order-md={1} order={2} className="bg-login">
            <div className="logo-container">
              <img src="/logo.png" alt="Logo" className="login-logo" />
            </div>
          </Col>
          <Col md={6} xs={12} order-md={2} order={1}>
            <div className="login-form-container p-5">
              <h2
                className="mb-4"
                style={{ fontWeight: "bold", fontSize: "3rem" }}
              >
                Iniciar Sesión
              </h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername">
                  <Form.Control
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    className="input-degradado"
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mt-4">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    className="input-degradado"
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-4"
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
