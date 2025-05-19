import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
//import Filtro from "../components/Filtro";
import Ticket from "../components/Ticket";

import ListaTickets from "../components/ListaTickets";
import "../styles/Home.css";

const Home = () => {
  //const logout = () => {};
  return (
    <div className="home-container" style={{}}>
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
