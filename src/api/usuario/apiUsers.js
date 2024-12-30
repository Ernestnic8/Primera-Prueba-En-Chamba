import axios from "axios";

const apiUsersGet = () => axios.get("https://api.escuelajs.co/api/v1/users");

const apiUsersPost = (data) => axios.post("https://api.escuelajs.co/api/v1/users", data);


export { apiUsersGet, apiUsersPost };