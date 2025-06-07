import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import {
  InvestmentExperience,
  RiskTolerance,
  Income,
  Asset,
  Liability,
  WealthSource,
} from '../../entities/kyc.entity';

class IncomeDto implements Income {
  @IsEnum(['SALARY', 'INVESTMENT', 'OTHERS'])
  type: 'SALARY' | 'INVESTMENT' | 'OTHERS';

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

class AssetDto implements Asset {
  @IsEnum(['BOND', 'LIQUIDITY', 'REAL_ESTATE', 'OTHERS'])
  type: 'BOND' | 'LIQUIDITY' | 'REAL_ESTATE' | 'OTHERS';

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

class LiabilityDto implements Liability {
  @IsEnum(['LOAN', 'REAL_ESTATE_LOAN', 'OTHERS'])
  type: 'LOAN' | 'REAL_ESTATE_LOAN' | 'OTHERS';

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

class WealthSourceDto implements WealthSource {
  @IsEnum(['INHERITANCE', 'DONATION'])
  type: 'INHERITANCE' | 'DONATION';

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateKycDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => IncomeDto)
  incomes: IncomeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AssetDto)
  assets: AssetDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LiabilityDto)
  liabilities: LiabilityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WealthSourceDto)
  wealthSources: WealthSourceDto[];

  @IsEnum(InvestmentExperience)
  investmentExperience: InvestmentExperience;

  @IsEnum(RiskTolerance)
  riskTolerance: RiskTolerance;
}
