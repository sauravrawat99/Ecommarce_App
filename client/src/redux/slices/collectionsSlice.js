import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collectionService } from "../../api/collectionsService";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ---------------------------------------------------------------------------
// Async Thunks
// ---------------------------------------------------------------------------

export const getAllCollection = createAsyncThunk(
  "collections/fetchAllCollection",
  async (_, { rejectWithValue }) => {
    try {
      const res = await collectionService.getAllCollection();
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "collections not found"));
    }
  },
);

export const getBySlug = createAsyncThunk(
  "collections/getBySlug",
  async (slug, { rejectWithValue }) => {
    // ✅ fixed
    try {
      const res = await collectionService.getBySlug(slug);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "collection not found"));
    }
  },
);

// -----------------------------------------------------------------------------
// createSlice
// -----------------------------------------------------------------------------

export const collectionsSlice = createSlice({
  name: "collection",
  initialState: {
    count: 0,
    collections: [],
    collection: "",
    products: [],
    pagination: {
      // ✅ spelling fix + poora object
      currentPage: 1,
      perPage: 10,
      totalCount: 0,
      totalPages: 1,
    },
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;
        state.collections = action.payload.collections;
      })
      .addCase(getAllCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.collection = action.payload.collection;
        state.pagination = action.payload.pagination; // ✅ poora pagination object store karo
        state.count = action.payload.pagination.totalCount; // ✅ agar sirf count chahiye alag se bhi
      })
      .addCase(getBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;
