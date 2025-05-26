import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    // No autenticado
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(usuario.rol)) {
    // No tiene el rol adecuado
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;