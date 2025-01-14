import { createSlice } from "@reduxjs/toolkit";

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    data: []
  },
  reducers: {
    login(state, action) {
      state.data.push(action.payload);
    },
    logout(state) {
      state.data = [];
    },
  },
});

export const { login, logout } = usuarioSlice.actions;
export default usuarioSlice.reducer;
