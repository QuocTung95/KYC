import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 10, { message: 'Username must be between 8 and 10 characters' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(12, 16, { message: 'Password must be between 12 and 16 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&!])[A-Za-z\d@#&!]{12,16}$/, {
    message:
      'Password must include letters, numbers, and special characters (@, #, &, !)',
  })
  password: string;
}
