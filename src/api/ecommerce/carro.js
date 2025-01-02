import axios from "axios";

const obtenerTodoCarro = () => axios.get("https://fakestoreapi.com/carts/");
const agregarNuevoCarro = (data) => axios.post("https://fakestoreapi.com/carts/", data);
const actualizarCarro = (id, data) => axios.put(`https://fakestoreapi.com/carts/${id}`, data);
const eliminarCarro = (id) => axios.delete(`https://fakestoreapi.com/carts/${id}`);

export { obtenerTodoCarro, agregarNuevoCarro, actualizarCarro, eliminarCarro };

