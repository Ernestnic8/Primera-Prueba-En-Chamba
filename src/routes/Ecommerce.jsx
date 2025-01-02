import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import ListUserPages from "../pages/usuarios/ListUserPages";
import Layout from "../components/Layout";
import Login from "../pages/ecommerce/Login";
import ListProductPage from "../pages/ecommerce/pages/ListProductPage";
import RegistroUsuarioPage from "../pages/ecommerce/pages/RegistroUsuarioPage";
import RegistroProductoPage from "../pages/ecommerce/pages/RegistroProductoPage";

const Ecommerce = () => {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={<h1 className="not-found">Error 401 Not Found</h1>}
          />
          <Route
            index
            path="/login2"
            element={<Login setIsLogged={setIsLogged} />}
          />
          <Route path="/registro" element={<RegistroUsuarioPage/>} />
          <Route
            path="/productos"
            element={
              isLogged ? (
                <>
                  <Layout />
                  <ListProductPage />
                </>
              ) : (
                <Navigate to="/login2" />
              )
            }
          />
          <Route
            path="/producto/registro/*"
            element={
              isLogged ? (
                <>
                  <Layout /> <RegistroProductoPage />
                </>
              ) : (
                <Navigate to="/login2" />
              )
            }
          />
          <Route
            path="/users/*"
            element={
              isLogged ? (
                <>
                  {" "}
                  <Layout /> <ListUserPages />{" "}
                </>
              ) : (
                <Navigate to="/login2" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Ecommerce;
