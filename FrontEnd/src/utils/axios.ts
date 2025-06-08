import axios from "axios";
import { message } from "antd";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "./cookies";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  message?: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = cookies.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isLoginRequest = originalRequest.url?.includes("/auth/login");

    // If login 401 → show error, don't call refresh token
    if (error.response?.status === 401 && isLoginRequest) {
      const errorMessage = error.response?.data?.message || "Incorrect username or password";
      message.error(errorMessage);
      return Promise.reject(error);
    }

    // Other request, call refresh token if need
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookies.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await apiClient.post("/auth/refresh", { refreshToken });
        const { accessToken } = response.data;
        cookies.setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        cookies.clearTokens();
        message.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

export default apiClient;
