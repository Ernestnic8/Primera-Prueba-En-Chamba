import { TextField } from "@mui/material";
import { apiUsersPost } from "../../api/usuario/apiUsers";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const RegistroUserContainer = () => {
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const handleUser = (data) => {
    apiUsersPost(data)
      .then((res) => {
        console.log(res);
        nav("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="registro">
      <form onSubmit={handleSubmit(handleUser)}>
        <div>
          <label className="label">Nombre</label>
        </div>
        <TextField
          name="name"
          label="Nombre"
          variant="filled"
          required
          {...register("name")}
        />
        <div>
          <label className="label">email</label>
        </div>
        <TextField
          name="email"
          label="Email"
          variant="filled"
          required
          type="email"
          {...register("email")}
        />
        <div>
          <label className="label">password</label>
        </div>
        <TextField
          name="password"
          label="password"
          variant="filled"
          required
          type="password"
          {...register("password")}
        />
        <div>
          <label className="label">Link Img</label>
        </div>
        <TextField
          name="avatar"
          label="avatar"
          variant="filled"
          required
          {...register("avatar")}
        />
        <div>
          <button className="boton" type="submit">
            Ingresar
          </button>
        </div>
        <div></div>
      </form>
    </div>
  );
};

export default RegistroUserContainer;
