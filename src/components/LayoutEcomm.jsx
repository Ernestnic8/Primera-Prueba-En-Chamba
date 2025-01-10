import { Link } from "react-router-dom";
import "../App.css";

const LayoutEcomm = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-container">
          <li className="li">
            <Link to="/ecommerce/productos">Productos</Link>
          </li>
          <li className="li">
            <Link to="/ecommerce/producto/compra">Comprar</Link>
          </li>
          <li className="li">
            <Link to="/ecommerce/usuario">Usuarios</Link>
          </li>
          <li className="li active">
            <Link to="/">Cerrar sesion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default LayoutEcomm;
