import { ObjectionModel } from '@libs/boat';

export interface IUser extends ObjectionModel {
  id?: string;
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
