import apiClient from "@/utils/axios";
import type { KYCData } from "@/types/user";

export const kycService = {
  async getKYCById(id: string): Promise<KYCData> {
    const response = await apiClient.get<KYCData>(`/kyc/${id}`);
    return response.data;
  },

  async create(data: Omit<KYCData, "id" | "status" | "reviewedAt" | "reviewedBy">): Promise<KYCData> {
    const response = await apiClient.post<KYCData>("/kyc", data);
    return response.data;
  },

  async update(id: string, data: Omit<KYCData, "id" | "status" | "reviewedAt" | "reviewedBy">): Promise<KYCData> {
    const response = await apiClient.patch<KYCData>(`/kyc/${id}`, data);
    return response.data;
  },

  getPending: async () => {
    const response = await apiClient.get("/kyc/pending");
    return response.data;
  },

  getReviewed: async () => {
    const response = await apiClient.get("/kyc/reviewed");
    return response.data;
  },

  async approve(id: string): Promise<KYCData> {
    const response = await apiClient.patch<KYCData>(`/kyc/${id}/approve`);
    return response.data;
  },

  async reject(id: string, reason: string): Promise<KYCData> {
    const response = await apiClient.patch<KYCData>(`/kyc/${id}/reject`, { reason });
    return response.data;
  },

  // Officer endpoints
  async getAllKYC(params?: {
    status?: "pending" | "approved" | "rejected";
    page?: number;
    limit?: number;
  }): Promise<{ data: KYCData[]; total: number }> {
    const response = await apiClient.get("/kyc/all", { params });
    return response.data;
  },
};
