import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
//import Filtro from "../components/Filtro";
import Ticket from "../components/Ticket";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ListaTickets from "../components/ListaTickets";

const Home = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //const logout = () => {};
  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div>
        <a className="btn btn-danger" onClick={handleLogout}>
          Logout
        </a>
      </div>
      <div className="d-flex justify-content-center pt-3">
        <div style={{ width: "75%" }}>
          {/* Controla el ancho máximo */}
          <ListaTickets />
        </div>
      </div>
    </div>
  );
};

export default Home;
