import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    username: null,
    role: null,
    process_ids: [],
    form_ids: [],
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username || null;
      state.role = action.payload.role || null;
      state.process_ids = action.payload.process_ids || [];
      state.form_ids = action.payload.form_ids || [];
      
      // Redux Persist will automatically save these to localStorage
    },

    logout: (state) => {
      state.token = null;
      state.username = null;
      state.role = null;
      state.process_ids = [];
      state.form_ids = [];
      
      // Redux Persist will automatically clear these from localStorage
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;