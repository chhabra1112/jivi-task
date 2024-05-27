import { ObjectionModel } from '@libs/boat';

export interface IBalance extends ObjectionModel {
  id?: string;
  groupId?: string;
  borrowerId?: string;
  lenderId?: string;
  amountInCents?: number;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
