import axios from "axios";

const apiUsersGet = () => axios.get("https://api.escuelajs.co/api/v1/users");

const apiUsersPost = (data) => axios.post("https://api.escuelajs.co/api/v1/users", data);

const apiUsersPut = (id, data) => axios.put(`https://api.escuelajs.co/api/v1/users/${id}`, data);

const apiUsersDelete = (id) => axios.delete(`https://api.escuelajs.co/api/v1/users/${id}`);

export { apiUsersGet, apiUsersPost, apiUsersPut, apiUsersDelete };