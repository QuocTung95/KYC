import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './user.entity';

export enum InvestmentExperience {
  LESS_THAN_5_YEARS = 'LESS_THAN_5_YEARS',
  BETWEEN_5_AND_10_YEARS = 'BETWEEN_5_AND_10_YEARS',
  MORE_THAN_10_YEARS = 'MORE_THAN_10_YEARS',
}

export enum RiskTolerance {
  TEN_PERCENT = 'TEN_PERCENT',
  THIRTY_PERCENT = 'THIRTY_PERCENT',
  ALL_IN = 'ALL_IN',
}

export enum KYCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Income {
  type: 'SALARY' | 'INVESTMENT' | 'OTHERS';
  amount: number;
  description?: string;
}

export interface Asset {
  type: 'BOND' | 'LIQUIDITY' | 'REAL_ESTATE' | 'OTHERS';
  amount: number;
  description?: string;
}

export interface Liability {
  type: 'LOAN' | 'REAL_ESTATE_LOAN' | 'OTHERS';
  amount: number;
  description?: string;
}

export interface WealthSource {
  type: 'INHERITANCE' | 'DONATION';
  amount: number;
  description?: string;
}

@Entity()
export class KYC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.kyc, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column('jsonb')
  incomes: Income[];

  @Column('jsonb')
  assets: Asset[];

  @Column('jsonb')
  liabilities: Liability[];

  @Column('jsonb')
  wealthSources: WealthSource[];

  @Column({
    type: 'enum',
    enum: InvestmentExperience,
    default: InvestmentExperience.LESS_THAN_5_YEARS,
  })
  investmentExperience: InvestmentExperience;

  @Column({
    type: 'enum',
    enum: RiskTolerance,
    default: RiskTolerance.TEN_PERCENT,
  })
  riskTolerance: RiskTolerance;

  @Column('decimal', { precision: 15, scale: 2 })
  netWorth: number;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
  })
  status: KYCStatus;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'text', nullable: true })
  rejectReason: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  calculateNetWorth() {
    const totalAssets = this.assets.reduce(
      (sum, asset) => sum + asset.amount,
      0,
    );
    const totalLiabilities = this.liabilities.reduce(
      (sum, liability) => sum + liability.amount,
      0,
    );
    this.netWorth = totalAssets - totalLiabilities;
  }
}
