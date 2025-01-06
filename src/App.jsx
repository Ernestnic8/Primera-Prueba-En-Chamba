import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Inicio from "./components/Inicio";
import Ecommerce from "./routes/Ecommerce";
import Ruta from "./routes/Ruta";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio/>} />
        <Route path="/fakeapi/*" element={<Ruta />} />
        <Route path="/ecommerce/*" element={<Ecommerce />} />
        <Route path="*" element={<h1 className="not-found">Error 401 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
