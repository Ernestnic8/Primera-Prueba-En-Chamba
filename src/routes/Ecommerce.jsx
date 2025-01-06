import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import ListUserPages from "../pages/ecommerce/pages/ListUserPages";
import Login from "../pages/ecommerce/Login";
import ListProductPage from "../pages/ecommerce/pages/ListProductPage";
import RegistroUsuarioPage from "../pages/ecommerce/pages/RegistroUsuarioPage";
import RegistroProductoPage from "../pages/ecommerce/pages/RegistroProductoPage";
import LayoutEcomm from "../components/LayoutEcomm";

const Ecommerce = () => {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={<h1 className="not-found">Error 401 Not Found</h1>}
        />
        <Route index path="/" element={<Login setIsLogged={setIsLogged} />} />
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
                <LayoutEcomm />{" "}
                <RegistroProductoPage />
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
                <LayoutEcomm />{" "}
                <ListUserPages />{" "}
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
