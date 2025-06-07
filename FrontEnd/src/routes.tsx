import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@components/ProtectedRoute";
import { UserRole } from "@/types/user";

const Login = lazy(() => import("@features/auth/Login"));
const SignIn = lazy(() => import("@features/auth/SignIn"));
const Home = lazy(() => import("@features/home/Home"));
const Profile = lazy(() => import("@features/profile/Profile"));
const KYC = lazy(() => import("@features/kyc/KYC"));
const KYCReview = lazy(() => import("@features/preview/KYCReview"));
const Preview = lazy(() => import("@features/preview/ClientList"));

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.OFFICER]}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/kyc",
    element: (
      <ProtectedRoute>
        <KYC />
      </ProtectedRoute>
    ),
  },
  {
    path: "/kyc/:id",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.OFFICER]}>
        <KYCReview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/preview",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.OFFICER]}>
        <Preview />
      </ProtectedRoute>
    ),
  },
];
