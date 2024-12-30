import axios from "axios";

const apiCategoriesGet = () => axios.get("https://api.escuelajs.co/api/v1/categories");

export { apiCategoriesGet };