// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: (localStorage.getItem("persist:root") 
//   ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.user : null)||null,
//   token: localStorage.getItem("persist:root") 
//     ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token  // Extract the token
//     : null,
//   loading: false,
//   error: null
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       state.user = action.payload.user; // Store user
//       state.token = action.payload.token;
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//       localStorage.setItem("token", action.payload.token);
//     },
//     logoutUser(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { setUser, logoutUser } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const persistedState = localStorage.getItem("persist:root");
const parsedUser = persistedState ? JSON.parse(JSON.parse(persistedState).user)?.currentUser : null;

const initialState = {
  user: parsedUser?.user || null, // Ensure user exists before accessing
  token: parsedUser?.token || null, // Ensure token exists before accessing
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user; // Store user
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logoutUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
