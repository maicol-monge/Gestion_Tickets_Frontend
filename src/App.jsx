import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Empresa from "../src/pages/crearUsuariosInternos";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Empresa />} />
        
      </Routes>
    </Router>
  );
}

export default App
