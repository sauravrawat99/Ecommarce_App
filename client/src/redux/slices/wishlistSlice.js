import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../api/wishlistService";

// 1. Wishlist fetch karo
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistService.getWishlist();
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Wishlist not found",
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

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
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

      // ADD
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
