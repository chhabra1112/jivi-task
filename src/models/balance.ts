import { IBalance } from '@app/interfaces';
import { BaseModel } from '@squareboat/nestjs-objection';

export class BalanceModel extends BaseModel implements IBalance {
  static tableName = 'transaction_parties';
  id: string;
  groupId?: string;
  borrowerId?: string;
  lenderId?: string;
  amountInCents?: number;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
