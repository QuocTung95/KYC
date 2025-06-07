import apiClient from "@/utils/axios";
import type { UserFilters, Profile, User } from "@/types/user";

interface UpdateProfileDto {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  nationality: string;
  occupation: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userService = {
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<Profile> {
    const response = await apiClient.patch<Profile>(`/users/${userId}/profile`, data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },

  async getClients(page: number = 1, limit: number = 10, filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    const response = await apiClient.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  },
};
