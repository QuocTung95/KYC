import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { cookies } from "@/utils/cookies";
import { getCurrentUser } from "@/store/slices/auth.slice";

export const useAppInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = cookies.getAccessToken();
      if (accessToken) {
        try {
          await dispatch(getCurrentUser());
        } catch (error) {
          // If getCurrentUser fails, the error will be handled in the slice
          cookies.clearTokens();
        }
      }
    };

    initAuth();
  }, [dispatch]);
};
