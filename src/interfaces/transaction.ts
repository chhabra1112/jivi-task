import { TransactionType } from '@app/constants';
import { ObjectionModel } from '@libs/boat';

export interface ITransaction extends ObjectionModel {
  id?: string;
  groupId?: string;
  name?: string;
  description?: string;
  userId?: string;
  amountInCents?: number;
  currency?: string;
  type?: TransactionType;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
