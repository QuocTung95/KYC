import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(8)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(12)
  @MaxLength(16)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#&!]).*$/,
    {
      message:
        'Password must contain uppercase, lowercase, number and special character (@, #, &, !)',
    },
  )
  password: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  nationality: string;

  @IsString()
  occupation: string;
}
