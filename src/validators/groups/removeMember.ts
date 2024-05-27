import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RemoveGroupMemberDto {
  @Exists({ table: 'users', column: 'id' })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
