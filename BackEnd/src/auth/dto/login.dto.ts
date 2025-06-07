import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 10, { message: 'Username must be between 8 and 10 characters' })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
