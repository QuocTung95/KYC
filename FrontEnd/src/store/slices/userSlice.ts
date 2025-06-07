import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user.service";
import { SortOrder, UserFilters, UserRole, type User } from "@/types/user";
import { cookies } from "@/utils/cookies";

interface PaginationMeta {
  current: number;
  pageSize: number;
  total: number;
}

interface UserState {
  user?: User;
  clients: User[];
  loading: boolean;
  loadingClientList: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  pagination: PaginationMeta;
  filters: UserFilters;
}

const initialState: UserState = {
  user: undefined,
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
    sortOrder: SortOrder.ASC,
    role: UserRole.CLIENT,
  },
};

export const getCurrentUser = createAsyncThunk("users/me", async () => {
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined;
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
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
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
      });
  },
});

export const { clearUser, setFilters, setPagination } = userSlice.actions;
export default userSlice.reducer;
