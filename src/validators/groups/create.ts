import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @MaxLength(150)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;
}
