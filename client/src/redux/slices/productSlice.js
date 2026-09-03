import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsService } from "../../api/productService";

// ─── Async Thunks ─────────────────────────────────────

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await productsService.createProduct(productData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product creation failed",
      );
    }
  },
);

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productsService.getProducts();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await productsService.getProductById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

// 🆕 Update thunk — id + updated data dono chahiye
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await productsService.updateProduct(id, productData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Product update failed",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await productsService.deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const fetchSearch = createAsyncThunk(
  "fetch/search",
  async (query, { rejectWithValue }) => {
    try {
      const res = await productsService.getSearch(query);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to search products",
      );
    }
  },
);

// ─── Slice ─────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product || action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.product || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🆕 Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.product || action.payload;
        // List mein bhi update karo (agar wahan se list dikha rahe ho)
        state.products = state.products.map((p) =>
          p._id === updated._id ? updated : p,
        );
        // Current single-product state bhi update karo
        state.product = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.products = action.payload.products || action.payload;
        state.loading = false;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
