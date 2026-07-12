import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartService } from "../../api/cartService";

// 1. Cart Fetch Karo
export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartService.getCart(); // ✅ await + sahi naam
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// 2. Cart Mein Add Karo
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartService.addToCart(productId, quantity); // ✅
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

// 3. Item Remove Karo
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await cartService.removeFromCart(productId);
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

// 4. Quantity Update Karo
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartService.updateQuantity(productId, quantity);
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity",
      );
    }
  },
);

// 5. Cart Clear Karo
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return null; // cart khali ho gayi
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

// ─── Initial State ───────────────────────────────
const initialState = {
  cart: null, // pura cart object (items + totalPrice)
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper — repeated pattern handle karne ke liye
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    const handleCartFulfilled = (state, action) => {
      state.loading = false;
      state.cart = action.payload; // cart update ho gaya
    };

    builder
      // Get Cart
      .addCase(getCart.pending, handlePending)
      .addCase(getCart.fulfilled, handleCartFulfilled)
      .addCase(getCart.rejected, handleRejected)

      // Add to Cart
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleCartFulfilled)
      .addCase(addToCart.rejected, handleRejected)

      // Remove From Cart
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleCartFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)

      // Update Quantity
      .addCase(updateQuantity.pending, handlePending)
      .addCase(updateQuantity.fulfilled, handleCartFulfilled)
      .addCase(updateQuantity.rejected, handleRejected)

      // Clear Cart
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null; // ✅ cart khali
      })
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
