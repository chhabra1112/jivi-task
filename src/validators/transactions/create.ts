import { TransactionType } from '@app/constants';
import { Exists } from '@libs/boat/validator';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class TransactionPartyDto {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object) => !('percentage' in object))
  amountInCents?: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object) => !('amountInCents' in object))
  percentage?: number;

  @Exists({ table: 'users', column: 'id' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CreateTransactionDto {
  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  amountInCents: number;

  @IsIn(['INR'])
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ValidateNested({ each: true })
  @Type(() => TransactionPartyDto)
  @IsArray()
  borrowers: TransactionPartyDto[];

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TransactionPartyDto)
  @IsArray()
  lenders: TransactionPartyDto[];

  @IsDate()
  @IsOptional()
  paidAt: Date;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  description: string;
}
