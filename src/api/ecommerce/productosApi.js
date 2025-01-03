import axios from "axios";

const obtenerProductos = () => axios.get("http://localhost:13052/api/Producto/Lista");
const nuevoProducto = (data) => axios.post("http://localhost:13052/api/Producto/Guardar", data);
const actualizarProducto = (id, data) => axios.put(`http://localhost:13052/api/Producto/Editar/${id}`, data);
const eliminarProducto = (id) => axios.delete(`http://localhost:13052/api/Producto/Eliminar/${id}`);

const categoriasApi =()=> axios.get("http://localhost:13052/api/Categoria/Lista");

export { categoriasApi ,obtenerProductos, nuevoProducto, actualizarProducto, eliminarProducto };