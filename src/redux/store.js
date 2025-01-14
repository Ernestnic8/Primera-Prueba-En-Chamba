import { configureStore } from "@reduxjs/toolkit";
import carritoReducer from "./carritoSlice";
import usuarioReducer from "./usuarioSlice";

const store = configureStore({
    reducer: {
        carrito: carritoReducer,
        usuario: usuarioReducer,
    },
});

export default store;