import { useEffect } from "react";
import { Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getCurrentUser } from "@/store/slices/userSlice";
import { Navigate } from "react-router-dom";

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useAppDispatch();
  const { initialized, loading, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!initialized) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, initialized]);

  if (loading || !initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (user && initialized && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
