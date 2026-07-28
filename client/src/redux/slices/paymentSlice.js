import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "../../api/paymentService";

// Step 1 — Razorpay order create karo
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await paymentService.createPayment(orderId);
      return res.data; // { success, razorpayOrder, key }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment creation failed",
      );
    }
  },
);

// Step 2 — Payment verify karo
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await paymentService.verifyPayment(paymentData);
      return res.data; // { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment verification failed",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    razorpayOrder: null,
    razorpayKey: null,
    isVerified: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.razorpayOrder = null;
      state.razorpayKey = null;
      state.isVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Create Payment ──
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.razorpayOrder = action.payload.razorpayOrder;
        state.razorpayKey = action.payload.key;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Verify Payment ──
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.isVerified = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
