import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { getUserProfile } from "./userSlice";

interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: true,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { dispatch }) => {
    const response = await authService.login(credentials);
    // After successful login, fetch user profile
    await dispatch(getUserProfile());
    // Navigate based on user role
    if (response.user.role === "OFFICER") {
      window.location.href = "/preview";
    } else {
      window.location.href = "/profile";
    }
    return response.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  window.location.href = "/login";
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
  const user = await userService.getCurrentUser();
  return user;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message || "Logout failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
