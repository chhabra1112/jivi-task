import { PaymentMode, TransactionType } from '@app/constants';
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
} from 'class-validator';

export class CreateSettlementDto {
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

  @Exists({ table: 'users', column: 'id' })
  @IsString()
  @IsNotEmpty()
  payeeId: string;

  @Exists({ table: 'users', column: 'id' })
  @IsString()
  @IsNotEmpty()
  payerId: string;

  @IsEnum(PaymentMode)
  @IsOptional()
  paymentMode: PaymentMode;
}
