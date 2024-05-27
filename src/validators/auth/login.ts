import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class PasswordLoginDto {
  @MaxLength(16)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsString()
  @ValidateIf((object) => !object.countryCode)
  email: string;
}
