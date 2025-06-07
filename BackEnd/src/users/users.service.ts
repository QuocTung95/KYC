import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, fullName, email, phone, ...rest } =
      createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.dataSource.transaction(async (manager) => {
      const user = manager.getRepository(User).create({
        username,
        password: hashedPassword,
        role: UserRole.USER,
      });
      await manager.getRepository(User).save(user);

      const profile = manager.getRepository(Profile).create({
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
      await manager.getRepository(Profile).save(profile);

      const { password: _, ...result } = user;
      return {
        ...result,
        profile,
      };
    });
  }

  async findAll(query: GetUsersDto) {
    const {
      search,
      role,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status,
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

    // Apply filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('kyc.status = :status', { status });
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
      kyc: user.kyc ? user.kyc : null,
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
