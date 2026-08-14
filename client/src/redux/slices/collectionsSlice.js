import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collectionService } from "../../api/collectionsService";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ---------------------------------------------------------------------------
// Async Thunks
// ---------------------------------------------------------------------------

export const fetchAllCollections = createAsyncThunk(
  "collection/fetchAllCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await collectionService.getAllCollection();
      return response.data.allCollections || response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCollectionBySlug = createAsyncThunk(
  "collection/fetchCollectionBySlug",
  async ({ slug, queryParams }, { rejectWithValue }) => {
    try {
      const response = await collectionService.getBySlug(slug, queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createCollection = createAsyncThunk(
  "collection/createCollection",
  async (collectionData, { rejectWithValue }) => {
    try {
      const response = await collectionService.createCollection(collectionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCollection = createAsyncThunk(
  "collection/updateCollection",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await collectionService.updateCollection(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCollection = createAsyncThunk(
  "collection/deleteCollection",
  async (id, { rejectWithValue }) => {
    try {
      await collectionService.deleteCollection(id);
      return id; 
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------
const initialState = {
  collections: [], // navbar/listing ke liye saare collections
  currentCollection: null, // slug page pe active collection
  products: [], // currentCollection ke products
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: false, // list fetch loading
  detailLoading: false, // slug-based detail fetch loading (separate rakha taaki dono UI states independent rahein)
  actionLoading: false, // create/update/delete loading (admin actions)
  error: null,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    clearCollectionError: (state) => {
      state.error = null;
    },
    clearCurrentCollection: (state) => {
      // jab user collection page se navigate away kare, stale data na dikhe isliye
      state.currentCollection = null;
      state.products = [];
      state.pagination = initialState.pagination;
    },
    setCollectionPage: (state, action) => {
      // pagination ke "next/prev" button pe dispatch karo, phir fetchCollectionBySlug
      // ko naye page number ke saath dobara call karo
      state.pagination.currentPage = action.payload;
    },
    resetCollectionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ---------------- fetchAllCollections ----------------
      .addCase(fetchAllCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchAllCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- fetchCollectionBySlug ----------------
      .addCase(fetchCollectionBySlug.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchCollectionBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentCollection = action.payload.collection;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCollectionBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // ---------------- createCollection ----------------
      .addCase(createCollection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.collections.push(action.payload);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ---------------- updateCollection ----------------
      .addCase(updateCollection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.collections.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) state.collections[index] = action.payload;
        if (state.currentCollection?._id === action.payload._id) {
          state.currentCollection = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ---------------- deleteCollection ----------------
      .addCase(deleteCollection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.collections = state.collections.filter(
          (c) => c._id !== action.payload,
        );
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCollectionError,
  clearCurrentCollection,
  setCollectionPage,
  resetCollectionState,
} = collectionSlice.actions;

export default collectionSlice.reducer;
