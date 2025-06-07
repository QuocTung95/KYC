import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KYC } from '../entities/kyc.entity';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';

@Module({
  imports: [TypeOrmModule.forFeature([KYC])],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}
