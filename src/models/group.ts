import { IGroup } from '@app/interfaces';
import { BaseModel } from '@squareboat/nestjs-objection';
import { UserModel } from './user';

export class GroupModel extends BaseModel implements IGroup {
  static tableName = 'groups';

  id: string;
  name: string;
  userId: string;
  members?: UserModel[];
  createdAt: Date;
  updatedAt: Date;

  static relationMappings = {
    members: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: 'groups.id',
        through: {
          from: 'group_members.group_id',
          to: 'group_members.user_id',
        },
        to: 'users.id',
      },
    },
  };
}
