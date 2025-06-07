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

export enum UserRole {
  OFFICER = "OFFICER",
  CLIENT = "USER",
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
  sortOrder?: "ASC" | "DESC";
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  profile: Profile;
  kyc?: KYC;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
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

export interface ContactInfo {
  type: "EMAIL" | "PHONE";
  value: string;
  isPreferred: boolean;
}

export interface AddressInfo {
  type: "HOME" | "WORK" | "OTHER";
  country: string;
  city: string;
  street: string;
  postalCode?: string;
}

export interface IdentificationDoc {
  type: "PASSPORT" | "NATIONAL_ID" | "DRIVERS_LICENSE";
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  documentUrl: string;
}

export interface EmploymentHistory {
  employerName: string;
  position: string;
  fromYear: number;
  toYear?: number;
  isCurrentEmployer: boolean;
}

export interface KYC {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt: string | null;
  netWorth: string;
}

export enum InvestmentExperience {
  LESS_THAN_5_YEARS = "LESS_THAN_5_YEARS",
  BETWEEN_5_AND_10_YEARS = "BETWEEN_5_AND_10_YEARS",
  MORE_THAN_10_YEARS = "MORE_THAN_10_YEARS",
}

export enum RiskTolerance {
  TEN_PERCENT = "TEN_PERCENT",
  THIRTY_PERCENT = "THIRTY_PERCENT",
  ALL_IN = "ALL_IN",
}

export enum KYCStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type IncomeType = "SALARY" | "INVESTMENT" | "OTHERS";
export type AssetType = "BOND" | "LIQUIDITY" | "REAL_ESTATE" | "OTHERS";
export type LiabilityType = "LOAN" | "REAL_ESTATE_LOAN" | "OTHERS";
export type WealthSourceType = "INHERITANCE" | "DONATION";

export interface Income {
  type: IncomeType;
  amount: number;
  description?: string;
}

export interface Asset {
  type: AssetType;
  amount: number;
  description?: string;
}

export interface Liability {
  type: LiabilityType;
  amount: number;
  description?: string;
}

export interface WealthSource {
  type: WealthSourceType;
  amount: number;
  description?: string;
}

export interface KYCData {
  id?: string;
  userId?: string;
  incomes: Income[];
  assets: Asset[];
  liabilities: Liability[];
  wealthSources: WealthSource[];
  investmentExperience: InvestmentExperience;
  riskTolerance: RiskTolerance;
  netWorth: number;
  status: KYCStatus;
  reviewedAt?: Date;
  reviewedBy?: string;
}
