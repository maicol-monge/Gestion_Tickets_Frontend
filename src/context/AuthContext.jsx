import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar carga inicial

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUsuario = localStorage.getItem("usuario");

        if (token && storedUsuario) {
          // Verifica que storedUsuario no sea "undefined" como string
          if (storedUsuario && storedUsuario !== "undefined") {
            setIsAuthenticated(true);
            setUsuario(JSON.parse(storedUsuario));
          } else {
            // Si hay token pero usuario inválido, limpiamos
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Limpiamos el localStorage en caso de error
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token, usuario) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setIsAuthenticated(true);
      setUsuario(usuario);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setIsAuthenticated(false);
      setUsuario(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        usuario,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
