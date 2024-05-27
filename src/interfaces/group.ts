import { ObjectionModel } from '@libs/boat';

export interface IGroup extends ObjectionModel {
  id?: string;
  name?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
