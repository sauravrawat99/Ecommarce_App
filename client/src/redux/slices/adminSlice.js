import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../api/adminService";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ── Async Thunks ─────────────────────────────────

export const getAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getAllOrders();
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Orders not found"));
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await adminService.updateOrderStatus(id, status);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Status update failed"));
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getAllUsers();
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Users not found"));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await adminService.deleteUser(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "User deletion failed"));
    }
  },
);

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getDashboardStats();
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Stats fetch failed"));
    }
  },
);

// ── Slice ────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    orders: [],
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Get All Orders ──
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Order Status ──
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        // list mein us specific order ko update karo, poori list refetch na karni pade
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Get All Users ──
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete User ──
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // action.meta.arg = dispatch karte waqt jo "id" pass kiya tha
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Dashboard Stats ──
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
