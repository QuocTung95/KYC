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
  async getProfile(): Promise<Profile> {
    const response = await apiClient.get<Profile>("/profile");
    return response.data;
  },

  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ): Promise<Profile> {
    const response = await apiClient.patch<Profile>(
      `/users/${userId}/profile`,
      data
    );
    return response.data;
  },

  async uploadDocument(
    file: File,
    type: string
  ): Promise<{ documentUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const response = await apiClient.post<{ documentUrl: string }>(
      "/profile/documents",
      formData
    );
    return response.data;
  },

  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/profile/documents/${documentId}`
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },

  async getClients(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> {
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

  async getClientById(clientId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/clients/${clientId}`);
    return response.data;
  },

  async updateClientStatus(clientId: string, status: string): Promise<User> {
    const response = await apiClient.patch<User>(
      `/users/clients/${clientId}/status`,
      { status }
    );
    return response.data;
  },

  async deleteClient(clientId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/users/clients/${clientId}`
    );
    return response.data;
  },
};
