import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../api/wishlistService";

// ---------- Thunks ----------

// 1. Wishlist fetch karo
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistService.getWishlist();
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// 2. Wishlist mein add karo
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await wishlistService.addToWishlist(productId);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add product",
      );
    }
  },
);

// 3. Wishlist se remove karo
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove product",
      );
    }
  },
);

// ---------- Slice ----------

const initialState = {
  items: [],
  loading: false, // getWishlist (fetch) ke liye
  mutating: false, // add/remove ke liye — separate rakha taaki fetch aur mutation ka loading UI mix na ho
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    // logout par wishlist reset karne ke liye
    resetWishlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ----- GET -----
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- ADD -----
      .addCase(addToWishlist.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.mutating = false;
        state.items = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      // ----- REMOVE -----
      .addCase(removeFromWishlist.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.mutating = false;
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
