import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { addressService } from "../../api/addressService"; // ✅ named export — path apna confirm kar lena

// ───── Naya address create karo ─────
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await addressService.createAddress(addressData);
      return res.data; // { success, message, newAddress }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// ───── Logged-in user ke saare addresses laao ─────
export const getUserAddresses = createAsyncThunk(
  "address/getUserAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await addressService.getUserAddresses();
      return res.data; // { success, message, count, addresses }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// ───── Address ko default banao ─────
export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await addressService.setDefaultAddress(addressId);
      return res.data; // { success, message, updatedAddress }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// ───── Address delete karo ─────
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await addressService.deleteAddress(addressId);
      return { ...res.data, addressId }; // delete ke baad list se hatane ke liye id bhi bhej do
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ───── createAddress ─────
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload.newAddress);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───── getUserAddresses ─────
      .addCase(getUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───── setDefaultAddress ─────
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.updatedAddress;
        state.addresses = state.addresses.map(
          (addr) =>
            addr._id === updated._id ? updated : { ...addr, isDefault: false }, // baaki sabka default hata do
        );
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───── deleteAddress ─────
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload.addressId,
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
