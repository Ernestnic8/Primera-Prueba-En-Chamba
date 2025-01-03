import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { obtenerUsuarios } from "../../api/ecommerce/userApi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import propTypes from "prop-types";
import Swal from "sweetalert2";

const Login = ({setIsLogged}) => {
  const [user, setUser] = useState([]);
  var usuario = [];
  const nav = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    usuario = user.find((element) => element.usuario === data.usuario);
    if (usuario === undefined) {
      Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
        color: "red",
        text: "Por favor, registrate",
        confirmButtonColor: "red",
      });
    } else {
      if (usuario.pass === data.pass) {
        setIsLogged(true);
        usuario = [];
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
      setUser(res.data.response);
    });
  }, []);
  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label">Usuario</label>
        </div>
        <TextField
          name="usuario"
          label="Usuario"
          variant="filled"
          required
          {...register("usuario")}
        />
        <div>
          <label className="label">password</label>
        </div>
        <TextField
          name="pass"
          label="Contraseña"
          variant="filled"
          required
          type="password"
          values={usuario.password}
          {...register("pass")}
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
