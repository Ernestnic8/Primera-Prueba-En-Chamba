import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import ListUserPages from "../pages/ecommerce/pages/ListUserPages";
import Layout from "../components/Layout";
import Login from "../pages/ecommerce/Login";
import ListProductPage from "../pages/ecommerce/pages/ListProductPage";
import RegistroUsuarioPage from "../pages/ecommerce/pages/RegistroUsuarioPage";
import RegistroProductoPage from "../pages/ecommerce/pages/RegistroProductoPage";

const Ecommerce = () => {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
        <Routes>
          <Route
            path="*"
            element={<h1 className="not-found">Error 401 Not Found</h1>}
          />
          <Route
            index
            path="/"
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
                <Navigate to="/" />
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
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/usuario/*"
            element={
              isLogged ? (
                <>
                  {" "}
                  <Layout /> <ListUserPages />{" "}
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
    </>
  );
};

export default Ecommerce;
