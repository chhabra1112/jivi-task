import { PaymentMode, TransactionPartyType } from '@app/constants';
import { ObjectionModel } from '@libs/boat';

export interface ISettlement extends ObjectionModel {
  id?: string;
  transactionId?: string;
  payeeId?: string;
  payerId?: string;
  paymentMode?: PaymentMode;
  createdAt?: Date;
  updatedAt?: Date;
}
