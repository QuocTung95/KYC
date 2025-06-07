import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import {
  KYC,
  InvestmentExperience,
  RiskTolerance,
  KYCStatus,
} from '../entities/kyc.entity';
import dataSource from '../config/data-source';

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('TRUNCATE TABLE "kyc" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "profile" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "user" CASCADE');
      await queryRunner.commitTransaction();
      console.log('Existing data cleared');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // Hash passwords
    const saltRounds = 10;
    const userPassword = await bcrypt.hash('Admin@123456', saltRounds);
    const officerPassword = await bcrypt.hash('Admin@123456', saltRounds);

    // Create regular user
    const user = new User();
    user.username = 'tung.dev';
    user.password = userPassword;
    user.role = UserRole.USER;
    await dataSource.manager.save(user);

    // Create user's profile
    const profile = new Profile();
    profile.user = user;
    profile.fullName = 'Nguyen Quoc Tung';
    profile.email = 'tung.dev@example.com';
    profile.phone = '+84366313295';
    profile.dateOfBirth = new Date('1990-01-15');
    profile.address = '123 Cau Giay';
    profile.city = 'Ha Noi';
    profile.country = 'Vietnam';
    profile.nationality = 'Vietnamese';
    profile.occupation = 'Software Engineer';
    await dataSource.manager.save(profile);

    // Create user's KYC
    const kyc = new KYC();
    kyc.user = user;
    kyc.incomes = [
      {
        type: 'SALARY',
        amount: 95000,
        description: 'Annual salary from Tech Corp',
      },
      {
        type: 'INVESTMENT',
        amount: 15000,
        description: 'Stock market returns',
      },
    ];
    kyc.assets = [
      {
        type: 'BOND',
        amount: 50000,
        description: 'Government bonds',
      },
      {
        type: 'REAL_ESTATE',
        amount: 300000,
        description: 'Primary residence',
      },
    ];
    kyc.liabilities = [
      {
        type: 'REAL_ESTATE_LOAN',
        amount: 200000,
        description: 'Mortgage',
      },
    ];
    kyc.wealthSources = [
      {
        type: 'INHERITANCE',
        amount: 100000,
        description: 'Family inheritance',
      },
    ];
    kyc.investmentExperience = InvestmentExperience.BETWEEN_5_AND_10_YEARS;
    kyc.riskTolerance = RiskTolerance.THIRTY_PERCENT;
    kyc.status = KYCStatus.PENDING;
    kyc.rejectReason = null;
    await dataSource.manager.save(kyc);

    // Create officer
    const officer = new User();
    officer.username = 'tung.dev2';
    officer.password = officerPassword;
    officer.role = UserRole.OFFICER;
    await dataSource.manager.save(officer);

    // Create officer's profile
    const officerProfile = new Profile();
    officerProfile.user = officer;
    officerProfile.fullName = 'Nguyen Quoc Tung (Officer)';
    officerProfile.email = 'officer.tung@company.com';
    officerProfile.phone = '+84987654321';
    officerProfile.dateOfBirth = new Date('1985-06-20');
    officerProfile.address = '456 Tran Duy Hung';
    officerProfile.city = 'Ha Noi';
    officerProfile.country = 'Vietnam';
    officerProfile.nationality = 'Vietnamese';
    officerProfile.occupation = 'Compliance Officer';
    await dataSource.manager.save(officerProfile);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
