import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetGroupTransactionsDto {
  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
