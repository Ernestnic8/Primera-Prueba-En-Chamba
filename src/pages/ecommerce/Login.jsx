import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { obtenerUsuarios } from "../../api/ecommerce/userApi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import propTypes from "prop-types";
import Swal from "sweetalert2";

const Login = ({setIsLogged}) => {
  const [user, setUser] = useState([]);
  let usuario = [];
  const nav = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    usuario = user.find((element) => element.email === data.email);
    if (usuario === undefined) {
      Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
        color: "red",
        text: "Por favor, registrate",
        confirmButtonColor: "red",
      });
    } else {
      if (usuario.password === data.password) {
        setIsLogged(true);
        nav("/productos");
      } else {
        Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
          color: "red",
          text: "Por favor, intenta de nuevo",
          confirmButtonColor: "red",
        });
      }
    }
  };

  useEffect(() => {
    obtenerUsuarios().then((res) => {
      setUser(res.data);
    });
  }, []);
  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
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
          values={usuario.password}
          {...register("password")}
        />
        <div>
          <button className="boton" type="submit">
            Ingresar
          </button>
        </div>
        <div>
          <span>
            <a></a>
            <a></a>
            ¿No tienes cuenta?
          </span>
          <label className="registrar" onClick={() => nav("/registro")}>
            Registrarse
          </label>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  setIsLogged: propTypes.func,
};

export default Login;
