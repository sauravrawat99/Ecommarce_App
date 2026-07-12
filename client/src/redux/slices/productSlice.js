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

// ─── Slice ─────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [], // list ke liye — array
    product: null, // single product detail ke liye — object
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
        // Backend "product" key bhejta hai single object ke liye bhi
        state.products.push(action.payload.product || action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All — FIX: state.products (plural) update karo, state.product nahi
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Backend "product" key mein array bhejta hai (tera console.log se confirm hua)
        state.products = action.payload.product || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One — single product ke liye state.product hi sahi hai
      // Fetch One
      .addCase(fetchProductById.pending, (state) => {
        // ✅ add karo
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false; // ✅ add karo
        state.product = action.payload.product || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        // ✅ add karo
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
