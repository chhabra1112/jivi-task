import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GroupDetailsByIdDto {
  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
