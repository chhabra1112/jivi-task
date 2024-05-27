import { BalanceModel } from '@app/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface BalanceRepositoryContract
  extends RepositoryContract<BalanceModel> {}
