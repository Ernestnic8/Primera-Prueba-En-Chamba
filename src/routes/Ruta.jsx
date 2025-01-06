import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import RegistroUserPage from "../pages/usuarios/RegistroUserPage";
import ListProductPage from "../pages/productos/ListProductPage";
import { useState } from "react";
import RegistroProductPage from "../pages/productos/RegistroProductPage";
import ListUserPages from "../pages/usuarios/ListUserPages";
import Layout from "../components/Layout";

const Ruta = () => {
    const [isLogged, setIsLogged] = useState(false);
    return (
      <>
          <Routes>
            <Route path="*" element={<h1 className="not-found">Error 401 Not Found</h1>} />
            <Route index path="/" element={<Login setIsLogged={setIsLogged} /> } />
            <Route path="register" element={<RegistroUserPage />} />
            <Route path="home" element={isLogged?(<><Layout/><ListProductPage/></>): (<Navigate to="/login"/>)} />
            <Route path="home/register/*" element={isLogged?(<><Layout/> <RegistroProductPage/></>): (<Navigate to="/login"/>)} />
            <Route path="users/*" element={isLogged?(<> <Layout/> <ListUserPages/> </>): (<Navigate to="/login"/>)} />
          </Routes>
      </>
    );
}

export default Ruta
