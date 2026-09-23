import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartService } from "../../api/cartService";

// 1. Cart Fetch Karo
export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartService.getCart();
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
  async ({ productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const res = await cartService.addToCart({
        productId,
        quantity,
        size,
        color,
      }); // ✅ size, color bhi bhej rahe hain
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
  async ({ productId, size, color }, { rejectWithValue }) => {
    // ✅ ab object leta hai
    try {
      const res = await cartService.removeFromCart(productId, size, color);
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
  async ({ productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const res = await cartService.updateQuantity({
        productId,
        quantity,
        size,
        color,
      }); // ✅ size, color bhi bhej rahe hain
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
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

// ─── Initial State ───────────────────────────────
const initialState = {
  cart: null,
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
      state.cart = action.payload;
    };

    builder
      .addCase(getCart.pending, handlePending)
      .addCase(getCart.fulfilled, handleCartFulfilled)
      .addCase(getCart.rejected, handleRejected)

      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleCartFulfilled)
      .addCase(addToCart.rejected, handleRejected)

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleCartFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)

      .addCase(updateQuantity.pending, handlePending)
      .addCase(updateQuantity.fulfilled, handleCartFulfilled)
      .addCase(updateQuantity.rejected, handleRejected)

      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
