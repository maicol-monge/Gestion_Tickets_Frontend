import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Empresa from "../src/pages/crudEmpresa(test)";


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
