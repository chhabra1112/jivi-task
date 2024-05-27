import { ITransactionParty } from '@app/interfaces';
import { BaseModel } from '@squareboat/nestjs-objection';
import { UserModel } from './user';
import { TransactionPartyType } from '@app/constants';

export class TransactionPartyModel
  extends BaseModel
  implements ITransactionParty
{
  static tableName = 'transaction_parties';
  id: string;
  transactionId?: string;
  userId?: string;
  type?: TransactionPartyType;
  amountInCents?: number;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
