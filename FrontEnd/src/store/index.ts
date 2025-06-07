import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userReducer from "./slices/userSlice";
import kycReducer from "./slices/kycSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    kyc: kycReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
