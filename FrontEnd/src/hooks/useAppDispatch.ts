import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useAppDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();

  const safeDispatch = useCallback(
    async <T extends (...args: any[]) => any>(action: ReturnType<T>) => {
      const result = await dispatch(action);
      if (result.error) {
        throw new Error();
      }
      return result.payload;
    },
    [dispatch]
  );

  return safeDispatch;
};
