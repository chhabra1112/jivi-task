import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class SendLoginOTPDto {
  @Equals('+91')
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object) => !object.email)
  countryCode: string;

  @IsNotEmpty()
  @Matches(/^[1-9]\d{9}$/, {
    message: 'The phone number should be 10 digits in the correct format.',
  })
  @ValidateIf((object) => !object.email)
  phoneNumber: string;

  @IsEmail()
  @IsString()
  @ValidateIf((object) => !object.countryCode)
  email: string;
}
