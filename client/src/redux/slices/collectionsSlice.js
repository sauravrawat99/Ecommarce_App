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

// ✅ filters (minPrice, maxPrice, brand, category, size, color, sort_by) sab
//    URL se aate hain aur "filters" object ke andar pass hote hain
export const getBySlug = createAsyncThunk(
  "collections/getBySlug",
  async ({ slug, filters = {}, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await collectionService.getBySlug(slug, {
        ...filters,
        page,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "collection not found"));
    }
  },
);

export const createCollection = createAsyncThunk(
  "collections/create",
  async (bodyData, { rejectWithValue }) => {
    try {
      const res = await collectionService.createCollection(bodyData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "collection creation failed"),
      );
    }
  },
);

export const updateCollection = createAsyncThunk(
  "collection/update",
  async ({ id, collectionData }, { rejectWithValue }) => {
    try {
      const res = await collectionService.updateCollection(id, collectionData);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "collection not found"));
    }
  },
);

// ---------------------------------------------------------------------------
// Initial State
// sirf server se aane wala data — filter/sort URL mein rehte hain, yahan nahi
// ---------------------------------------------------------------------------

const initialState = {
  count: 0,
  collections: [],
  collection: "",
  products: [],
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 1,
  },
  facets: {
    brands: [],
    categories: [],
    sizes: [],
    colors: [],
    priceRanges: [],
  },
  loading: false,
  error: null,
};

// -----------------------------------------------------------------------------
// createSlice
// -----------------------------------------------------------------------------

export const collectionsSlice = createSlice({
  name: "collection",
  initialState,
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
        state.pagination = action.payload.pagination;
        state.facets = action.payload.facets;
        state.count = action.payload.pagination.totalCount;
      })
      .addCase(getBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collections.push(action.payload.collection);
        state.count += 1;
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.collection = action.payload.collection || action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default collectionsSlice.reducer;
