import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { RejectKycDto } from './dto/reject-kyc.dto';

@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @Roles(UserRole.USER)
  async create(@Request() req, @Body() createKycDto: CreateKycDto) {
    return this.kycService.create(req.user, createKycDto);
  }

  @Get('pending')
  @Roles(UserRole.OFFICER)
  async findPending() {
    return this.kycService.findPending();
  }

  @Get('reviewed')
  @Roles(UserRole.OFFICER)
  async findReviewed() {
    return this.kycService.findReviewed();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const kyc = await this.kycService.findOne(id);

    if (req.user.role !== UserRole.OFFICER && kyc.user.id !== req.user.id) {
      throw new ForbiddenException('You can only view your own KYC');
    }

    return kyc;
  }

  @Patch(':id/approve')
  @Roles(UserRole.OFFICER)
  async approve(@Param('id') id: string, @Request() req) {
    return this.kycService.approve(id, req.user);
  }

  @Patch(':id/reject')
  @Roles(UserRole.OFFICER)
  async reject(
    @Param('id') id: string,
    @Request() req,
    @Body() rejectDto: RejectKycDto,
  ) {
    return this.kycService.reject(id, req.user, rejectDto);
  }

  @Patch(':id')
  @Roles(UserRole.USER)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateKycDto: UpdateKycDto,
  ) {
    const kyc = await this.kycService.findOne(id);

    if (kyc.user.id !== req.user.id) {
      throw new ForbiddenException('You can only update your own KYC');
    }

    return this.kycService.update(id, updateKycDto);
  }
}
