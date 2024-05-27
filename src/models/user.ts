import { IUser } from '@app/interfaces/user';
import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel implements IUser {
  static tableName = 'users';

  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phoneNumber?: string;
  password?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
