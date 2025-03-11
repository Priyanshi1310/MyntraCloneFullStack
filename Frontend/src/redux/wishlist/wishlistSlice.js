import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  console.log("wishlistSLice",response)
  return response.data;
});

export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async ({ userId, product }) => {
  const response = await axios.put(`${API_URL}/${userId}`, { products: [product] });
  return response.data;
});

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async ({ userId, productId }, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${userId}/${productId}`);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error removing item");
  }
});

export const clearWishlist = createAsyncThunk("wishlist/clearWishlist", async (userId) => {
  await axios.delete(`${API_URL}/${userId}`);
  return userId;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload.products; // ✅ Ensure data structure is correct
    })
    .addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        console.log("Before removal:", state.items);  // Debugging
        state.items = state.items.filter((item) => item.productId !== action.payload);
        console.log("After removal:", state.items);  // Debugging
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        console.error("Failed to remove item:", action.payload);
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});


export default wishlistSlice.reducer;
