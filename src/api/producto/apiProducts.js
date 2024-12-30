import axios from "axios";

const apiProductsGet = () => axios.get("https://api.escuelajs.co/api/v1/products");

const apiProductPost = (data) => axios.post("https://api.escuelajs.co/api/v1/products/", data);

const apiProductPut = (id, data) => axios.put(`https://api.escuelajs.co/api/v1/products/${id}`, data);

const apiProductDelete = (id) => axios.delete(`https://api.escuelajs.co/api/v1/products/${id}`);

export { apiProductsGet, apiProductPost, apiProductPut, apiProductDelete };