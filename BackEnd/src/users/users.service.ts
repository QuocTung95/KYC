import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { KYC } from '../entities/kyc.entity';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, fullName, email, phone, ...rest } =
      createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.USER,
    });
    await this.userRepository.save(user);

    // Create profile
    const profile = this.profileRepository.create({
      user,
      fullName,
      email,
      phone,
      dateOfBirth: new Date(),
      address: '',
      city: '',
      country: '',
      nationality: '',
      occupation: '',
    });
    await this.profileRepository.save(profile);

    // Return user with profile but without password
    const { password: _, ...result } = user;
    return {
      ...result,
      profile,
    };
  }

  async findAll(query: GetUsersDto) {
    const {
      search,
      role,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.kyc', 'kyc');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR profile.fullName LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => ({
        ...user,
        kyc: user.kyc || null,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'kyc'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      kyc: user.kyc
        ? {
            id: user.kyc.id,
            status: user.kyc.status,
            reviewedAt: user.kyc.reviewedAt,
            netWorth: user.kyc.netWorth,
          }
        : null,
    };
  }

  async findProfile(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update only the fields that are provided in the DTO
    Object.assign(profile, updateProfileDto);

    const updatedProfile = await this.profileRepository.save(profile);

    return updatedProfile;
  }
}
