import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiProductPost } from "../../api/producto/apiProducts";
import Swal from "sweetalert2";

const RegistroProductContainer = () => {
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const handleUser = (data) => {
    apiProductPost(data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Producto registrado",
          color: "green",
          confirmButtonColor: "green",
        });
        nav("/home");
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
          name="title"
          label="Title"
          variant="filled"
          required
          {...register("title")}
        />
        <div>
          <label className="label">price</label>
        </div>
        <TextField
          name="price"
          label="Price"
          variant="filled"
          required
          type="number"
          {...register("price")}
        />
        <div>
          <label className="label">description</label>
        </div>
        <TextField
          name="description"
          label="Description"
          variant="filled"
          required
          {...register("description")}
        />
        <div>
          <label className="label">CategoryId</label>
        </div>
        <TextField
          name="categoryId"
          label="CategoryId"
          variant="filled"
          required
          {...register("categoryId")}
        />
        <div>
          <label className="label">Link Img</label>
        </div>
        <TextField
          name="images"
          label="Images"
          variant="filled"
          required
          {...register("images[0]")}
        />
        <div>
          <button className="boton" type="submit">
            Ingresar
          </button>
        </div>
        <div>
          <button className="boton" onClick={() => nav("/home")}> Regresar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroProductContainer;
