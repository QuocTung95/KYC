import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KYC, KYCStatus } from '../entities/kyc.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { RejectKycDto } from './dto/reject-kyc.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(KYC)
    private kycRepository: Repository<KYC>,
  ) {}

  async create(user: User, createKycDto: CreateKycDto) {
    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('Only users can submit KYC');
    }

    const existingKyc = await this.kycRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingKyc) {
      throw new ForbiddenException('KYC already exists for this user');
    }

    const kyc = this.kycRepository.create({
      ...createKycDto,
      user,
      status: KYCStatus.PENDING,
    });

    return this.kycRepository.save(kyc);
  }

  async findPending() {
    return this.kycRepository.find({
      where: { status: KYCStatus.PENDING },
      relations: ['user'],
      order: {
        reviewedAt: 'DESC',
        user: { createdAt: 'ASC' },
      },
    });
  }

  async findReviewed() {
    return this.kycRepository.find({
      where: [{ status: KYCStatus.APPROVED }, { status: KYCStatus.REJECTED }],
      relations: ['user'],
      order: { reviewedAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const kyc = await this.kycRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }

    return kyc;
  }

  async approve(id: string, officer: User) {
    if (officer.role !== UserRole.OFFICER) {
      throw new ForbiddenException('Only officers can approve KYC');
    }

    const kyc = await this.findOne(id);

    if (kyc.status !== KYCStatus.PENDING) {
      throw new ForbiddenException('KYC is not in pending status');
    }

    kyc.status = KYCStatus.APPROVED;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = officer.id;

    return this.kycRepository.save(kyc);
  }

  async reject(id: string, officer: User, rejectDto: RejectKycDto) {
    if (officer.role !== UserRole.OFFICER) {
      throw new ForbiddenException('Only officers can reject KYC');
    }

    const kyc = await this.findOne(id);

    if (kyc.status !== KYCStatus.PENDING) {
      throw new ForbiddenException('KYC is not in pending status');
    }

    kyc.status = KYCStatus.REJECTED;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = officer.id;
    kyc.rejectReason = rejectDto.reason;

    return this.kycRepository.save(kyc);
  }

  async update(id: string, updateKycDto: UpdateKycDto) {
    const kyc = await this.findOne(id);

    if (kyc.status === KYCStatus.APPROVED) {
      throw new ForbiddenException('Cannot update an approved KYC');
    }

    Object.assign(kyc, updateKycDto);
    kyc.status = KYCStatus.PENDING;
    kyc.reviewedAt = null;
    kyc.reviewedBy = null;

    return this.kycRepository.save(kyc);
  }
}
