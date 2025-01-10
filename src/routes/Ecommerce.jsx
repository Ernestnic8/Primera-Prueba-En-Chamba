import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import ListUserPages from "../pages/ecommerce/pages/ListUserPages";
import Login from "../pages/ecommerce/Login";
import ListProductPage from "../pages/ecommerce/pages/ListProductPage";
import RegistroUsuarioPage from "../pages/ecommerce/pages/RegistroUsuarioPage";
import RegistroProductoPage from "../pages/ecommerce/pages/RegistroProductoPage";
import LayoutEcomm from "../components/LayoutEcomm";
import LayoutInicio from "../components/LayoutInicio";
import ComprarProducto from "../pages/ecommerce/components/ComprarProducto";

const Ecommerce = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState([]);
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
          element={
            <>
              <LayoutInicio/>
              <Login setIsLogged={setIsLogged} Usuario={setUser} />{" "}
            </>
          }
        />
        <Route path="/registro" element={<RegistroUsuarioPage />} />
        <Route
          path="/productos"
          element={
            isLogged ? (
              <>
                <LayoutEcomm />
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
                <LayoutEcomm /> <RegistroProductoPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/producto/compra"
          element={
            isLogged ? (
              <>
                <LayoutEcomm /> <ComprarProducto usuario={user} />
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
                <LayoutEcomm /> <ListUserPages />{" "}
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
