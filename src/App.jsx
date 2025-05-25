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


import CustomNavbar from "./components/CustomNavbar";

import CrearTicket from "./pages/CrearTicket";
import GestionTicket from "./pages/GestionTicket";

import MisAsignaciones from './pages/MisAsignaciones';



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
        {/* Ruta raíz: muestra Home si está logueado, si no, va a Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/crear-usuario-interno"
          element={isAuthenticated ? <CrearUsuarioInterno /> : <Navigate to="/login" />}
        />

         <Route
          path="/gestion-usuarios"
          element={isAuthenticated ? <UsuariosFiltros /> : <Navigate to="/login" />}
        />

        <Route
          path="/crear-usuario-externo"
          element={isAuthenticated ? <CrearUsuarioExterno /> : <Navigate to="/login" />}
        />

        {/* Página de login: si ya está autenticado, redirige a Home */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Ruta protegida para Empresa */}
        { <Route
          path="/gestion-empresa"
          element={isAuthenticated ? <Empresa /> : <Navigate to="/login" />}
        /> }

        {/* Ruta para crear tickets */}
        <Route
          path="/crear-ticket"
          element={isAuthenticated ? <CrearTicket /> : <Navigate to="/login" />}
        />

        {/* Ruta para filtrar usuarios */}
        <Route
          path="/filtrar"
          element={isAuthenticated ? <FiltrarUsuarios /> : <Navigate to="/login" />}
        />


        {/* Ruta para gestionar tickets */}
        <Route
          path="/gestion-tickets"
          element={isAuthenticated ? <GestionTicket /> : <Navigate to="/login" />}
        />

        <Route
        path="/MisAsignaciones"  // Ruta absoluta con /
        element={isAuthenticated ? <MisAsignaciones /> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
