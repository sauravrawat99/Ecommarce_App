/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../api/authService";

// ─── Async Thunks ─────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.register(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await authService.login(credentials);


      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const res = await authService.getProfile();
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile fetch failed",
      );
    }
  },
);

// ─── Initial State — Safe Parsing ──────────────────────

const token = localStorage.getItem("token");

// FIX: try-catch lagaya — corrupt/invalid data ho toh crash na ho
let user = null;
try {
  const storedUser = localStorage.getItem("user");
  // FIX: "undefined" string ko bhi check karo, sirf null nahi
  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (e) {
  user = null;
  // corrupt data mila — localStorage clean kar do
  localStorage.removeItem("user");
}

// ─── Slice ─────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user || null,
    token: token || null,
    isLoggedIn: !!token,
    isAdmin: user?.role === "admin" || false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserState: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder

      // ── Register ──
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Logout ──
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })

      // ── Get Profile ──
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAdmin = action.payload.user?.role === "admin";
      });
  },
});

export const { clearError, updateUserState } = authSlice.actions;
export default authSlice.reducer;
