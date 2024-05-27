import { ITransaction } from '@app/interfaces';
import { BaseModel } from '@squareboat/nestjs-objection';
import { UserModel } from './user';
import { TransactionType } from '@app/constants';
import { TransactionPartyModel } from './transactionParty';

export class TransactionModel extends BaseModel implements ITransaction {
  static tableName = 'transactions';
  id: string;
  groupId?: string;
  name?: string;
  description?: string;
  userId?: string;
  amountInCents?: number;
  currency?: string;
  type?: TransactionType;
  paidAt?: Date;
  parties?: TransactionPartyModel[];
  createdAt?: Date;
  updatedAt?: Date;
  static relationMappings = {
    parties: {
      relation: BaseModel.HasManyRelation,
      modelClass: TransactionPartyModel,
      join: {
        from: 'transactions.id',
        to: 'transaction_parties.transactionId',
      },
    },
  };
}
