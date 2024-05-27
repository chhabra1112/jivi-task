import { PaymentMode } from '@app/constants';
import { ISettlement } from '@app/interfaces';
import { BaseModel } from '@squareboat/nestjs-objection';

export class SettlementModel extends BaseModel implements ISettlement {
  static tableName = 'settlements';

  id: string;
  transactionId?: string;
  payeeId?: string;
  payerId?: string;
  paymentMode?: PaymentMode;
  createdAt?: Date;
  updatedAt?: Date;
}
