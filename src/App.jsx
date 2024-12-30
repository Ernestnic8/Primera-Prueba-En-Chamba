import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import RegistroUserPage from "./pages/usuarios/RegistroUserPage";
import ListProductPage from "./pages/productos/ListProductPage";
import { useState } from "react";
import RegistroProductPage from "./pages/productos/RegistroProductPage";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<h1 className="not-found">Error 401 Not Found</h1>} />
          <Route path="/" element={<Login setIsLogged={setIsLogged} /> } />
          <Route path="/register" element={<RegistroUserPage />} />
          <Route path="/home" element={isLogged?(<ListProductPage/>): (<Navigate to="/"/>)} />
          <Route path="/home/register/*" element={isLogged?(<RegistroProductPage/>): (<Navigate to="/"/>)} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
