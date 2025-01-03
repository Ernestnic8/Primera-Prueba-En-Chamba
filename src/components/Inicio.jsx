import { useNavigate } from "react-router-dom"

const Inicio = () => {
    const nav = useNavigate()
  return (
    <div>
      <button className="boton" onClick={()=>nav("/fakeapi")} >FakeApi</button>
      <button className="boton" onClick={()=>nav("ecommerce")} >Ecommerce</button>
    </div>
  )
}

export default Inicio
