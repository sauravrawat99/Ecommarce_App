import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../api/categoryService";

// 1. Saari Categories Fetch Karo
export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.getCategories();
      return data.allcategory;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 2. Nayi Category Banao
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await categoryService.createCategory(categoryData);
      return data.newCategory;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 🆕 Slice — State + Reducers
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create New
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // naya category list mein add
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
