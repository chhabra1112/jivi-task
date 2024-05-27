import { ObjectionModel } from '@libs/boat';
import { IGroup } from './group';

export interface IUser extends ObjectionModel {
  id?: string;
  email?: string;
  groups?: IGroup[];
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phoneNumber?: string;
  password?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
