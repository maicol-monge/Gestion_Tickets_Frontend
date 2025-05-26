import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://localhost:7106/api/empresa";

const EmpresaPage = () => {
  const [empresas, setEmpresas] = useState([]);
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    nombre_empresa: "",
    direccion: "",
    nombre_contacto_principal: "",
    correo: "",
    telefono: "",
  });
  const [filtro, setFiltro] = useState("");
  const [empresaEncontrada, setEmpresaEncontrada] = useState(null);

  // Cargar todas las empresas
  const cargarEmpresas = async () => {
    try {
      const response = await axios.get(`${API_URL}/GetAll`);
      setEmpresas(response.data);
    } catch (error) {
      console.error("Error al cargar empresas", error);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  // Buscar empresa por nombre
  const buscarEmpresa = async () => {
    try {
      const response = await axios.get(`${API_URL}/Find/${filtro}`);
      setEmpresaEncontrada(response.data);
    } catch (error) {
      setEmpresaEncontrada(null);
      await Swal.fire({
        icon: "error",
        title: "Empresa no encontrada",
        text: "No se encontró ninguna empresa con ese nombre.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Agregar empresa
  const agregarEmpresa = async () => {
    try {
      await axios.post(`${API_URL}/Add`, nuevaEmpresa);
      setNuevaEmpresa({
        nombre_empresa: "",
        direccion: "",
        nombre_contacto_principal: "",
        correo: "",
        telefono: "",
      });
      cargarEmpresas();
      await Swal.fire({
        icon: "success",
        title: "Empresa agregada",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error al agregar empresa", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar la empresa.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Eliminar empresa
  const eliminarEmpresa = async (id) => {
    try {
      await axios.delete(`${API_URL}/Eliminar/${id}`);
      cargarEmpresas();
      await Swal.fire({
        icon: "success",
        title: "Empresa eliminada",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error al eliminar empresa", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la empresa.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Empresas</h2>

      <h3>Agregar Empresa</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nuevaEmpresa.nombre_empresa}
        onChange={(e) =>
          setNuevaEmpresa({ ...nuevaEmpresa, nombre_empresa: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Dirección"
        value={nuevaEmpresa.direccion}
        onChange={(e) =>
          setNuevaEmpresa({ ...nuevaEmpresa, direccion: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Contacto"
        value={nuevaEmpresa.nombre_contacto_principal}
        onChange={(e) =>
          setNuevaEmpresa({
            ...nuevaEmpresa,
            nombre_contacto_principal: e.target.value,
          })
        }
      />
      <input
        type="email"
        placeholder="Correo"
        value={nuevaEmpresa.correo}
        onChange={(e) =>
          setNuevaEmpresa({ ...nuevaEmpresa, correo: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={nuevaEmpresa.telefono}
        onChange={(e) =>
          setNuevaEmpresa({ ...nuevaEmpresa, telefono: e.target.value })
        }
      />
      <button onClick={agregarEmpresa}>Agregar</button>

      <h3>Buscar Empresa por Nombre</h3>
      <input
        type="text"
        placeholder="Nombre a buscar"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <button onClick={buscarEmpresa}>Buscar</button>

      {empresaEncontrada && (
        <div>
          <h4>Empresa encontrada:</h4>
          <p>
            <strong>{empresaEncontrada.nombre_empresa}</strong> -{" "}
            {empresaEncontrada.direccion} - {empresaEncontrada.telefono}
          </p>
        </div>
      )}

      <h3>Lista de Empresas</h3>
      <ul>
        {empresas.map((empresa) => (
          <li key={empresa.id_empresa}>
            <strong>{empresa.nombre_empresa}</strong> - {empresa.direccion} -{" "}
            {empresa.telefono}
            <button onClick={() => eliminarEmpresa(empresa.id_empresa)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmpresaPage;
