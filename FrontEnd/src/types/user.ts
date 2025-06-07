import { KYCData } from "./kyc";

export interface Profile {
  id: string;
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

export type UpdateProfileDto = Omit<Profile, "id">;

export enum UserRole {
  OFFICER = "OFFICER",
  CLIENT = "USER",
}
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
export type UserRoleType = UserRole.CLIENT | UserRole.OFFICER;

export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface UserFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: SortOrder.ASC | SortOrder.DESC;
  role: UserRoleType;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  profile: Profile;
  kyc?: KYCData;
  createdAt: string;
  updatedAt: string;
}
