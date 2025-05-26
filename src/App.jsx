import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./components/Login";
import Home from "./pages/Home";
import Empresa from "./pages/GestionEmpresa";
import CrearUsuarioInterno from "./pages/crearUsuariosInternos";
import FiltrarUsuarios from "./pages/gestionUsuarios";

import CrearUsuarioExterno from "./pages/crearUsuariosExternos";
import UsuariosFiltros from "./pages/gestionUsuarios";
import CambiarContrasena from "./pages/CambiarContrasena";

import CustomNavbar from "./components/CustomNavbar";

import CrearTicket from "./pages/CrearTicket";
import GestionTicket from "./pages/GestionTicket";
import SeguimientoTicketAdmin from "./pages/SeguimientoTicketAdmin";
import SeguimientoTicketEmpleado from "./pages/SeguimientoTicketEmpleado";
import SeguimientoTicketCliente from "./pages/SeguimientoTicketCliente"; // Agrega esta línea junto a los otros imports

import MisAsignaciones from "./pages/MisAsignaciones";
import Informes from "./pages/Informes";
import Estadisticas from "./pages/Estadisticas";
import AccesoDenegado from "./pages/AccesoDenegado";

import ProtectedRoute from "./routes/ProtectedRoute";

import "react-bootstrap";

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return (
    <Router>
      {isAuthenticated && <CustomNavbar />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/acceso-denegado" element={<AccesoDenegado />} />



        <Route
          path="/cambiar-contrasena"
          element={
            isAuthenticated ? <CambiarContrasena /> : <Navigate to="/login" />
          }
        />

        {/* Página de login: si ya está autenticado, redirige a Home */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Rutas solo para admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          

          <Route
            path="/crear-usuario-interno"
            element={
              isAuthenticated ? <CrearUsuarioInterno /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/gestion-usuarios"
            element={
              isAuthenticated ? <UsuariosFiltros /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/crear-usuario-externo"
            element={
              isAuthenticated ? <CrearUsuarioExterno /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/gestion-tickets"
            element={
              isAuthenticated ? <GestionTicket /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/gestion-usuarios"
            element={
              isAuthenticated ? <UsuariosFiltros /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/estadisticas"
            element={
              isAuthenticated ? <Estadisticas /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/informes"
            element={
              isAuthenticated ? <Informes /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/gestion-empresa"
            element={isAuthenticated ? <Empresa /> : <Navigate to="/login" />}
          />
          <Route
            path="/tickets/:id"
            element={
              isAuthenticated ? <SeguimientoTicketAdmin /> : <Navigate to="/login" />
            }
          />

        </Route>

        {/* Rutas solo para empleados */}
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>

          {/* ...otras rutas solo empleados */}
        </Route>

        {/* Rutas para admin, empleado y cliente */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "empleado", "cliente"]} />}>
        
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/seguimiento-cliente/:id"
            element={
              isAuthenticated ? <SeguimientoTicketCliente /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/crear-ticket"
            element={isAuthenticated ? <CrearTicket /> : <Navigate to="/login" />}
          />
          {/* ...otras rutas compartidas */}
        </Route>

        {/* Rutas para empleados y admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "empleado"]} />}>
          <Route
            path="/MisAsignaciones"
            element={
              isAuthenticated ? <MisAsignaciones /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/mis-asignaciones/:id"
            element={
              isAuthenticated ? <SeguimientoTicketEmpleado /> : <Navigate to="/login" />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
