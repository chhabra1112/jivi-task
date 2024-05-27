import { TransactionPartyModel } from '@app/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface TransactionPartyRepositoryContract
  extends RepositoryContract<TransactionPartyModel> {}
