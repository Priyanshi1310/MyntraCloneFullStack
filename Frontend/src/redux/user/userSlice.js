// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../config";

const API_URL = `${BASE_URL}/auth`;

// Async function to check user authentication status
export const checkAuthStatus = createAsyncThunk("user/checkAuthStatus", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/current`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async function to handle user login
export const loginUser = createAsyncThunk("user/signin", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async function to handle user signup
export const signupUser = createAsyncThunk("user/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async function to handle user logout
export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return null;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Define initial state for the user slice
const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Create a user slice with reducers
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export default userSlice.reducer;
