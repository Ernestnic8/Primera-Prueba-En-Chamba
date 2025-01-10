import { MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { nuevoProducto, actualizarProducto, categoriasApi } from "../../../api/ecommerce/productosApi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const RegistroProductoContainer = ({ producto }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    categoriasApi().then((res) => {
      setCategories(res.data.response);
    });

    // Si el producto existe, setear valores en el formulario para actualización
    if (producto) {
      setValue("titulo", producto.titulo);
      setValue("precio", producto.precio);
      setValue("categoriaId", producto.categoriaId);
      setValue("imagen", producto.imagen);
    }
  }, [producto, setValue]);

  const handleUser = (data) => {
    const action = producto ? actualizarProducto : nuevoProducto; // Elige función según operación
    action(data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: producto ? "Producto actualizado" : "Producto registrado",
          color: "green",
          confirmButtonColor: "green",
        });
        nav("/ecommerce/productos");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: producto ? "Error al actualizar el producto" : "Error al ingresar el producto",
          text: error.response?.data?.message || "Error desconocido",
          color: "red",
          confirmButtonColor: "red",
        });
      });
  };

  return (
    <div className="registro">
      <form onSubmit={handleSubmit(handleUser)}>
        <div>
          <label className="label">Título</label>
        </div>
        <TextField
          name="titulo"
          label="Título"
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
          <label className="label">Categoría</label>
        </div>
        <Select
          name="categoriaId"
          label="Categoría"
          defaultValue=""
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
          <label className="label">Enlace de la Imagen</label>
        </div>
        <TextField
          name="imagen"
          label="Imagen"
          variant="filled"
          required
          {...register("imagen")}
        />
        <div>
          <button className="boton" type="submit">
            {producto ? "Actualizar" : "Ingresar"}
          </button>
        </div>
        <div>
          <button className="boton" onClick={() => nav("/ecommerce/productos")}>
            Regresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroProductoContainer;
