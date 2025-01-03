import {Link } from "react-router-dom";
import "../App.css";

const Layout = () => {
  return (
    <header className="header">

      {/* links de navegación */}
      <nav>
        <ul className="nav-container">
          <li>
            <Link to="/home">Productos</Link>
          </li>
          <li>
            <Link to="/users">Usuarios</Link>
          </li>
        </ul>
      </nav>
      {/* <nav>
        <ul className="nav-container">
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <Link to="/usuario">Usuarios</Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
}

export default Layout
