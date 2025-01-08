import {Link } from "react-router-dom";
import "../App.css";

const Layout = () => {
  return (
    <header className="header">

       <nav>
        <ul className="nav-container">
          <li>
            <Link to="/fakeapi/home">Productos</Link>
          </li>
          <li>
            <Link to="/fakeapi/users">Usuarios</Link>
          </li>
          <li className="active">
            <Link to="/">Cerrar sesion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Layout
