import axios from "axios";

const obtenerUsuarios = () => axios.get("https://fakestoreapi.com/users");
const nuevoUsuario = (data) => axios.post("https://fakestoreapi.com/users", data);
const actualizarUsuario = (id, data) => axios.put(`https://fakestoreapi.com/users/${id}`, data);
const eliminarUsuario = (id) => axios.delete(`https://fakestoreapi.com/users/${id}`);

export { obtenerUsuarios, nuevoUsuario, actualizarUsuario, eliminarUsuario };