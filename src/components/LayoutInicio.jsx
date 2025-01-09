import { Link } from "react-router-dom"

const LayoutInicio = () => {
  return (
    <div>
      <nav>
        <ul className="nav-container1">
          <li className="li1">
            <Link to="/fakeapi" >Platzi</Link>
          </li>
          <li className="li1">
            <Link to={"/ecommerce"} >Ecommerce</Link>
          </li>
          <li className="li1">
            <Link to="/" >Inicio</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default LayoutInicio
