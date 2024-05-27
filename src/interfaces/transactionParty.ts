import { TransactionPartyType } from '@app/constants';
import { ObjectionModel } from '@libs/boat';

export interface ITransactionParty extends ObjectionModel {
  id?: string;
  transactionId?: string;
  userId?: string;
  type?: TransactionPartyType;
  amountInCents?: number;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
