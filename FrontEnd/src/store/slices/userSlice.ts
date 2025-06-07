import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user.service";
import { UserRole, type User, type UserRoleType } from "@/types/user";
import { cookies } from "@/utils/cookies";

interface PaginationMeta {
  current: number;
  pageSize: number;
  total: number;
}

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  role: UserRoleType;
}

interface UserState {
  user: User | null;
  clients: User[];
  loading: boolean;
  loadingClientList: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  pagination: PaginationMeta;
  filters: FilterState;
}

const initialState: UserState = {
  user: null,
  clients: [],
  loading: false,
  loadingClientList: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
    role: UserRole.CLIENT,
  },
};

export const updateUserProfile = createAsyncThunk("users/updateProfile", async ({ userId, ...rest }: any) => {
  const fullNameParts = [rest.firstName, rest.middleName, rest.lastName].filter(Boolean).join(" ");

  const preferredEmail = rest.contactInfo?.find((c: any) => c.type === "EMAIL" && c.isPreferred)?.value;

  const phone = rest.contactInfo?.find((c: any) => c.type === "PHONE")?.value;
  const addressEntry = rest.addressInfo?.[0];
  const body = {
    fullName: fullNameParts || undefined,
    email: preferredEmail || undefined,
    phone: phone || undefined,
    dateOfBirth: rest.dateOfBirth || undefined,
    address: addressEntry?.street || undefined,
    city: addressEntry?.city || undefined,
    country: addressEntry?.country || undefined,
  };
  const response = await userService.updateProfile(userId, body);
  return response;
});

export const getUserProfile = createAsyncThunk("users/me", async () => {
  const accessToken = cookies.getAccessToken();
  if (!accessToken) return;
  const response = await userService.getCurrentUser();
  return response;
});

export const getClientList = createAsyncThunk<any, void>("users/list", async (_, { getState }) => {
  const state = getState() as { user: UserState };
  const { pagination, filters } = state.user;
  const response = await userService.getClients(pagination.current, pagination.pageSize, filters);
  return response;
});

export const deleteClient = createAsyncThunk("users/delete", async (clientId: string, { dispatch }) => {
  await userService.deleteClient(clientId);
  // Refresh the client list after deletion
  await dispatch(getClientList());
  return clientId;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      cookies.clearTokens();
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.profile = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.initialized = true;
        state.error = action.error.message || "Failed to fetch profile";
      })
      .addCase(getClientList.pending, (state) => {
        state.loadingClientList = true;
        state.error = null;
      })
      .addCase(getClientList.fulfilled, (state, action) => {
        state.loadingClientList = false;
        state.clients = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.meta.total,
        };
      })
      .addCase(getClientList.rejected, (state, action) => {
        state.loadingClientList = false;
        state.error = action.error.message || "Failed to fetch client list";
      })
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete client";
      });
  },
});

export const { clearUser, setFilters, setPagination } = userSlice.actions;
export default userSlice.reducer;
