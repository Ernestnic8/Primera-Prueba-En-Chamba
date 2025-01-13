import { createSlice } from "@reduxjs/toolkit";

const carritoSlice = createSlice({
  name: "carrito",
  initialState: {
    data: [],
  },
  reducers: {
    agregarProducto(state, action) {
      state.data.push(action.payload);
    },
    eliminarProducto(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
    actualizarCantidad(state, action) {
      const { id, cantidad } = action.payload;
      const index = state.data.findIndex((item) => item.id === id);
      state.data[index].cantidad = cantidad;
    },
    limpiarCarrito(state) {
      state.data = [];
    },
    leerCarrito(state, action) {
      state.data = action.payload;
    },
  },
});

export const { agregarProducto, eliminarProducto, actualizarCantidad, limpiarCarrito,leerCarrito } = carritoSlice.actions;

export default carritoSlice.reducer;