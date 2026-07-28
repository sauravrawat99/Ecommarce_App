import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../api/orderService";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ shippingAddress, paymentMethod }, { rejectWithValue }) => {
    try {
      const res = await orderService.createOrder(
        shippingAddress,
        paymentMethod,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Order creation failed",
      );
    }
  },
);

export const myOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.myOrders();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Orders fetch unsuccessful",
      );
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderService.cancelOrder(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Order cancellation failed",
      );
    }
  },
);

export const singleOrder = createAsyncThunk(
  "order/singleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderService.singleOrder(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Order not found",
      );
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await orderService.updateOrderStatus(id, status);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Status update failed",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ── Create Order ──
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── My Orders ──
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Single Order ──
      .addCase(singleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(singleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(singleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete/Cancel Order ──
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o._id !== action.meta.arg);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Order Status ──
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
