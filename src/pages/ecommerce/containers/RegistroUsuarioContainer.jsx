import { TextField } from "@mui/material";
import { nuevoUsuario } from "../../../api/ecommerce/userApi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistroUsuarioContainer = () => {
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const handleUser = (data) => {
    nuevoUsuario(data)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Usuario registrado",
          color: "green",
          confirmButtonColor: "green",
        }).then(() => {
          nav("/login2");
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error al ingresar el usuario",
          color: "red",
          confirmButtonColor: "red",
      });
    });
  };
  return (
    <div className="registro">
      <form onSubmit={handleSubmit(handleUser)}>
        <div>
          <label className="label">Nombre</label>
        </div>
        <TextField
          name="nombre"
          label="Nombre"
          variant="filled"
          required
          {...register("nombre")}
        />
        <div>
          <label className="label">Apellido</label>
        </div>
        <TextField
          name="apellido"
          label="Apellido"
          variant="filled"
          required
          {...register("apellido")}
        />
        <div>
          <label className="label">Usuario</label>
        </div>
        <TextField
          name="usuario"
          label="Ususario"
          variant="filled"
          required
          {...register("usuario")}
        />
        <div>
          <label className="label">Contraseña</label>
        </div>
        <TextField
          name="pass"
          label="pass"
          variant="filled"
          required
          type="password"
          {...register("pass")}
        />
        <div>
          <label className="label">Telefono</label>
        </div>
        <TextField
          name="telefono"
          label="Telefono"
          variant="filled"
          required
          {...register("telefono")}
        />
        <div>
          <button className="boton" type="submit">
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroUsuarioContainer;
