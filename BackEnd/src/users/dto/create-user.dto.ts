import { IsString, Length, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(8, 10, { message: 'Username must be between 8 and 10 characters' })
  username: string;

  @IsString()
  @Length(12, 16, { message: 'Password must be between 12 and 16 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&!])[A-Za-z\d@#&!]{12,16}$/, {
    message:
      'Password must include letters, numbers, and special characters (@, #, &, !)',
  })
  password: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;
}
