import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
import { SendLoginOTPDto } from './sendLoginOTP';

export class VerifyLoginOtpDto extends SendLoginOTPDto {
  @Length(4)
  @IsNumberString()
  @IsString()
  @IsNotEmpty()
  otp: string;
}
