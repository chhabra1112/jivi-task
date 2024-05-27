import { Exists } from '@libs/boat/validator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddGroupMembersDto {
  @Exists({ table: 'users', column: 'id' }, { each: true })
  @IsString({ each: true })
  @IsNotEmpty()
  members: string[];

  @Exists({ table: 'groups', column: 'id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
