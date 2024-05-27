import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDebtDto {
  @Exists({ table: 'transactions', column: 'id' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
