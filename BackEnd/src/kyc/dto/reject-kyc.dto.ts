import { IsString, IsNotEmpty } from 'class-validator';

export class RejectKycDto {
  @IsString()
  @IsNotEmpty({ message: 'Reject reason is required' })
  reason: string;
}
