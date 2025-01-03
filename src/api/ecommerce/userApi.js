import axios from "axios";

const obtenerUsuarios = () => axios.get("http://localhost:13052/api/Usuario/Lista");
const nuevoUsuario = (data) => axios.post("http://localhost:13052/api/Usuario/Agregar", data);
const actualizarUsuario = (id, data) => axios.put(`http://localhost:13052/api/Usuario/Actualizar/${id}`, data);
const eliminarUsuario = (id) => axios.delete(`http://localhost:13052/api/Usuario/Eliminar/${id}`);

export { obtenerUsuarios, nuevoUsuario, actualizarUsuario, eliminarUsuario };