import { TransactionModel } from '@app/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface TransactionRepositoryContract
  extends RepositoryContract<TransactionModel> {}
