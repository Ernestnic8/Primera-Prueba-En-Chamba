import {Link } from "react-router-dom";
import "../App.css";

const LayoutEcomm = () => {
  return (
    <header className="header">

       <nav>
        <ul className="nav-container">
          <li>
            <Link to="/ecommerce/productos">Productos</Link>
          </li>
          <li>
            <Link to="/ecommerce/usuario">Usuarios</Link>
          </li>
          <li className="active">
            <Link to="/">Cerrar sesion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default LayoutEcomm
