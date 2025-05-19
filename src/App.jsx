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
import Empresa from "./pages/crudEmpresa(test)";

import "react-bootstrap";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Ruta raíz: muestra Home si está logueado, si no, va a Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        {/* Página de login: si ya está autenticado, redirige a Home */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Ruta protegida para Empresa */}
        <Route
          path="/empresa"
          element={isAuthenticated ? <Empresa /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
