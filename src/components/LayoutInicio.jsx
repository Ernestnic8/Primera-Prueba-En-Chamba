import { Link } from "react-router-dom"

const LayoutInicio = () => {
  return (
    <div>
      <nav>
        <ul className="nav-container">
          <li className="li">
            <Link to="/" >Inicio</Link>
          </li>
          <li className="li">
            <Link to="/fakeapi" >Platzi</Link>
          </li>
          <li className="li active">
            <Link to={"/ecommerce"} >Ecommerce</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default LayoutInicio
