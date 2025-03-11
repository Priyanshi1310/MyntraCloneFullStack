// import { createSlice } from "@reduxjs/toolkit";

// // Define initial state for the products slice
// const initialState = {
//   products: [],
//   filteredProducts: [],
//   categorySelected: null,
//   sortOption: "Recommended",
//   searchTerm: "",
//   totalQuantity: 0,
// };

// // Create a product slice with reducers
// const productSlice = createSlice({
//   name: "products", // Slice name
//   initialState, // Initial state
//   reducers: {
//     setProducts: (state, action) => {
//       state.products = action.payload;
//     },
//     // Reducer to update products and filteredProducts arrays
//     fetchProducts: (state, action) => {
//       state.products = action.payload;
//       state.filteredProducts = action.payload;
//     },
//     // Reducer to select a category and filter products accordingly
//     selectCategory: (state, action) => {
//       state.categorySelected = action.payload;
//       const category = action.payload;
//       state.filteredProducts = state.products.filter(
//         (product) => product.category === category
//       );
//     },
//     // Reducer to select a sorting option and sort products accordingly
//     selectSortBy: (state, action) => {
//       state.sortOption = action.payload;
//       if (state.sortOption === "Price : High to Low") {
//         state.filteredProducts = state.filteredProducts.sort(
//           (a, b) => b.price - a.price
//         );
//       } else if (state.sortOption === "Price : Low to High") {
//         state.filteredProducts = state.filteredProducts.sort(
//           (a, b) => a.price - b.price
//         );
//       } else if (state.sortOption === "Customer Rating") {
//         state.filteredProducts = state.filteredProducts.sort(
//           (a, b) => b.rating.rate - a.rating.rate
//         );
//       }
//     },
//     // Reducer to clear selected category and reset filtered products
//     selectClearAll: (state) => {
//       state.filteredProducts = state.products;
//       state.categorySelected = null;
//     },
//     // Reducer to set the search term and filter products accordingly
//     setSearchTerm: (state, action) => {
//       const searchInput = action.payload || "";
//       state.searchTerm = searchInput;

//       if (searchInput.trim() === "") {
//         state.filteredProducts = state.categorySelected
//           ? (state.filteredProducts = state.products.filter(
//               (product) => product.category === state.categorySelected
//             ))
//           : state.products;
//       } else {
//         const searchLower = searchInput.toLowerCase();
//         state.filteredProducts = state.filteredProducts.filter((product) =>
//           product.title.toLowerCase().includes(searchLower)
//         );
//       }
//     },
//     // Reducer to set the total quantity of items in the bag
//     setTotalQuantity: (state, action) => {
//       state.totalQuantity = action.payload;
//     },
//   },
// });

// // Export action creators and reducer from the product slice
// export const {
//   setProducts ,
//   fetchProducts,
//   selectCategory,
//   selectSortBy,
//   selectClearAll,
//   setSearchTerm,
//   setTotalQuantity,
// } = productSlice.actions;
// export default productSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../config";
import axios from "axios";

const API_URL = `${BASE_URL}/products`;

// **Async Thunk to Fetch Products from MongoDB**
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL , {withCredentials:true});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

// **Initial State**
const initialState = {
  products: [],
  filteredProducts: [],
  categorySelected: null,
  sortOption: "Recommended",
  searchTerm: "",
  totalQuantity: 0,
  loading: false,
  error: null,
};

// **Create Product Slice**
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // **Set Products Manually**
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },

    // **Select Category & Filter Products**
    selectCategory: (state, action) => {
      state.categorySelected = action.payload;
      state.filteredProducts = state.products.filter(
        (product) => product.category === action.payload
      );
    },

    // **Sort Products Based on Option**
    selectSortBy: (state, action) => {
      state.sortOption = action.payload;

      if (state.sortOption === "Price : High to Low") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => b.price - a.price
        );
      } else if (state.sortOption === "Price : Low to High") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => a.price - b.price
        );
      } else if (state.sortOption === "Customer Rating") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => b.rating - a.rating
        );
      }
    },

    // **Clear Category Selection**
    selectClearAll: (state) => {
      state.categorySelected = null;
      state.filteredProducts = state.products;
    },

    // **Set Search Term & Filter Products**
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload.toLowerCase();

      if (!state.searchTerm.trim()) {
        state.filteredProducts = state.categorySelected
          ? state.products.filter(
              (product) => product.category === state.categorySelected
            )
          : state.products;
      } else {
        state.filteredProducts = state.products.filter((product) =>
          product.title.toLowerCase().includes(state.searchTerm)
        );
      }
    },

    // **Set Total Quantity of Items in Cart**
    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// **Export Actions & Reducer**
export const {
  setProducts,
  selectCategory,
  selectSortBy,
  selectClearAll,
  setSearchTerm,
  setTotalQuantity,
} = productSlice.actions;
export default productSlice.reducer;
