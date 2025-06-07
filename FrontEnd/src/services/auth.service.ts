import apiClient from "@/utils/axios";
import type { User } from "@/types/user";
import { cookies } from "@/utils/cookies";

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface SignInRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    const { accessToken, refreshToken } = response.data;

    cookies.setAccessToken(accessToken);
    cookies.setRefreshToken(refreshToken);

    return response.data;
  },

  async signIn(data: SignInRequest): Promise<void> {
    await apiClient.post("/users", data);
  },

  async logout(): Promise<void> {
    const refreshToken = cookies.getRefreshToken();
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refreshToken });
    }

    cookies.clearTokens();
  },
};
