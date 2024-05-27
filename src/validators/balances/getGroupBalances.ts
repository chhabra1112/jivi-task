import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetGroupBalancesDto {
  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
