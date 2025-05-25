import React, { useState, useContext } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ajusta la ruta según tu estructura
import "../styles/CustomNavbar.css"; // Asegúrate de tener este archivo CSS

const CustomNavbar = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownShow, setDropdownShow] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Controla que el dropdown se muestre al pasar el mouse
  const handleMouseEnter = () => setDropdownShow(true);
  const handleMouseLeave = () => setDropdownShow(false);

  if (!usuario) return null; // No mostrar navbar si no hay usuario logueado

  // Creamos el dropdown reutilizable para el saludo
  const userDropdown = (
    <NavDropdown
      title={`Bienvenido/a, ${usuario.nombre} ${usuario.apellido}`}
      id="userDropdown"
      show={dropdownShow}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      align="end"
      // Puedes agregar una clase personalizada para estilos extra, por ejemplo:
      className="hover-dropdown"
    >
      <NavDropdown.Item as={Link} to="/cambiar-contrasena">
        Cambiar Contraseña
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
    </NavDropdown>
  );

  // Navbar para administradores
  if (usuario.rol === "admin") {
    return (
      <div className="navbar-container">
        <Navbar className="navbar-custom">
          <Container className="">
            <Navbar.Brand as={Link} to="/">
              <img
                src="https://i.ibb.co/4nRfHRqz/Sistema-de-tickets-Logo-removebg-preview.png"
                style={{ width: "10vh", height: "10vh" }}
              ></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Mis Tickets
                </Nav.Link>
                <Nav.Link as={Link} to="/crear-ticket">
                  Crear ticket
                </Nav.Link>
                <Nav.Link as={Link} to="/MisAsignaciones">
                  Mis asignaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/gestion-tickets">
                  Gestión de tickets
                </Nav.Link>
                <Nav.Link as={Link} to="/gestion-usuarios">
                  Gestión de usuarios
                </Nav.Link>
                <Nav.Link as={Link} to="/Estadisticas">
                  Estadisticas
                </Nav.Link>
                <Nav.Link as={Link} to="/gestion-empresa">
                  Gestión de empresa
                </Nav.Link>
              </Nav>
              <Nav>{userDropdown}</Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }

  // Navbar para empleados
  if (usuario.rol === "empleado") {
    return (
      <div className="navbar-container">
        <Navbar className="navbar-custom">
          <Container className="">
            <Navbar.Brand as={Link} to="/">
              <img
                src="https://i.ibb.co/4nRfHRqz/Sistema-de-tickets-Logo-removebg-preview.png"
                style={{ width: "10vh", height: "10vh" }}
              ></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Mis Tickets
                </Nav.Link>
                <Nav.Link as={Link} to="/crear-ticket">
                  Crear ticket
                </Nav.Link>
                <Nav.Link as={Link} to="/MisAsignaciones">
                  Mis asignaciones
                </Nav.Link>
              </Nav>
              <Nav>{userDropdown}</Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }

  // Navbar para usuarios normales (default)
  return (
    <div className="navbar-container">
      <Navbar className="navbar-custom">
        <Container className="">
          <Navbar.Brand as={Link} to="/">
            <img
              src="https://i.ibb.co/4nRfHRqz/Sistema-de-tickets-Logo-removebg-preview.png"
              style={{ width: "10vh", height: "10vh" }}
            ></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Mis Tickets
              </Nav.Link>
              <Nav.Link as={Link} to="/crear-ticket">
                Crear ticket
              </Nav.Link>
            </Nav>
            <Nav>{userDropdown}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
