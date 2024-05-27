import { IUser } from '@app/interfaces/user';
import { BaseModel } from '@squareboat/nestjs-objection';
import { GroupModel } from './group';

export class UserModel extends BaseModel implements IUser {
  static tableName = 'users';

  id?: string;
  email?: string;
  groups?: GroupModel[];
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phoneNumber?: string;
  password?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;

  static relationMappings = {
    groups: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: require('./group').GroupModel,
      join: {
        to: 'groups.id',
        through: {
          to: 'group_members.group_id',
          from: 'group_members.user_id',
        },
        from: 'users.id',
      },
    },
  };
}
