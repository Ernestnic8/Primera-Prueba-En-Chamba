import { MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {nuevoProducto, categoriasApi} from "../../../api/ecommerce/productosApi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";


const RegistroProductoContainer = () => {
  const { register, handleSubmit } = useForm();
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    categoriasApi().then((res) => {
      setCategories(res.data.response);
    });
  }, []);

  const handleUser = (data) => {
    nuevoProducto(data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Producto registrado",
          color: "green",
          confirmButtonColor: "green",
        });
        nav("/productos");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al ingresar el producto",
          text: error.response.data.message,
          color: "red",
          confirmButtonColor: "red",
        });
      });
  };

  return (
    <div className="registro">
      <form onSubmit={handleSubmit(handleUser)}>
        <div>
          <label className="label">Title</label>
        </div>
        <TextField
          name="titulo"
          label="titulo"
          variant="filled"
          required
          {...register("titulo")}
        />
        <div>
          <label className="label">Precio</label>
        </div>
        <TextField
          name="precio"
          label="Precio"
          variant="filled"
          required
          type="number"
          {...register("precio")}
        />
        <div>
          <label className="label">CategoryId</label>
        </div>
        <Select
          name="id"
          label="nombre"
          defaultValue="1"
          required
          {...register("categoriaId")}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.nombre}
            </MenuItem>
          ))}
        </Select>
        <div>
          <label className="label">Link Img</label>
        </div>
        <TextField
          name="images"
          label="Images"
          variant="filled"
          required
          {...register("imagen")}
        />
        <div>
          <button className="boton" type="submit">
            Ingresar
          </button>
        </div>
        <div>
          <button className="boton" onClick={() => nav("/productos")}>
            {" "}
            Regresar
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegistroProductoContainer
