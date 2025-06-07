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
  id: string;
  userId: string;
  incomes: Income[];
  assets: Asset[];
  liabilities: Liability[];
  wealthSources: WealthSource[];
  investmentExperience: InvestmentExperience;
  riskTolerance: RiskTolerance;
  netWorth: number;
  status: KYCStatus;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectReason: string | null;
}
