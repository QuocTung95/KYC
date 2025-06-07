import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { kycService } from "@/services/kyc.service";
import type { KYCData } from "@/types/user";

interface KYCState {
  data: KYCData | null;
  pendingList: KYCData[];
  reviewedList: KYCData[];
  loading: boolean;
  error: string | null;
}

const initialState: KYCState = {
  data: null,
  pendingList: [],
  reviewedList: [],
  loading: false,
  error: null,
};

export const submitKYC = createAsyncThunk(
  "kyc/submit",
  async (data: Omit<KYCData, "id" | "status" | "reviewedAt" | "reviewedBy">) => {
    const response = await kycService.create(data);
    return response;
  }
);

export const updateKYC = createAsyncThunk(
  "kyc/update",
  async ({ id, data }: { id: string; data: Omit<KYCData, "id" | "status" | "reviewedAt" | "reviewedBy"> }) => {
    const response = await kycService.update(id, data);
    return response;
  }
);

export const getKYCById = createAsyncThunk("kyc/getById", async (id: string) => {
  const response = await kycService.getById(id);
  return response;
});

export const getPendingKYCs = createAsyncThunk("kyc/getPending", async () => {
  const response = await kycService.getPending();
  return response;
});

export const getReviewedKYCs = createAsyncThunk("kyc/getReviewed", async () => {
  const response = await kycService.getReviewed();
  return response;
});

export const approveKYC = createAsyncThunk("kyc/approve", async (id: string) => {
  const response = await kycService.approve(id);
  return response;
});

export const rejectKYC = createAsyncThunk("kyc/reject", async (id: string) => {
  const response = await kycService.reject(id);
  return response;
});

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    clearKYC: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit KYC
      .addCase(submitKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(submitKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit KYC";
      })
      // Update KYC
      .addCase(updateKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Update in pending list if exists
        const pendingIndex = state.pendingList.findIndex((kyc) => kyc.id === action.payload.id);
        if (pendingIndex !== -1) {
          state.pendingList[pendingIndex] = action.payload;
        }
      })
      .addCase(updateKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update KYC";
      })
      // Get KYC by ID
      .addCase(getKYCById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKYCById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getKYCById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch KYC";
      })
      // Get Pending KYCs
      .addCase(getPendingKYCs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingKYCs.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload;
      })
      .addCase(getPendingKYCs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch pending KYCs";
      })
      // Get Reviewed KYCs
      .addCase(getReviewedKYCs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewedKYCs.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewedList = action.payload;
      })
      .addCase(getReviewedKYCs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviewed KYCs";
      })
      // Approve KYC
      .addCase(approveKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Remove from pending list and add to reviewed list
        state.pendingList = state.pendingList.filter((kyc) => kyc.id !== action.payload.id);
        state.reviewedList = [action.payload, ...state.reviewedList];
      })
      .addCase(approveKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to approve KYC";
      })
      // Reject KYC
      .addCase(rejectKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Remove from pending list and add to reviewed list
        state.pendingList = state.pendingList.filter((kyc) => kyc.id !== action.payload.id);
        state.reviewedList = [action.payload, ...state.reviewedList];
      })
      .addCase(rejectKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reject KYC";
      });
  },
});

export const { clearKYC } = kycSlice.actions;
export default kycSlice.reducer;
