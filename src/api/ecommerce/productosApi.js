import axios from "axios";

const obtenerProductos = () => axios.get("https://fakestoreapi.com/products");
const nuevoProducto = (data) => axios.post("https://fakestoreapi.com/products", data);
const actualizarProducto = (id, data) => axios.put(`https://fakestoreapi.com/products/${id}`, data);
const eliminarProducto = (id) => axios.delete(`https://fakestoreapi.com/products/${id}`);

export { obtenerProductos, nuevoProducto, actualizarProducto, eliminarProducto };